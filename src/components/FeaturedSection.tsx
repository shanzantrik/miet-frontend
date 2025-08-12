'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

type Consultant = {
  id: number;
  name: string;
  email?: string;
  city?: string;
  address?: string;
  location_lat?: string;
  location_lng?: string;
  expertise?: string;
  speciality?: string;
  mode?: string;
  image?: string;
  status?: string;
  tagline?: string;
  highlights?: string;
  location?: string;
  bio?: string;
  isFeatured?: boolean;
};

function getVisibleCount(width: number) {
  if (width < 600) return 1;
  if (width < 900) return 2;
  if (width < 1200) return 3;
  if (width < 1500) return 4;
  return 5;
}

export default function FeaturedSection() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [bookingConsultant, setBookingConsultant] = useState<Consultant | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch consultants from API
  useEffect(() => {
    // Fetch all consultants and filter for featured ones
    fetch('http://localhost:4000/api/consultants/public')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch consultants');
        return res.json();
      })
      .then(data => {
        console.log('FeaturedSection - Raw API data:', data);
        console.log('FeaturedSection - Total consultants from API:', data.length);
        
        // Check for duplicates in the raw data
        const duplicateIds = data.reduce((acc: number[], consultant: Consultant, index: number) => {
          const firstIndex = data.findIndex((c: Consultant) => c.id === consultant.id);
          if (firstIndex !== index) {
            acc.push(consultant.id);
          }
          return acc;
        }, []);
        
        if (duplicateIds.length > 0) {
          console.log('FeaturedSection - Found duplicate IDs in API response:', duplicateIds);
        }
        
        // Filter for consultants with featured: true
        const featuredConsultants = data.filter((consultant: Consultant) => (consultant as any).featured === true);
        console.log('FeaturedSection - Featured consultants before deduplication:', featuredConsultants.length);

        // Remove duplicates by ID (keep only the first occurrence)
        const uniqueConsultants = Array.from(
          new Map(featuredConsultants.map((c: Consultant) => [c.id, c])).values()
        ) as Consultant[];
        
        console.log('FeaturedSection - Unique consultants after deduplication:', uniqueConsultants.length);
        console.log('FeaturedSection - Final consultant IDs:', uniqueConsultants.map(c => c.id));

        setConsultants(uniqueConsultants);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load featured consultants.');
        setLoading(false);
      });
  }, []);

  // Responsive visibleCount
  useEffect(() => {
    setVisibleCount(getVisibleCount(window.innerWidth));
    const handleResize = () => setVisibleCount(getVisibleCount(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (!hovering && consultants.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrent(c => (c + 1) % consultants.length);
      }, 3500);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovering, consultants.length]);

  // Arrow navigation - only enable if we have more consultants than visible count
  const goLeft = () => {
    if (consultants.length > visibleCount) {
      setCurrent(c => (c - 1 + consultants.length) % consultants.length);
    }
  };
  const goRight = () => {
    if (consultants.length > visibleCount) {
      setCurrent(c => (c + 1) % consultants.length);
    }
  };

  // Get the visible consultants without duplicates
  const getVisibleConsultants = () => {
    if (consultants.length === 0) return [];
    
    // If we have fewer consultants than visibleCount, just show all consultants
    if (consultants.length <= visibleCount) {
      return consultants;
    }
    
    // If we have more consultants than visibleCount, show a window of consultants
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (current + i) % consultants.length;
      result.push(consultants[index]);
    }
    return result;
  };

  if (loading) {
    return (
      <section className="featured-section" style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', position: 'relative' }} aria-label="Featured consultants and resources">
        <h2 style={{ fontFamily: 'Righteous, cursive', color: '#5a67d8', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Featured Consultants & Resources</h2>
        <div>Loading featured consultants...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-section" style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', position: 'relative' }} aria-label="Featured consultants and resources">
        <h2 style={{ fontFamily: 'Righteous, cursive', color: '#5a67d8', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Featured Consultants & Resources</h2>
        <div style={{ color: 'red' }}>{error}</div>
      </section>
    );
  }

  // Show message if no featured consultants found
  if (consultants.length === 0 && !loading && !error) {
    return (
      <section className="featured-section" style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', position: 'relative' }} aria-label="Featured consultants and resources">
        <h2 style={{ fontFamily: 'Righteous, cursive', color: '#5a67d8', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Featured Consultants & Resources</h2>
        <div style={{ color: '#666', fontSize: 16 }}>No featured consultants available at the moment.</div>
      </section>
    );
  }

  return (
    <section className="featured-section" style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', position: 'relative' }} aria-label="Featured consultants and resources">
      <h2 style={{ fontFamily: 'Righteous, cursive', color: '#5a67d8', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Featured Consultants & Resources</h2>
      <div
        ref={sliderRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          maxWidth:
            visibleCount === 1 ? 440 :
            visibleCount === 2 ? 880 :
            visibleCount === 3 ? 1320 :
            visibleCount === 4 ? 1680 :
            2000,
          margin: '0 auto',
          overflow: 'visible',
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Left Arrow */}
        <button
          onClick={goLeft}
          aria-label="Previous featured consultant"
          disabled={consultants.length <= visibleCount}
          style={{
            opacity: consultants.length > visibleCount ? 1 : 0.3,
            position: 'absolute',
            left: -52,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--card)',
            border: '3px solid var(--accent)',
            borderRadius: '50%',
            width: 48,
            height: 48,
            fontSize: 28,
            color: 'var(--accent)',
            cursor: consultants.length > visibleCount ? 'pointer' : 'not-allowed',
            zIndex: 10,
            boxShadow: '0 4px 16px var(--accent-alt, rgba(90,103,216,0.18))',
            outline: 'none',
            transition: 'box-shadow 0.2s, background 0.2s',
          }}
          onMouseOver={e => {
            if (consultants.length > visibleCount) {
              e.currentTarget.style.background = 'var(--muted-alt)';
            }
          }}
          onMouseOut={e => e.currentTarget.style.background = 'var(--card)'}
        >
          &#8592;
        </button>
        {/* Slider Cards */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {getVisibleConsultants().map((consultant, index) => (
            <div
              key={`${consultant.id}-${consultant.name}-${index}-${current}`}
              onClick={() => setBookingConsultant(consultant)}
              tabIndex={0}
              role="button"
              aria-label={`Book appointment with ${consultant.name}`}
              style={{
                background: 'linear-gradient(120deg, #e6f0f7 60%, #f7fafc 100%)',
                borderRadius: 18,
                boxShadow: '0 4px 24px rgba(90,103,216,0.10)',
                padding:
                  visibleCount === 1 ? '28px 36px 22px 36px' :
                  visibleCount === 2 ? '22px 28px 18px 28px' :
                  visibleCount === 3 ? '18px 22px 14px 22px' :
                  visibleCount === 4 ? '16px 18px 12px 18px' :
                  '14px 14px 10px 14px',
                minWidth:
                  visibleCount === 1 ? 370 :
                  visibleCount === 2 ? 320 :
                  visibleCount === 3 ? 270 :
                  visibleCount === 4 ? 220 :
                  200,
                maxWidth:
                  visibleCount === 1 ? 400 :
                  visibleCount === 2 ? 360 :
                  visibleCount === 3 ? 310 :
                  visibleCount === 4 ? 260 :
                  240,
                minHeight: 210,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '2.5px solid #5a67d8',
                transition: 'box-shadow 0.2s',
                cursor: 'pointer',
                outline: 'none',
              }}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setBookingConsultant(consultant); }}
            >
              <div style={{ position: 'relative', marginBottom: 12 }}>
                {consultant.image && consultant.image.trim() !== '' ? (
                  <img
                    src={consultant.image.startsWith('/')
                      ? `http://localhost:4000${consultant.image}`
                      : `http://localhost:4000/uploads/${consultant.image}`}
                    alt={consultant.name}
                    style={{ width: visibleCount === 1 ? 74 : 54, height: visibleCount === 1 ? 74 : 54, borderRadius: '50%', objectFit: 'cover', border: '3px solid #5a67d8', boxShadow: '0 0 0 4px #fff' }}
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{ width: visibleCount === 1 ? 74 : 54, height: visibleCount === 1 ? 74 : 54, borderRadius: '50%', border: '3px solid #5a67d8', boxShadow: '0 0 0 4px #fff', background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#5a67d8' }}>{consultant.name?.charAt(0)}</div>
                )}
                {consultant.status === 'online' && (
                  <span style={{
                    position: 'absolute',
                    bottom: 6,
                    right: 6,
                    width: 15,
                    height: 15,
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
              <div style={{ fontWeight: 700, color: '#22543d', fontSize: visibleCount === 1 ? 20 : 16, marginBottom: 2 }}>{consultant.name}</div>
              <div style={{ color: '#5a67d8', fontSize: visibleCount === 1 ? 16 : 14, fontWeight: 600, marginBottom: 2 }}>{consultant.expertise || consultant.speciality}</div>
              <div style={{ color: '#888', fontSize: visibleCount === 1 ? 15 : 13, marginBottom: 6 }}>{consultant.city} &middot; <span style={{ color: consultant.mode === 'Online' ? '#39e639' : '#22543d', fontWeight: 600 }}>{consultant.mode}</span></div>
              <div style={{ color: '#444', fontSize: visibleCount === 1 ? 15 : 13, fontStyle: 'italic', marginBottom: 6 }}>{consultant.tagline}</div>
              <div style={{ color: '#5a67d8', fontSize: visibleCount === 1 ? 14 : 12, marginBottom: 8 }}>{consultant.highlights}</div>
              <div style={{ color: '#22543d', fontSize: visibleCount === 1 ? 14 : 12, background: '#e6f0f7', borderRadius: 8, padding: '6px 12px', marginTop: 4, fontWeight: 500, boxShadow: '0 1px 4px #5a67d822' }}>
                <span role="img" aria-label="star">⭐</span> Featured Consultant
              </div>
            </div>
          ))}
        </div>
        {/* Right Arrow */}
        <button
          onClick={goRight}
          aria-label="Next featured consultant"
          disabled={consultants.length <= visibleCount}
          style={{
            opacity: consultants.length > visibleCount ? 1 : 0.3,
            position: 'absolute',
            right: -52,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--card)',
            border: '3px solid var(--accent)',
            borderRadius: '50%',
            width: 48,
            height: 48,
            fontSize: 28,
            color: 'var(--accent)',
            cursor: consultants.length > visibleCount ? 'pointer' : 'not-allowed',
            zIndex: 10,
            boxShadow: '0 4px 16px var(--accent-alt, rgba(90,103,216,0.18))',
            outline: 'none',
            transition: 'box-shadow 0.2s, background 0.2s',
          }}
          onMouseOver={e => {
            if (consultants.length > visibleCount) {
              e.currentTarget.style.background = 'var(--muted-alt)';
            }
          }}
          onMouseOut={e => e.currentTarget.style.background = 'var(--card)'}
        >
          &#8594;
        </button>
      </div>
      {/* Bullets - only show if we have more consultants than visible count */}
      {consultants.length > visibleCount && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 18 }}>
          {consultants.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrent(idx)}
              style={{
                width: 13,
                height: 13,
                borderRadius: '50%',
                background: idx === current ? '#5a67d8' : '#e6f0f7',
                border: idx === current ? '2.5px solid #5a67d8' : '2.5px solid #e6f0f7',
                boxShadow: idx === current ? '0 0 8px #5a67d8aa' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'inline-block',
              }}
            />
          ))}
        </div>
      )}
      {/* Booking Modal */}
      {bookingConsultant && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(34,37,77,0.45)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
          onClick={e => { if (e.target === e.currentTarget) setBookingConsultant(null); }}
        >
          <div style={{ background: 'var(--card)', borderRadius: 14, padding: 32, minWidth: 340, maxWidth: 420, boxShadow: '0 4px 32px var(--accent-alt, rgba(90,103,216,0.13))', position: 'relative' }}>
            <button onClick={() => setBookingConsultant(null)} aria-label="Close booking modal" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: 'var(--accent)', cursor: 'pointer' }}>×</button>
            <h2 style={{ color: 'var(--text-accent-alt)', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Book Appointment</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              {bookingConsultant.image && (
                <img src={bookingConsultant.image.startsWith('/') ? `http://localhost:4000${bookingConsultant.image}` : `http://localhost:4000/uploads/${bookingConsultant.image}`} alt={bookingConsultant.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
              )}
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-accent-alt)', fontSize: 16 }}>{bookingConsultant.name}</div>
                <div style={{ color: 'var(--accent)', fontSize: 14 }}>{bookingConsultant.expertise || bookingConsultant.speciality}</div>
                <div style={{ color: '#888', fontSize: 13 }}>{bookingConsultant.city} &middot; <span style={{ color: bookingConsultant.mode === 'Online' ? 'var(--accent)' : 'var(--text-accent-alt)', fontWeight: 600 }}>{bookingConsultant.mode}</span></div>
              </div>
            </div>
            <form onSubmit={e => { e.preventDefault(); alert('Booking submitted! (not really)'); setBookingConsultant(null); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                Date
                <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
              </label>
              <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                Time
                <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
              </label>
              <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                Name
                <input type="text" value={bookingName} onChange={e => setBookingName(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
              </label>
              <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                Email
                <input type="email" value={bookingEmail} onChange={e => setBookingEmail(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
              </label>
              <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                Phone
                <input type="tel" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }} />
              </label>
              <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                Notes
                <textarea value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4, minHeight: 48 }} />
              </label>
              <button type="submit" style={{ background: 'var(--accent)', color: 'var(--text-on-accent)', border: 'none', borderRadius: 8, padding: '0.9rem 1.5rem', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginTop: 8 }}>Book Now</button>
            </form>
          </div>
        </div>
      )}
      {/* Glowing green circle animation */}
      <style>{`
        @keyframes glow-green {
          0% { box-shadow: 0 0 8px 2px #39e63988, 0 0 0 2px #fff; }
          100% { box-shadow: 0 0 16px 6px #39e639cc, 0 0 0 2px #fff; }
        }
        @media (max-width: 900px) {
          .featured-section h2 { font-size: 22px !important; }
        }
      `}</style>
    </section>
  );
}
