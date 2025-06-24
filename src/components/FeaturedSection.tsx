import React, { useRef, useState, useEffect } from 'react';

const featuredConsultants = [
  {
    id: 1,
    name: 'Dr. Asha Mehta',
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&facepad=2',
    expertise: 'Child Psychologist',
    city: 'Delhi',
    mode: 'Online',
    tagline: 'Empowering children and families with compassion and expertise.',
    highlights: '15+ years experience · Award-winning speaker · Author',
  },
  {
    id: 2,
    name: 'Mr. Rajiv Kumar',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&h=256&facepad=2',
    expertise: 'Speech Therapist',
    city: 'Noida',
    mode: 'At Home',
    tagline: 'Unlocking communication, one word at a time.',
    highlights: '10+ years · Multilingual · Parent favorite',
  },
  {
    id: 3,
    name: 'Ms. Priya Singh',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=256&h=256&facepad=2',
    expertise: 'Special Educator',
    city: 'Gurgaon',
    mode: 'Online',
    tagline: 'Inclusive learning for every child.',
    highlights: '8+ years · Certified SEN · Creative teaching',
  },
  {
    id: 4,
    name: 'Dr. Neha Sharma',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256&facepad=2',
    expertise: 'Clinical Psychologist',
    city: 'Delhi',
    mode: 'At Home',
    tagline: 'Mental wellness, made accessible.',
    highlights: '12+ years · CBT specialist · Empathy-driven',
  },
  {
    id: 5,
    name: 'Mr. Anil Kapoor',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=facearea&w=256&h=256&facepad=2',
    expertise: 'Occupational Therapist',
    city: 'Gurgaon',
    mode: 'Online',
    tagline: 'Building skills for independent living.',
    highlights: '9+ years · Sensory integration · Fun sessions',
  },
];

function getVisibleCount(width: number) {
  if (width < 600) return 1;
  if (width < 900) return 2;
  if (width < 1200) return 3;
  if (width < 1500) return 4;
  return 5;
}

export default function FeaturedSection() {
  const [current, setCurrent] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount(typeof window !== 'undefined' ? window.innerWidth : 1200));
  const [bookingConsultant, setBookingConsultant] = useState<typeof featuredConsultants[0] | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive visibleCount
  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (!hovering) {
      intervalRef.current = setInterval(() => {
        setCurrent(c => (c + 1) % featuredConsultants.length);
      }, 3500);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovering]);

  // Arrow navigation
  const goLeft = () => setCurrent(c => (c - 1 + featuredConsultants.length) % featuredConsultants.length);
  const goRight = () => setCurrent(c => (c + 1) % featuredConsultants.length);

  // Get the visible consultants in a circular way
  const getVisibleConsultants = () => {
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      result.push(featuredConsultants[(current + i) % featuredConsultants.length]);
    }
    return result;
  };

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
          style={{
            opacity: 1,
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
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 4px 16px var(--accent-alt, rgba(90,103,216,0.18))',
            outline: 'none',
            transition: 'box-shadow 0.2s, background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--muted-alt)'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--card)'}
        >
          &#8592;
        </button>
        {/* Slider Cards */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {getVisibleConsultants().map(consultant => (
            <div
              key={consultant.id}
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
                <img
                  src={consultant.image}
                  alt={consultant.name}
                  style={{ width: visibleCount === 1 ? 74 : 54, height: visibleCount === 1 ? 74 : 54, borderRadius: '50%', objectFit: 'cover', border: '3px solid #5a67d8', boxShadow: '0 0 0 4px #fff' }}
                />
                {consultant.mode === 'Online' && (
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
              <div style={{ color: '#5a67d8', fontSize: visibleCount === 1 ? 16 : 14, fontWeight: 600, marginBottom: 2 }}>{consultant.expertise}</div>
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
          style={{
            opacity: 1,
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
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 4px 16px var(--accent-alt, rgba(90,103,216,0.18))',
            outline: 'none',
            transition: 'box-shadow 0.2s, background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--muted-alt)'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--card)'}
        >
          &#8594;
        </button>
      </div>
      {/* Bullets */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 18 }}>
        {featuredConsultants.map((_, idx) => (
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
              <img src={bookingConsultant.image} alt={bookingConsultant.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-accent-alt)', fontSize: 16 }}>{bookingConsultant.name}</div>
                <div style={{ color: 'var(--accent)', fontSize: 14 }}>{bookingConsultant.expertise}</div>
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
