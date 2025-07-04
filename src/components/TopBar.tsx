'use client';
import React, { useState } from 'react';
import { FaHome, FaAdjust, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter, FaGlobe, FaBars, FaTimes } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import Image from 'next/image';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '2px 2vw', background: highContrast ? '#000' : '#e6f0f7' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="#" aria-label="Home" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: 18 }}><FaHome /></a>
          <a
            href="#"
            aria-label="Sitemap"
            style={{
              color: highContrast ? '#fff' : '#22543d',
              textDecoration: 'none'
            }}
          >
            Sitemap
          </a>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button aria-label="Decrease font size" onClick={() => setFontSize(f => Math.max(0.8, +(f - 0.1).toFixed(2)))} style={{ background: 'none', border: 'none', color: highContrast ? '#fff' : '#22543d', cursor: 'pointer', fontWeight: 700, fontSize: 18, padding: '0 6px' }}>A-</button>
          <button aria-label="Reset font size" onClick={() => setFontSize(1)} style={{ background: 'none', border: 'none', color: highContrast ? '#fff' : '#22543d', cursor: 'pointer', fontWeight: 700, fontSize: 20, padding: '0 6px' }}>A</button>
          <button aria-label="Increase font size" onClick={() => setFontSize(f => Math.min(1.5, +(f + 0.1).toFixed(2)))} style={{ background: 'none', border: 'none', color: highContrast ? '#fff' : '#22543d', cursor: 'pointer', fontWeight: 700, fontSize: 22, padding: '0 6px' }}>A+</button>
          <button aria-label="Toggle high contrast" onClick={() => setHighContrast(h => !h)} style={{ background: 'none', border: 'none', color: highContrast ? '#fff' : '#22543d', cursor: 'pointer', fontSize: 20, marginLeft: 4 }}><FaAdjust /></button>
          {/* Language dropdown with flag */}
          <div style={{ position: 'relative', marginLeft: 8 }}>
            <button aria-label="Switch language" onClick={() => setShowLang(l => !l)} style={{ background: '#fff', border: '1px solid #22543d', borderRadius: 4, color: '#22543d', padding: '0 8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Flag code={lang} />{lang.toUpperCase()} ▼
            </button>
            {showLang && (
              <div style={{ position: 'absolute', top: 32, left: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4, zIndex: 10, minWidth: 70 }}>
                <button onClick={() => { setLang('en'); setShowLang(false); }} style={{ display: 'flex', alignItems: 'center', width: '100%', background: 'none', border: 'none', color: '#22543d', padding: '6px 12px', cursor: 'pointer' }}><Flag code="en" />EN</button>
                <button onClick={() => { setLang('hi'); setShowLang(false); }} style={{ display: 'flex', alignItems: 'center', width: '100%', background: 'none', border: 'none', color: '#22543d', padding: '6px 12px', cursor: 'pointer' }}><Flag code="hi" />HI</button>
              </div>
            )}
          </div>
          {/* TODO: Implement currency switch */}
          <button aria-label="Switch currency" style={{ background: '#fff', border: '1px solid #22543d', borderRadius: 4, color: '#22543d', padding: '0 8px', fontWeight: 600, marginLeft: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><FaGlobe style={{ marginRight: 4 }} />₹</button>
        </div>
      </div>
      {/* Main Row: Logo, Navigation, Login/Signup, Social, Hamburger for mobile */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 2vw', background: highContrast ? '#222' : '#fff', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/">
            <Image src="/miet-main.webp" alt="MieT Logo" width={56} height={56} style={{ borderRadius: 12, background: '#f7fafc' }} priority />
          </Link>
          <span style={{ fontFamily: 'Righteous, cursive', fontSize: 28, color: '#5a67d8', fontWeight: 700 }}>MieT</span>
        </div>
        {/* Main Navigation (desktop) */}
        {!isMobile && (
          <nav aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 16, fontWeight: 600, flex: 1, justifyContent: 'center', color: highContrast ? '#fff' : '#22543d' }}>
            <Link href="/" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: 18, marginRight: 8 }}><FaHome /></Link>
            <Link href="/about" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none' }}>About Us</Link>
            {/* Services with single link */}
            <Link href="/services" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none' }}>Services</Link>
            <Link href="/consultants" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none' }}>Consultants</Link>
            <Link href="/marketplace" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none' }}>Marketplace</Link>
            {/* Resources with submenu - removed for now */}
            {/* <div style={{ position: 'relative', margin: 0 }} onMouseOver={() => setShowResources(true)} onMouseOut={() => setShowResources(false)}>
              <button style={{ background: 'none', border: 'none', color: highContrast ? '#fff' : '#22543d', fontWeight: 600, fontSize: 16, cursor: 'pointer', padding: 0 }}>Resources ▼</button>
              {showResources && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: highContrast ? '#222' : '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 2px 12px rgba(90,103,216,0.07)', display: 'flex', flexDirection: 'column', padding: 12, zIndex: 20, minWidth: 180, marginTop: 0 }}>
                  <Link href="/blog" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', marginBottom: 8, padding: '6px 12px', borderRadius: 4 }}>Blog</Link>
                  <Link href="/legal" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', marginBottom: 8, padding: '6px 12px', borderRadius: 4 }}>Legal Framework</Link>
                  <Link href="/resources" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none', padding: '6px 12px', borderRadius: 4 }}>Free Resources</Link>
                </div>
              )}
            </div> */}
            <Link href="/contact" style={{ color: highContrast ? '#fff' : '#22543d', textDecoration: 'none' }}>Contact Us</Link>
          </nav>
        )}
        {/* Hamburger for mobile */}
        {isMobile && (
          <button onClick={() => setMobileMenu(m => !m)} aria-label="Open menu" style={{ background: 'none', border: 'none', fontSize: 32, color: highContrast ? '#fff' : '#5a67d8', cursor: 'pointer', marginLeft: 16 }}>
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        )}
        {/* Login/Signup and Social */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginLeft: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: '#5a67d8', color: '#fff', borderRadius: 6, border: 'none', padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowLogin(true)}>Login</button>
            <button style={{ background: '#22543d', color: '#fff', borderRadius: 6, border: 'none', padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowSignup(true)}>Sign Up</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Google Review"><span style={{ fontWeight: 700, fontSize: 18, margin: '0 4px' }}>G</span></a>
          </div>
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
    </header>
  );
}
