'use client';
import React, { useState } from 'react';
import { FaHome, FaAdjust, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter, FaGlobe, FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';

const Flag = ({ code }: { code: 'en' | 'hi' }) => (
  <span style={{ fontSize: 18, marginRight: 4 }}>{code === 'en' ? '🇬🇧' : '🇮🇳'}</span>
);

export default function TopBar() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [showLang, setShowLang] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Modal state
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Cart functionality
  const { itemCount } = useCart();

  // Responsive: detect small screens
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Accessibility: apply high contrast and font size to body
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      if (highContrast) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
      document.body.style.setProperty('--site-font-size', fontSize + 'em');
    }
  }, [highContrast, fontSize]);

  // Close modal on Esc
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLogin(false);
        setShowSignup(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Modal component
  const Modal = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!open) return null;
    return (
      <div
        className="modal-overlay"
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        style={{
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
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 32px #5a67d855',
            padding: '2.5rem 2rem 2rem 2rem',
            minWidth: 320,
            maxWidth: '90vw',
            position: 'relative',
            outline: 'none',
          }}
        >
          <button
            aria-label="Close modal"
            onClick={onClose}
            style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 26, color: '#5a67d8', cursor: 'pointer' }}
          >
            <FaTimes />
          </button>
          <h2 style={{ color: '#5a67d8', fontWeight: 700, fontSize: 24, marginBottom: 18, textAlign: 'center' }}>{title}</h2>
          {children}
        </div>
      </div>
    );
  };

  // Only one TopBar: no duplicate rendering
  return (
    <header className="topbar-root" style={{ width: '100%', background: highContrast ? '#222' : '#fff', borderBottom: '1px solid #e2e8f0', fontSize: `${fontSize}em`, color: highContrast ? '#fff' : '#22543d', position: 'sticky', top: 0, left: 0, zIndex: 1200, boxShadow: '0 2px 8px rgba(90,103,216,0.04)', minHeight: 80 }}>
      {/* Utility Row */}
              <div className="utility-row" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 'clamp(0.8rem, 1vw, 0.9rem)',
        padding: '0.5rem 2vw',
        background: highContrast ? '#000' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
      }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/" aria-label="Home" style={{
              color: highContrast ? '#fff' : '#667eea',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = highContrast ? '#fff' : '#764ba2';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = highContrast ? '#fff' : '#667eea';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <FaHome style={{ marginRight: '0.5rem' }} />
              Home
            </Link>
            <Link
              href="/sitemap"
            aria-label="Sitemap"
              style={{
                color: highContrast ? '#fff' : '#667eea',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = highContrast ? '#fff' : '#764ba2';
                e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)';
                e.currentTarget.style.borderColor = highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = highContrast ? '#fff' : '#667eea';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Sitemap
            </Link>
          </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Accessibility Controls */}
          <div className="accessibility-controls" style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            background: highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)',
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid transparent'
          }}>
            <button
              aria-label="Decrease font size"
              onClick={() => setFontSize(f => Math.max(0.8, +(f - 0.1).toFixed(2)))}
              style={{
                background: 'none',
                border: 'none',
                color: highContrast ? '#fff' : '#667eea',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: 'clamp(0.9rem, 1vw, 1rem)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(99, 102, 241, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              A-
            </button>
            <button
              aria-label="Reset font size"
              onClick={() => setFontSize(1)}
              style={{
                background: 'none',
                border: 'none',
                color: highContrast ? '#fff' : '#667eea',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: 'clamp(1rem, 1.1vw, 1.1rem)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(99, 102, 241, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              A
            </button>
            <button
              aria-label="Increase font size"
              onClick={() => setFontSize(f => Math.min(1.5, +(f + 0.1).toFixed(2)))}
              style={{
                background: 'none',
                border: 'none',
                color: highContrast ? '#fff' : '#667eea',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: 'clamp(1.1rem, 1.2vw, 1.2rem)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(99, 102, 241, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            aria-label="Toggle high contrast"
            onClick={() => setHighContrast(h => !h)}
            style={{
              background: highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(99, 102, 241, 0.1)',
              border: '1px solid transparent',
              color: highContrast ? '#fff' : '#667eea',
              cursor: 'pointer',
              fontSize: 'clamp(1rem, 1.1vw, 1.1rem)',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.3)' : 'rgba(99, 102, 241, 0.2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(99, 102, 241, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FaAdjust />
          </button>

          {/* Language Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              aria-label="Switch language"
              onClick={() => setShowLang(l => !l)}
              style={{
                background: highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '8px',
                color: highContrast ? '#fff' : '#667eea',
                padding: '0.5rem 0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Flag code={lang} />
              {lang.toUpperCase()}
              <span style={{ fontSize: '0.8em', transition: 'transform 0.3s ease', transform: showLang ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </button>
            {showLang && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                left: 0,
                background: highContrast ? '#222' : 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '8px',
                zIndex: 10,
                minWidth: '80px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => { setLang('en'); setShowLang(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: highContrast ? '#fff' : '#667eea',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  <Flag code="en" /> EN
                </button>
                <button
                  onClick={() => { setLang('hi'); setShowLang(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: highContrast ? '#fff' : '#667eea',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  <Flag code="hi" /> HI
                </button>
              </div>
            )}
          </div>

          {/* Currency Switch */}
          <button
            aria-label="Switch currency"
            style={{
              background: highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
              color: highContrast ? '#fff' : '#667eea',
              padding: '0.5rem 0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,1)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaGlobe style={{ fontSize: 'clamp(0.9rem, 1vw, 1rem)' }} />
            ₹
          </button>
        </div>
      </div>
              {/* Main Row: Logo, Navigation, Login/Signup, Social, Hamburger for mobile */}
      <div className="main-row" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(8px, 2vw, 10px) clamp(1rem, 3vw, 2vw)',
        background: highContrast ? '#222' : '#fff',
        position: 'relative',
        flexWrap: 'wrap',
        gap: 'clamp(0.5rem, 2vw, 1rem)'
      }}>
        <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 16px)' }}>
          <Link href="/">
            <Image
              src="/miet-main.webp"
              alt="MieT Logo"
              width={44}
              height={44}
              style={{
                borderRadius: 12,
                background: '#f7fafc',
                width: 'clamp(44px, 12vw, 56px)',
                height: 'clamp(44px, 12vw, 56px)'
              }}
              priority
            />
          </Link>
          <span style={{
            fontFamily: 'Righteous, cursive',
            fontSize: 'clamp(22px, 5vw, 28px)',
            color: '#5a67d8',
            fontWeight: 700
          }}>MieT</span>
        </div>
        {/* Main Navigation (desktop) */}
        {!isMobile && (
          <nav aria-label="Main navigation" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            fontSize: 'clamp(1rem, 1.1vw, 1.1rem)',
            fontWeight: '600',
            flex: 1,
            justifyContent: 'center',
            color: highContrast ? '#fff' : '#1e1b4b',
            position: 'relative'
          }}>
            <Link href="/" style={{
              color: highContrast ? '#fff' : '#667eea',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontSize: 'clamp(1.1rem, 1.2vw, 1.2rem)',
              fontWeight: '700',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <FaHome style={{ marginRight: '0.5rem' }} />
              Home
            </Link>

            <Link href="/about" style={{
              color: highContrast ? '#fff' : '#1e1b4b',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              About Us
            </Link>

            <Link href="/services" style={{
              color: highContrast ? '#fff' : '#1e1b4b',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              Services
            </Link>

            <Link href="/consultants" style={{
              color: highContrast ? '#fff' : '#1e1b4b',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              Consultants
            </Link>

            <Link href="/marketplace" style={{
              color: highContrast ? '#fff' : '#1e1b4b',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              Marketplace
            </Link>

            <Link href="/courses" style={{
              color: highContrast ? '#fff' : '#1e1b4b',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              Courses
            </Link>

            <Link href="/contact" style={{
              color: highContrast ? '#fff' : '#1e1b4b',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              Contact Us
            </Link>
          </nav>
        )}
        {/* Hamburger for mobile */}
        {isMobile && (
          <button onClick={() => setMobileMenu(m => !m)} aria-label="Open menu" style={{ background: 'none', border: 'none', fontSize: 32, color: highContrast ? '#fff' : '#5a67d8', cursor: 'pointer', marginLeft: 16 }}>
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        )}
        {/* Login/Signup and Cart */}
        <div className="login-section" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.5rem, 2vw, 1.5rem)',
          marginLeft: 'clamp(1rem, 3vw, 2rem)',
          flexWrap: 'wrap'
        }}>
            {/* Cart Icon */}
          <Link href="/cart" style={{
            position: 'relative',
            textDecoration: 'none',
            color: highContrast ? '#fff' : '#667eea',
            padding: 'clamp(0.5rem, 2vw, 0.75rem)',
            borderRadius: '12px',
            background: highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)',
            border: '1px solid transparent',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 'clamp(40px, 10vw, 48px)',
            minHeight: 'clamp(40px, 10vw, 48px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.2)' : 'rgba(99, 102, 241, 0.2)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <FaShoppingCart style={{
              fontSize: 'clamp(1.1rem, 1.2vw, 1.2rem)',
              cursor: 'pointer'
            }} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  borderRadius: '50%',
                width: '24px',
                height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                fontSize: 'clamp(0.7rem, 0.8vw, 0.8rem)',
                fontWeight: '700',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                border: '2px solid #ffffff'
                }}>
                  {itemCount}
                </span>
              )}
            </Link>

          {/* Login Button */}
          <button
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              borderRadius: '12px',
              border: 'none',
              padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
              minWidth: 'clamp(80px, 20vw, 100px)',
              minHeight: 'clamp(36px, 8vw, 44px)'
            }}
            onClick={() => setShowLogin(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
            }}
          >
            Login
          </button>

          {/* Sign Up Button */}
          <button
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              color: '#fff',
              borderRadius: '12px',
              border: 'none',
              padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(30, 27, 75, 0.3)',
              minWidth: 'clamp(80px, 20vw, 100px)',
              minHeight: 'clamp(36px, 8vw, 44px)'
            }}
            onClick={() => setShowSignup(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(30, 27, 75, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(30, 27, 75, 0.3)';
            }}
          >
            Sign Up
          </button>
        </div>
        {/* Mobile menu overlay */}
        {mobileMenu && (
          <div style={{ position: 'absolute', top: 70, right: 0, background: highContrast ? '#222' : '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 2px 12px #5a67d822', padding: 24, zIndex: 100, minWidth: 220 }}>
            <nav aria-label="Mobile navigation" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <Link href="/" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', fontSize: 18, display: 'flex', alignItems: 'center', marginBottom: 8 }}><FaHome style={{ marginRight: 8 }} />Home</Link>
              <Link href="/about" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', fontSize: 18, marginBottom: 8 }}>About Us</Link>
              {/* Services submenu */}
              <Link href="/services" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', fontSize: 18, marginBottom: 8 }}>Services</Link>
              <a href="/consultants" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', fontSize: 18, marginBottom: 8 }}>Consultants</a>
              <a href="/marketplace" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', fontSize: 18, marginBottom: 8 }}>Marketplace</a>
              <a href="/courses" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', fontSize: 18, marginBottom: 8 }}>Courses</a>
              {/* Cart in mobile menu */}
              <Link href="/cart" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', fontSize: '18', marginBottom: '8', display: 'flex', alignItems: 'center' }}>
                <FaShoppingCart style={{ marginRight: '8' }} />
                Cart {itemCount > 0 && `(${itemCount})`}
              </Link>
              {/* Resources submenu - removed for now */}
              {/* <div style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600, color: highContrast ? '#fff' : '#22543d', marginBottom: 4 }}>Resources</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Link href="/blog" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', fontSize: 16 }}>Blog</Link>
                  <Link href="/legal" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', fontSize: 16 }}>Legal Framework</Link>
                  <Link href="/resources" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', fontSize: 16 }}>Free Resources</Link>
                </div>
              </div> */}
              <a href="/contact" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', fontSize: 18 }}>Contact Us</a>
            </nav>
          </div>
        )}
        {/* Modals for Login and Signup */}
        <Modal open={showLogin} onClose={() => setShowLogin(false)} title="Login">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 18 }}>
            <button aria-label="Login with Google" style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: 8, cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center' }}><FcGoogle /></button>
            <button aria-label="Login with Facebook" style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: 8, cursor: 'pointer', fontSize: 20, color: '#1877f3', display: 'flex', alignItems: 'center' }}><FaFacebookF /></button>
            <button aria-label="Login with LinkedIn" style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: 8, cursor: 'pointer', fontSize: 20, color: '#0077b5', display: 'flex', alignItems: 'center' }}><FaLinkedinIn /></button>
          </div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={e => { e.preventDefault(); setShowLogin(false); }}>
            <label style={{ fontWeight: 600, color: '#22543d' }} htmlFor="login-email">Email</label>
            <input id="login-email" type="email" required style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
            <label style={{ fontWeight: 600, color: '#22543d' }} htmlFor="login-password">Password</label>
            <input id="login-password" type="password" required style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: -8 }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: 15, color: '#22543d', fontWeight: 500 }}>
                <input type="checkbox" style={{ marginRight: 6 }} /> Remember me
              </label>
              <button type="button" style={{ background: 'none', border: 'none', color: '#5a67d8', textDecoration: 'underline', fontSize: 15, cursor: 'pointer', padding: 0 }}>Forgot password?</button>
            </div>
            <button type="submit" style={{ background: '#5a67d8', color: '#fff', borderRadius: 6, border: 'none', padding: '10px 0', fontWeight: 700, fontSize: 16, marginTop: 8, cursor: 'pointer' }}>Login</button>
          </form>
        </Modal>
        <Modal open={showSignup} onClose={() => setShowSignup(false)} title="Sign Up">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 18 }}>
            <button aria-label="Sign up with Google" style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: 8, cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center' }}><FcGoogle /></button>
            <button aria-label="Sign up with Facebook" style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: 8, cursor: 'pointer', fontSize: 20, color: '#1877f3', display: 'flex', alignItems: 'center' }}><FaFacebookF /></button>
            <button aria-label="Sign up with LinkedIn" style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: 8, cursor: 'pointer', fontSize: 20, color: '#0077b5', display: 'flex', alignItems: 'center' }}><FaLinkedinIn /></button>
          </div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={e => { e.preventDefault(); setShowSignup(false); }}>
            <label style={{ fontWeight: 600, color: '#22543d' }} htmlFor="signup-name">Name</label>
            <input id="signup-name" type="text" required style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
            <label style={{ fontWeight: 600, color: '#22543d' }} htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" required style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
            <label style={{ fontWeight: 600, color: '#22543d' }} htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" required style={{ padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: -8 }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: 15, color: '#22543d', fontWeight: 500 }}>
                <input type="checkbox" style={{ marginRight: 6 }} /> Remember me
              </label>
              <button type="button" style={{ background: 'none', border: 'none', color: '#5a67d8', textDecoration: 'underline', fontSize: 15, cursor: 'pointer', padding: 0 }}>Forgot password?</button>
            </div>
            <button type="submit" style={{ background: '#22543d', color: '#fff', borderRadius: 6, border: 'none', padding: '10px 0', fontWeight: 700, fontSize: 16, marginTop: 8, cursor: 'pointer' }}>Sign Up</button>
          </form>
        </Modal>
      </div>
      {/* Responsive styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            .topbar-root {
              min-height: 70px !important;
            }

            .topbar-root .main-row {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 1rem !important;
            }

            .topbar-root .login-section {
              justify-content: center !important;
              gap: 1rem !important;
            }

            .topbar-root .logo-section {
              justify-content: center !important;
            }
          }

          @media (max-width: 480px) {
            .topbar-root .utility-row {
              flex-direction: column !important;
              gap: 0.5rem !important;
              padding: 0.5rem 1rem !important;
            }

            .topbar-root .accessibility-controls {
              justify-content: center !important;
            }
          }
        `
      }} />
    </header>
  );
}
