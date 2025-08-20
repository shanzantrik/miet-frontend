import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { FaMicrophone } from 'react-icons/fa';

type Consultant = {
  id: number;
  name: string;
  city?: string;
  expertise?: string;
  speciality?: string;
  mode?: string;
  status?: string;
  image?: string;
  location?: string;
  lat?: number;
  lng?: number;
  email?: string;
  phone?: string;
  category_ids?: number[] | string[];
  description?: string; // Added for InfoWindow
};

const MODES = ['All', 'Online', 'Offline'];
const PAGE_SIZE = 5;
const defaultCenter = { lat: 23.5937, lng: 78.9629 }; // Center of India

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
    SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultants/public`);
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
          const consultant = { ...c, lat: lat ?? undefined, lng: lng ?? undefined };
          console.log('Consultant data:', consultant); // Debug individual consultant
          return consultant;
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

    // Filter by mode - check both mode and status fields
    let matchesMode = true;
    if (mode === 'Online') {
      matchesMode = (c.mode === 'Online' || c.status === 'online');
    } else if (mode === 'Offline') {
      matchesMode = (c.mode === 'Offline' || c.status === 'offline');
    }
    // 'All' mode shows all consultants

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
          setMode('All'); // Reset to 'All' when using nearby
        },
        () => {
          alert('Could not get your location. Showing default nearby results.');
          setNearby(true);
          setMode('All'); // Reset to 'All' when using nearby
        }
      );
    } else {
      alert('Geolocation not supported.');
      setNearby(true);
      setMode('All'); // Reset to 'All' when using nearby
    }
  };

  // Sort by proximity if 'Nearby' is active
  if (nearby) {
    const center = userLocation || defaultCenter;
    filteredConsultants = [...filteredConsultants].sort((a, b) =>
      haversine(center.lat || 0, center.lng || 0, a.lat || 0, a.lng || 0) -
      haversine(center.lat || 0, center.lng || 0, b.lat || 0, b.lng || 0)
    );
  }

  // On mount or when filtered consultants change, fetch addresses for those with lat/lng
  useEffect(() => {
    filteredConsultants.forEach(c => {
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
  }, [filteredConsultants]);

  // Sync map height to left section
  useEffect(() => {
    if (leftRef.current) {
      setMapHeight(leftRef.current.offsetHeight);
    }
  }, [search, mode, filteredConsultants.length, nearby]);

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
            const addressComponents: any[] = data.results[0].address_components;
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
  };

  return (
    <section className="search-map-panel" style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #3730a3 50%, #4338ca 75%, #6366f1 100%)',
      padding: '4rem 0',
      width: '100vw',
      maxWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    }} aria-label="Search and Map">

      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
        animation: 'rotate 20s linear infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />

      {/* Section Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        zIndex: 2,
        position: 'relative'
      }}>
        <h2 style={{
          fontFamily: 'Righteous, cursive',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '1rem',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          letterSpacing: '2px'
        }}>
          Find Your Perfect Consultant
        </h2>
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          color: 'rgba(255,255,255,0.9)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6',
          fontWeight: '400',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          Discover specialized professionals for Special Education, Mental Health, and Counselling services
        </p>
      </div>

      {/* Main Content Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '3rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: '1400px',
        padding: '0 2rem',
        zIndex: 2,
        position: 'relative'
      }}>
        {/* Left: Search and Consultant List */}
        <div ref={leftRef} style={{
          flex: '2.5',
          minWidth: '380',
          maxWidth: '800',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          background: 'rgba(255,255,255,0.95)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                padding: '1.2rem 3.5rem 1.2rem 1.5rem',
                borderRadius: '15px',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                fontSize: '1.1rem',
                background: 'rgba(255,255,255,0.9)',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(99, 102, 241, 0.8)';
                e.target.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
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
                color: listening ? '#e53e3e' : '#667eea',
                fontSize: 22,
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!listening) {
                  e.currentTarget.style.color = '#764ba2';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!listening) {
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }
              }}
              aria-label="Voice search"
            >
              <FaMicrophone />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleNearby}
              style={{
                background: nearby ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(99, 102, 241, 0.1)',
                color: nearby ? '#fff' : '#6366f1',
                border: nearby ? 'none' : '2px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                padding: '0.8rem 1.5rem',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: nearby ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!nearby) {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!nearby) {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              Nearby
            </button>
            {MODES.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setNearby(false); }}
                style={{
                  background: mode === m && !nearby ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(99, 102, 241, 0.1)',
                  color: mode === m && !nearby ? '#fff' : '#6366f1',
                  border: mode === m && !nearby ? 'none' : '2px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '12px',
                  padding: '0.8rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: mode === m && !nearby ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!(mode === m && !nearby)) {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(mode === m && !nearby)) {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </form>
        <div style={{ fontSize: 16, color: 'var(--text-secondary)', margin: '8px 0 0 2px', fontWeight: 500 }}>
          Showing search result for{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
            {cityLoading ? '...' : city}
          </span>
        </div>
        <div
          className="consultant-cards-container"
          style={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            height: 400,
            overflowY: 'auto',
            /* Hide scrollbar but keep functionality */
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* Internet Explorer 10+ */
          }}
        >
          {filteredConsultants.map(c => {
            // Determine the correct image URL
            let imageUrl = c.image;
            if (imageUrl && imageUrl.startsWith('/')) {
              imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
            }
            return (
              <div
                className="consultant-card"
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 16,
                  padding: '16px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: selectedConsultant?.id === c.id ? '2px solid #667eea' : '2px solid rgba(99, 102, 241, 0.1)',
                  boxShadow: selectedConsultant?.id === c.id ? '0 8px 25px rgba(99, 102, 241, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.08)',
                  backdropFilter: 'blur(10px)'
                }}
                onClick={() => {
                  if (c.lat && c.lng) {
                    setMapCenter({ lat: c.lat, lng: c.lng });
                    setSelectedConsultant(c);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = selectedConsultant?.id === c.id ? '0 8px 25px rgba(99, 102, 241, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = selectedConsultant?.id === c.id ? '#667eea' : 'rgba(99, 102, 241, 0.1)';
                }}
              >
                <div className="consultant-image" style={{ position: 'relative', width: 64, height: 64, display: 'inline-block' }}>
                  <img
                    src={imageUrl || '/brain-miet.png'}
                    alt={c.name}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid rgba(99, 102, 241, 0.2)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                    }}
                    onError={e => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/brain-miet.png';
                    }}
                  />
                  {(c.mode === 'Online' || c.status === 'online') && (
                    <span style={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #10b981 60%, #10b98188 100%)',
                      boxShadow: '0 0 12px 3px #10b98188, 0 0 0 3px #fff',
                      border: '2px solid #fff',
                      display: 'block',
                      zIndex: 2,
                      animation: 'glow-green 1.2s infinite alternate',
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div
                    className="consultant-name"
                    style={{
                      fontWeight: 700,
                      color: '#1e1b4b',
                      fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)',
                      marginBottom: '0.25rem',
                      lineHeight: 1.3
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    className="consultant-expertise"
                    style={{
                      color: '#667eea',
                      fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
                      fontWeight: 600,
                      marginBottom: '0.25rem',
                      lineHeight: 1.3
                    }}
                  >
                    {c.expertise}
                  </div>
                  <div
                    className="consultant-location"
                    style={{
                      color: '#6b7280',
                      fontSize: 'clamp(0.9rem, 1vw, 1rem)',
                      lineHeight: 1.3
                    }}
                  >
                    {c.city || "Not specified"} &middot; <span style={{
                      color: (c.mode === 'Online' || c.status === 'online') ? '#10b981' : '#6b7280',
                      fontWeight: 600
                    }}>
                      {(() => {
                        if (c.mode) return c.mode;
                        if (c.status === 'online') return 'Online';
                        if (c.status === 'offline') return 'Offline';
                        if (c.speciality) return c.speciality;
                        if (c.expertise) return c.expertise;
                        return 'Consultant';
                      })()}
                    </span>
                  </div>
                  {c.location && (() => {
                    const locParts = c.location.split(',');
                    if (locParts.length === 2) {
                      const lat = locParts[0].trim();
                      const lng = locParts[1].trim();
                      if (geoAddresses[c.id]) {
                        return <div style={{ color: '#ffffff', fontSize: 'clamp(0.9rem, 1vw, 1rem)', marginTop: 4, fontWeight: 500 }}>📍 {geoAddresses[c.id]}</div>;
                      }
                      return <div style={{ color: '#ffffff', fontSize: 'clamp(0.9rem, 1vw, 1rem)', marginTop: 4, fontWeight: 500 }}>📍 Lat: {lat}, Lng: {lng}</div>;
                    }
                    return <div style={{ color: '#ffffff', fontSize: 'clamp(0.9rem, 1vw, 1rem)', marginTop: 4, fontWeight: 500 }}>📍 {c.location}</div>;
                  })()}
                  {c.email && <div style={{ color: '#ffffff', fontSize: 'clamp(0.9rem, 1vw, 1rem)', marginTop: 4, fontWeight: 500 }}>✉️ {c.email}</div>}
                  {c.phone && <div style={{ color: '#ffffff', fontSize: 'clamp(0.9rem, 1vw, 1rem)', marginTop: 4, fontWeight: 500 }}>📞 {c.phone}</div>}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    setBookingConsultant(c);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '0.7rem 1.4rem',
                    fontWeight: 700,
                    fontSize: 'clamp(0.9rem, 1vw, 1rem)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                  }}
                >
                  Book
                </button>
              </div>
            );
          })}
        </div>
      </div>
        {/* Right: Google Map */}
        <div style={{
          flex: '1.5',
          minWidth: '320',
          maxWidth: '540',
          height: mapHeight,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={nearby ? 11 : 5} // Zoom out to show India when not in nearby mode
          >
            {filteredConsultants.map(c => {
              let imageUrl = c.image;
              if (imageUrl && imageUrl.startsWith('/')) {
                imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
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
            {selectedConsultant && selectedConsultant.lat && selectedConsultant.lng && (
              <InfoWindow
                position={{ lat: selectedConsultant.lat, lng: selectedConsultant.lng }}
                onCloseClick={() => setSelectedConsultant(null)}
              >
                <div style={{ minWidth: 280, maxWidth: 320, padding: 8, position: 'relative' }}>
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedConsultant(null)}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}
                    aria-label="Close consultant details"
                  >
                    ×
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ position: 'relative', width: 60, height: 60 }}>
                        <img
                          src={(() => {
                            let imageUrl = selectedConsultant.image;
                            if (imageUrl && imageUrl.startsWith('/')) {
                              imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
                            }
                            return imageUrl || '/brain-miet.png';
                          })()}
                          alt={selectedConsultant.name}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid var(--border)'
                          }}
                          onError={e => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/brain-miet.png';
                          }}
                        />
                        {(selectedConsultant.mode === 'Online' || selectedConsultant.status === 'online') && (
                          <span style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            width: 16,
                            height: 16,
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
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-accent-alt)', fontSize: 18, marginBottom: 2 }}>{selectedConsultant.name}</div>
                        <div style={{ color: 'var(--text-accent)', fontSize: 14, marginBottom: 2 }}>{selectedConsultant.expertise}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                          {selectedConsultant.city} &middot; <span style={{ color: (selectedConsultant.mode === 'Online' || selectedConsultant.status === 'online') ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 600 }}>{(() => {
                            if (selectedConsultant.mode) return selectedConsultant.mode;
                            if (selectedConsultant.status === 'online') return 'Online';
                            if (selectedConsultant.status === 'offline') return 'Offline';
                            if (selectedConsultant.speciality) return selectedConsultant.speciality;
                            if (selectedConsultant.expertise) return selectedConsultant.expertise;
                            return 'Consultant';
                          })()}</span>
                        </div>
                      </div>
                    </div>

                    {selectedConsultant.description && (
                      <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.4, marginTop: 4 }}>
                        {selectedConsultant.description}
                      </div>
                    )}

                    {selectedConsultant.email && (
                      <div style={{ color: '#666', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>✉️</span> {selectedConsultant.email}
                      </div>
                    )}

                    {selectedConsultant.phone && (
                      <div style={{ color: '#666', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>📞</span> {selectedConsultant.phone}
                      </div>
                    )}

                    {selectedConsultant.location && (() => {
                      const locParts = selectedConsultant.location.split(',');
                      if (locParts.length === 2) {
                        const lat = locParts[0].trim();
                        const lng = locParts[1].trim();
                        if (geoAddresses[selectedConsultant.id]) {
                          return <div style={{ color: '#888', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>📍</span> {geoAddresses[selectedConsultant.id]}
                          </div>;
                        }
                        return <div style={{ color: '#888', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span>📍</span> Lat: {lat}, Lng: {lng}
                        </div>;
                      }
                      return <div style={{ color: '#888', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>📍</span> {selectedConsultant.location}
                      </div>;
                    })()}

                    <button
                      onClick={() => setBookingConsultant(selectedConsultant)}
                      style={{
                        background: 'var(--accent)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '8px 16px',
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: 'pointer',
                        marginTop: 8,
                        width: '100%'
                      }}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
      </div> {/* Close main content container */}

            {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Hide scrollbar for WebKit browsers */
          div::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }

          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          @keyframes glow-green {
            0% { box-shadow: 0 0 12px 3px #10b98188, 0 0 0 3px #fff; }
            100% { box-shadow: 0 0 20px 6px #10b981cc, 0 0 0 3px #fff; }
          }

          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            .consultant-card {
              background: rgba(30, 27, 75, 0.95) !important;
              border-color: rgba(99, 102, 241, 0.3) !important;
            }

            .consultant-name {
              color: #e2e8f0 !important;
            }

            .consultant-expertise {
              color: #a5b4fc !important;
            }

            .consultant-location {
              color: #9ca3af !important;
            }
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .search-map-panel {
              padding: 2rem 0 !important;
            }

            .search-map-panel h2 {
              font-size: 2rem !important;
              margin-bottom: 0.5rem !important;
            }

            .search-map-panel p {
              font-size: 1rem !important;
              padding: 0 1rem !important;
            }

            .consultant-cards-container {
              gap: 12px !important;
              padding: 0 1rem !important;
            }

            .consultant-card {
              padding: 14px 16px !important;
              gap: 12px !important;
            }

            .consultant-image {
              width: 56px !important;
              height: 56px !important;
            }

            .consultant-name {
              font-size: clamp(1rem, 1.3vw, 1.2rem) !important;
            }

            .consultant-expertise {
              font-size: clamp(0.9rem, 1.1vw, 1rem) !important;
            }

            .consultant-location {
              font-size: clamp(0.8rem, 0.9vw, 0.9rem) !important;
            }
          }

          @media (max-width: 480px) {
            .search-map-panel h2 {
              font-size: 1.8rem !important;
            }

            .search-map-panel p {
              font-size: 0.9rem !important;
            }

            .consultant-card {
              padding: 12px 14px !important;
              gap: 10px !important;
            }

            .consultant-image {
              width: 50px !important;
              height: 50px !important;
            }

            .consultant-name {
              font-size: clamp(0.9rem, 1.2vw, 1.1rem) !important;
            }

            .consultant-expertise {
              font-size: clamp(0.8rem, 1vw, 0.95rem) !important;
            }

            .consultant-location {
              font-size: clamp(0.75rem, 0.8vw, 0.85rem) !important;
            }
          }
        `
      }} />

      {/* Booking Modal */}
      {bookingConsultant && (() => {
        // Determine the correct image URL for the modal
        let imageUrl = bookingConsultant.image;
                                    if (imageUrl && imageUrl.startsWith('/')) {
                              imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
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
