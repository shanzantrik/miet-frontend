import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { FaMicrophone } from 'react-icons/fa';

type Consultant = {
  id: number;
  name: string;
  city?: string;
  expertise?: string;
  mode?: string;
  image?: string;
  location?: string;
  lat?: number;
  lng?: number;
  email?: string;
  phone?: string;
};

const MODES = ['All', 'Online', 'At Home'];
const PAGE_SIZE = 5;
const defaultCenter = { lat: 28.6139, lng: 77.2090 };

// Add the haversine function back above the SearchPanel component
function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function SearchPanel() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search Special Education and Mental Health Professionals, Services, Schools, etc.');
  const [mode, setMode] = useState('All');
  const [page, setPage] = useState(1);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [nearby, setNearby] = useState(false);
  const [city, setCity] = useState('Delhi');
  const [cityLoading, setCityLoading] = useState(false);
  const leftRef = useRef<HTMLDivElement>(null);
  const [mapHeight, setMapHeight] = useState(500);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [bookingConsultant, setBookingConsultant] = useState<Consultant | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [listening, setListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const [geoAddresses, setGeoAddresses] = useState<{ [id: number]: string }>({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let SpeechRecognition: any = undefined;
  if (typeof window !== 'undefined') {
    SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  }

  // Helper to fetch address from lat/lng
  const fetchAddress = useCallback(async (id: number, lat: string, lng: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        setGeoAddresses(prev => ({ ...prev, [id]: data.results[0].formatted_address }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    const fetchConsultants = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:4000/api/consultants/public');
        const data = await res.json();
        console.log('API response for consultants:', data); // Debug backend data
        // Parse lat/lng if present in location string
        const parsed = data.map((c: any) => {
          let lat, lng;
          if (c.location && typeof c.location === 'string' && c.location.includes(',')) {
            const [latStr, lngStr] = c.location.split(',');
            lat = parseFloat(latStr);
            lng = parseFloat(lngStr);
          }
          return { ...c, lat: lat ?? undefined, lng: lng ?? undefined };
        });
        setConsultants(parsed);
      } catch (e) {
        setConsultants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultants();
  }, []);

  // Filter consultants by search and mode
  let filteredConsultants = consultants.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.expertise?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase());
    const matchesMode = mode === 'All' || c.mode === mode;
    return matchesSearch && matchesMode;
  });

  // Handle Nearby click: get user location
  const handleNearby = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setMapCenter(loc);
          setNearby(true);
          setMode('All');
          setPage(1);
        },
        () => {
          alert('Could not get your location. Showing default nearby results.');
          setNearby(true);
          setMode('All');
          setPage(1);
        }
      );
    } else {
      alert('Geolocation not supported.');
      setNearby(true);
      setMode('All');
      setPage(1);
    }
  };

  // Sort by proximity if 'Nearby' is active
  if (nearby) {
    const center = userLocation || defaultCenter;
    filteredConsultants = [...filteredConsultants].sort((a, b) =>
      haversine(center.lat, center.lng, a.lat, a.lng) -
      haversine(center.lat, center.lng, b.lat, b.lng)
    );
  }

  // Pagination
  const totalPages = Math.ceil(filteredConsultants.length / PAGE_SIZE);
  const paginated = filteredConsultants.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // On mount or when paginated changes, fetch addresses for those with lat/lng
  useEffect(() => {
    paginated.forEach(c => {
      if (c.location && !geoAddresses[c.id]) {
        const locParts = c.location.split(',');
        if (locParts.length === 2) {
          const lat = locParts[0].trim();
          const lng = locParts[1].trim();
          fetchAddress(c.id, lat, lng);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginated]);

  // Sync map height to left section
  useEffect(() => {
    if (leftRef.current) {
      setMapHeight(leftRef.current.offsetHeight);
    }
  }, [search, mode, page, filteredConsultants.length, nearby]);

  // Reverse geocode city name when userLocation changes
  useEffect(() => {
    if (userLocation) {
      setCityLoading(true);
      const fetchCity = async () => {
        try {
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.lat},${userLocation.lng}&key=${apiKey}`;
          const res = await fetch(url);
          const data = await res.json();
          if (data.status === 'OK') {
            const addressComponents: AddressComponent[] = data.results[0].address_components;
            const cityComponent = addressComponents.find((comp) =>
              comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')
            );
            setCity(cityComponent ? cityComponent.long_name : 'Your Area');
          } else {
            setCity('Your Area');
          }
        } catch {
          setCity('Your Area');
        } finally {
          setCityLoading(false);
        }
      };
      fetchCity();
    } else {
      setCity('Delhi');
    }
  }, [userLocation]);

  // Helper for marker icon
  const getMarkerIcon = (url: string) => {
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      return {
        url,
        scaledSize: new window.google.maps.Size(44, 44),
        anchor: new window.google.maps.Point(22, 22),
      };
    }
    return { url };
  };

  // Voice search implementation
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser.');
      return;
    }
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          setSearch(transcript);
          setSearchPlaceholder(transcript);
          setPage(1);
        }
        setListening(false);
      };
      recognitionRef.current.onerror = () => {
        setListening(false);
      };
      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
    if (!listening) {
      setListening(true);
      recognitionRef.current.start();
    } else {
      setListening(false);
      recognitionRef.current.stop();
    }
  };

  // Handle search submit
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <section className="search-map-panel" style={{ background: 'var(--card)', padding: '2.5rem 0', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 56, justifyContent: 'center', flexWrap: 'wrap', boxSizing: 'border-box' }} aria-label="Search and Map">
      {/* Left: Search and Consultant List */}
      <div ref={leftRef} style={{ flex: 2.5, minWidth: 380, maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              style={{ width: '100%', padding: '1rem 3.2rem 1rem 1.5rem', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 18 }}
              aria-label="Search input"
            />
            <button
              type="button"
              onClick={handleVoiceSearch}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: listening ? '#e53e3e' : '#fff',
                fontSize: 22,
                cursor: 'pointer',
                padding: 0
              }}
              aria-label="Voice search"
            >
              <FaMicrophone />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" onClick={handleNearby} style={{ background: nearby ? 'var(--accent)' : 'var(--muted)', color: nearby ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Nearby</button>
            {MODES.map(m => (
              <button key={m} type="button" onClick={() => { setMode(m); setNearby(false); setPage(1); }} style={{ background: mode === m && !nearby ? 'var(--accent)' : 'var(--muted)', color: mode === m && !nearby ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{m}</button>
            ))}
            <button type="button" style={{ background: 'var(--muted)', color: 'var(--text-secondary)', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Resources</button>
            <button type="button" style={{ background: 'var(--muted)', color: 'var(--text-secondary)', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Explore All</button>
          </div>
        </form>
        <div style={{ fontSize: 16, color: 'var(--text-secondary)', margin: '8px 0 0 2px', fontWeight: 500 }}>
          Showing search result for{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
            {cityLoading ? '...' : city}
          </span>
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 14, height: 400 }}>
          {paginated.map(c => {
            // Determine the correct image URL
            let imageUrl = c.image;
            if (imageUrl && imageUrl.startsWith('/')) {
              imageUrl = `http://localhost:4000${imageUrl}`;
            }
            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--muted)', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ position: 'relative', width: 48, height: 48, display: 'inline-block' }}>
                  <img src={imageUrl || '/brain-miet.png'} alt={c.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/brain-miet.png'; }} />
                  {c.mode === 'Online' && (
                    <span style={{
                      position: 'absolute',
                      bottom: 2,
                      right: 2,
                      width: 13,
                      height: 13,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #39e639 60%, #39e63988 100%)',
                      boxShadow: '0 0 8px 2px #39e63988, 0 0 0 2px #fff',
                      border: '2px solid #fff',
                      display: 'block',
                      zIndex: 2,
                      animation: 'glow-green 1.2s infinite alternate',
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-accent-alt)', fontSize: 17 }}>{c.name}</div>
                  <div style={{ color: 'var(--text-accent)', fontSize: 15 }}>{c.expertise}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    {c.city || "Not specified"} &middot; <span style={{ color: c.mode === 'Online' ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 600 }}>{c.mode}</span>
                  </div>
                  {c.location && (() => {
                    const locParts = c.location.split(',');
                    if (locParts.length === 2) {
                      const lat = locParts[0].trim();
                      const lng = locParts[1].trim();
                      if (geoAddresses[c.id]) {
                        return <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>📍 {geoAddresses[c.id]}</div>;
                      }
                      return <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>📍 Lat: {lat}, Lng: {lng}</div>;
                    }
                    return <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>📍 {c.location}</div>;
                  })()}
                  {c.email && <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>✉️ {c.email}</div>}
                  {c.phone && <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>📞 {c.phone}</div>}
                </div>
                <button onClick={() => setBookingConsultant(c)} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Book</button>
              </div>
            );
          })}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'center' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: 'var(--muted)', color: 'var(--text-secondary)', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 16, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} style={{ background: page === i + 1 ? 'var(--accent)' : 'var(--muted)', color: page === i + 1 ? 'var(--text-accent-alt)' : 'var(--text-secondary)', border: '1.5px solid var(--border)', borderRadius: 6, padding: '6px 12px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{i + 1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ background: 'var(--muted)', color: 'var(--text-secondary)', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 16, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>Next</button>
          </div>
        )}
      </div>
      {/* Right: Google Map */}
      <div style={{ flex: 1.5, minWidth: 320, maxWidth: 540, height: mapHeight, background: 'var(--card)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(90,103,216,0.08)', transition: 'height 0.2s' }}>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={11}
          >
            {filteredConsultants.map(c => {
              let imageUrl = c.image;
              if (imageUrl && imageUrl.startsWith('/')) {
                imageUrl = `http://localhost:4000${imageUrl}`;
              }
              let markerIcon = undefined;
              if (imageUrl && typeof window !== 'undefined' && window.google && window.google.maps) {
                markerIcon = {
                  url: imageUrl,
                  scaledSize: new window.google.maps.Size(44, 44),
                  anchor: new window.google.maps.Point(22, 22)
                };
              }
              // Only render marker if lat/lng are valid numbers
              if (typeof c.lat !== 'number' || isNaN(c.lat) || typeof c.lng !== 'number' || isNaN(c.lng)) {
                return null;
              }
              return (
                <Marker
                  key={c.id}
                  position={{ lat: c.lat, lng: c.lng }}
                  icon={markerIcon}
                  title={c.name}
                  onClick={() => setSelectedConsultant(c)}
                />
              );
            })}
            {selectedConsultant && (
              <InfoWindow
                position={{ lat: selectedConsultant.lat, lng: selectedConsultant.lng }}
                onCloseClick={() => setSelectedConsultant(null)}
              >
                <div style={{ minWidth: 180, maxWidth: 240, padding: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={selectedConsultant.image} alt={selectedConsultant.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-accent-alt)', fontSize: 16 }}>{selectedConsultant.name}</div>
                      <div style={{ color: 'var(--text-accent)', fontSize: 14 }}>{selectedConsultant.expertise}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{selectedConsultant.city} &middot; <span style={{ color: selectedConsultant.mode === 'Online' ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 600 }}>{selectedConsultant.mode}</span></div>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
      {/* Booking Modal */}
      {bookingConsultant && (() => {
        // Determine the correct image URL for the modal
        let imageUrl = bookingConsultant.image;
        if (imageUrl && imageUrl.startsWith('/')) {
          imageUrl = `http://localhost:4000${imageUrl}`;
        }
        return (
          <div role="dialog" aria-modal="true" tabIndex={-1} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,37,77,0.32)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { if (e.target === e.currentTarget) setBookingConsultant(null); }}>
            <div style={{ background: 'var(--card)', borderRadius: 14, padding: 32, minWidth: 340, maxWidth: 420, boxShadow: '0 4px 32px rgba(90,103,216,0.13)', position: 'relative' }}>
              <button onClick={() => setBookingConsultant(null)} aria-label="Close booking modal" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: 'var(--accent)', cursor: 'pointer' }}>×</button>
              <h2 style={{ color: 'var(--text-accent-alt)', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Book Appointment</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <img src={imageUrl || '/brain-miet.png'} alt={bookingConsultant.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/brain-miet.png'; }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-accent-alt)', fontSize: 16 }}>{bookingConsultant.name}</div>
                  <div style={{ color: 'var(--text-accent)', fontSize: 14 }}>{bookingConsultant.expertise}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{bookingConsultant.city} &middot; <span style={{ color: bookingConsultant.mode === 'Online' ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 600 }}>{bookingConsultant.mode}</span></div>
                </div>
              </div>
              <form onSubmit={e => { e.preventDefault(); alert('Booking submitted! (not really)'); setBookingConsultant(null); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                  Date
                  <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1.5px solid var(--border)', marginTop: 4 }} />
                </label>
                <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                  Time
                  <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1.5px solid var(--border)', marginTop: 4 }} />
                </label>
                <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                  Name
                  <input type="text" value={bookingName} onChange={e => setBookingName(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1.5px solid var(--border)', marginTop: 4 }} />
                </label>
                <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                  Email
                  <input type="email" value={bookingEmail} onChange={e => setBookingEmail(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1.5px solid var(--border)', marginTop: 4 }} />
                </label>
                <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                  Phone
                  <input type="tel" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1.5px solid var(--border)', marginTop: 4 }} />
                </label>
                <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                  Notes
                  <textarea value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1.5px solid var(--border)', marginTop: 4, minHeight: 48 }} />
                </label>
                <button type="submit" style={{ background: 'var(--accent)', color: 'var(--text-accent-alt)', border: 'none', borderRadius: 8, padding: '0.9rem 1.5rem', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginTop: 8 }}>Book Now</button>
              </form>
            </div>
          </div>
        );
      })()}
      {/* Glowing green circle animation */}
      <style>{`
        @keyframes glow-green {
          0% { box-shadow: 0 0 8px 2px #39e63988, 0 0 0 2px #fff; }
          100% { box-shadow: 0 0 16px 6px #39e639cc, 0 0 0 2px #fff; }
        }
      `}</style>
    </section>
  );
}
