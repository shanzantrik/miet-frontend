"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@fontsource/righteous';
import '@fontsource/josefin-sans';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaBars, FaTimes, FaGoogle, FaFont, FaAdjust, FaLanguage, FaArrowUp } from "react-icons/fa";
import Image from "next/image";
import { useState, createContext, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const menuItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Consultants", href: "#consultants" },
  { label: "Marketplace", href: "#marketplace" },
];

function Modal({ open, onClose, type }: { open: boolean, onClose: () => void, type: 'login' | 'signup' }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem 2rem 2rem 2rem', minWidth: 320, maxWidth: '90vw', boxShadow: '0 8px 32px rgba(90,103,216,0.13)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#5a67d8', cursor: 'pointer' }}><FaTimes /></button>
        <h2 style={{ fontFamily: 'Righteous, cursive', color: '#22543d', fontSize: '1.5rem', marginBottom: 18 }}>{type === 'login' ? 'Login' : 'Sign Up'}</h2>
        {/* Social Login Icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 18 }}>
          <button style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, color: '#ea4335' }} title="Login with Google"><FaGoogle /></button>
          <button style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, color: '#1877f3' }} title="Login with Facebook"><FaFacebookF /></button>
          <button style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, color: '#0a66c2' }} title="Login with LinkedIn"><FaLinkedinIn /></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 18px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          <span style={{ margin: '0 12px', color: '#888', fontSize: 15 }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        </div>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {type === 'signup' && (
            <input type="text" placeholder="Full Name" style={{ padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }} />
          )}
          <input type="email" placeholder="Email" style={{ padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }} />
          <input type="password" placeholder="Password" style={{ padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }} />
          <button type="submit" style={{ background: '#5a67d8', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontWeight: 600, fontSize: 16, marginTop: 8, cursor: 'pointer' }}>{type === 'login' ? 'Login' : 'Sign Up'}</button>
        </form>
        {type === 'login' ? (
          <div style={{ marginTop: 18, fontSize: 15, color: '#444', textAlign: 'center' }}>
            Don&apos;t have an account? <span style={{ color: '#5a67d8', cursor: 'pointer', fontWeight: 600 }} onClick={() => { onClose(); setTimeout(() => window.dispatchEvent(new CustomEvent('open-signup')), 100); }}>Sign Up</span>
          </div>
        ) : (
          <div style={{ marginTop: 18, fontSize: 15, color: '#444', textAlign: 'center' }}>
            Already have an account? <span style={{ color: '#5a67d8', cursor: 'pointer', fontWeight: 600 }} onClick={() => { onClose(); setTimeout(() => window.dispatchEvent(new CustomEvent('open-login')), 100); }}>Login</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface UIContextType {
  lang: 'en' | 'hi';
  fontSize: number;
  highContrast: boolean;
  setLang: React.Dispatch<React.SetStateAction<'en' | 'hi'>>;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  setHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UIContext = createContext<UIContextType>({
  lang: 'en',
  fontSize: 1,
  highContrast: false,
  setLang: () => {},
  setFontSize: () => {},
  setHighContrast: () => {},
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [showCookie, setShowCookie] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShowCookie(!localStorage.getItem('cookieConsent'));
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 900);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAcceptCookie = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookie(false);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for modal switch events
  if (typeof window !== 'undefined') {
    window.addEventListener('open-signup', () => setShowSignup(true));
    window.addEventListener('open-login', () => setShowLogin(true));
  }

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          fontFamily: 'Josefin Sans, Arial, sans-serif',
          fontSize: `${fontSize}em`,
          background: highContrast ? '#000' : undefined,
          color: highContrast ? '#fff' : undefined,
        }}
      >
        <UIContext.Provider value={{ lang, fontSize, highContrast, setLang, setFontSize, setHighContrast }}>
        <nav style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem 3vw 1.2rem 3vw',
          background: highContrast ? '#222' : '#fff',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          boxShadow: '0 2px 12px rgba(90,103,216,0.07)',
          flexWrap: 'wrap',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
            <Image src="/miet-main.webp" alt="MieT Logo" width={48} height={48} style={{ borderRadius: '12px', background: '#f7fafc' }} />
            <div>
              <h1 style={{ fontFamily: 'Righteous, cursive', fontSize: '1.7rem', color: '#5a67d8', fontWeight: 700, margin: 0, lineHeight: 1 }}>
                {lang === 'en' ? 'MieT' : 'मीत'} <span style={{ fontFamily: 'Josefin Sans, Arial, sans-serif', color: '#22543d', fontSize: '1.1rem', fontWeight: 500 }}>({lang === 'en' ? 'मीत' : 'MieT'})</span>
              </h1>
              <div className="logo-tagline" style={{ fontFamily: 'Josefin Sans, Arial, sans-serif', color: '#5a67d8', fontSize: '1rem', fontWeight: 500, marginTop: 2 }}>
                {lang === 'en' ? 'mind inclusion education technology' : 'माइंड इन्क्लूजन एजुकेशन टेक्नॉलॉजी'}
              </div>
            </div>
          </div>
          {/* Hamburger for mobile */}
          <div className="nav-hamburger" style={{ display: isMobile ? 'block' : 'none', marginLeft: 16 }}>
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              style={{ background: 'none', border: 'none', fontSize: 32, color: '#5a67d8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label={lang === 'en' ? (mobileMenu ? 'Close menu' : 'Open menu') : (mobileMenu ? 'मेनू बंद करें' : 'मेनू खोलें')}
            >
              {mobileMenu ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          {/* Menu Items + Auth Buttons */}
          <div className={`nav-menu-wrap${mobileMenu ? ' nav-menu-open' : ''}`} style={{
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center',
            gap: '2.5rem',
            flex: 1,
            minWidth: 0,
            justifyContent: 'center',
            transition: 'all 0.3s',
          }}>
            <ul style={{
              display: 'flex',
              gap: '2.5rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              fontFamily: 'Josefin Sans, Arial, sans-serif',
              fontWeight: 600,
              fontSize: '1.1rem',
              justifyContent: 'center',
              minWidth: 0,
              flexWrap: 'wrap',
            }}>
              {menuItems.map(item => (
                <li key={item.label}>
                  <a href={item.href} style={{ color: '#22543d', textDecoration: 'none', transition: 'color 0.2s', whiteSpace: 'nowrap' }} aria-label={lang === 'en' ? item.label :
                    item.label === 'About' ? 'परिचय' :
                    item.label === 'Services' ? 'सेवाएँ' :
                    item.label === 'Consultants' ? 'सलाहकार' :
                    item.label === 'Marketplace' ? 'मार्केटप्लेस' : item.label
                  }>{lang === 'en' ? item.label :
                    item.label === 'About' ? 'परिचय' :
                    item.label === 'Services' ? 'सेवाएँ' :
                    item.label === 'Consultants' ? 'सलाहकार' :
                    item.label === 'Marketplace' ? 'मार्केटप्लेस' : item.label
                  }</a>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowLogin(true)} style={{
              background: '#fff',
              color: '#5a67d8',
              border: '1.5px solid #5a67d8',
              borderRadius: '8px',
              padding: '0.6rem 1.3rem',
              fontWeight: 600,
              fontFamily: 'Josefin Sans, Arial, sans-serif',
              textDecoration: 'none',
              fontSize: '1rem',
              marginLeft: '1rem',
              marginRight: '0.5rem',
              transition: 'background 0.2s, color 0.2s',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }} aria-label={lang === 'en' ? 'Login' : 'लॉगिन'}>{lang === 'en' ? 'Login' : 'लॉगिन'}</button>
            <button onClick={() => setShowSignup(true)} style={{
              background: '#5a67d8',
              color: '#fff',
              borderRadius: '8px',
              padding: '0.6rem 1.3rem',
              fontWeight: 600,
              fontFamily: 'Josefin Sans, Arial, sans-serif',
              textDecoration: 'none',
              fontSize: '1rem',
              marginRight: '0.5rem',
              border: 'none',
              transition: 'background 0.2s',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }} aria-label={lang === 'en' ? 'Sign Up' : 'साइन अप'}>{lang === 'en' ? 'Sign Up' : 'साइन अप'}</button>
            {/* Only show accessibility and social/contact icons on desktop */}
            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', minWidth: 0 }}>
                <button onClick={() => setFontSize(f => Math.max(0.8, f - 0.1))} aria-label={lang === 'en' ? 'Decrease font size' : 'फ़ॉन्ट आकार घटाएँ'} style={{ background: 'none', border: 'none', fontSize: 22, color: highContrast ? '#fff' : '#5a67d8', cursor: 'pointer' }}><FaFont style={{ fontSize: 18, marginRight: 2 }} />-</button>
                <button onClick={() => setFontSize(f => Math.min(1.5, f + 0.1))} aria-label={lang === 'en' ? 'Increase font size' : 'फ़ॉन्ट आकार बढ़ाएँ'} style={{ background: 'none', border: 'none', fontSize: 22, color: highContrast ? '#fff' : '#5a67d8', cursor: 'pointer' }}><FaFont style={{ fontSize: 22, marginRight: 2 }} />+</button>
                <button onClick={() => setHighContrast(h => !h)} aria-label={lang === 'en' ? 'Toggle high contrast mode' : 'हाई-कॉन्ट्रास्ट मोड'} style={{ background: 'none', border: 'none', fontSize: 22, color: highContrast ? '#fff' : '#5a67d8', cursor: 'pointer' }}><FaAdjust /></button>
                <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} aria-label={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'} style={{ background: 'none', border: 'none', fontSize: '2.2rem', color: highContrast ? '#fff' : '#5a67d8', cursor: 'pointer' }}><FaLanguage /></button>
                <a href="#contact" style={{ background: '#5a67d8', color: '#fff', borderRadius: '8px', padding: '0.6rem 1.3rem', fontWeight: 600, fontFamily: 'Josefin Sans, Arial, sans-serif', textDecoration: 'none', fontSize: '1rem', marginRight: '0.7rem', transition: 'background 0.2s', border: 'none', display: 'inline-block', whiteSpace: 'nowrap' }} aria-label={lang === 'en' ? 'Contact' : 'संपर्क करें'}>{lang === 'en' ? 'Contact' : 'संपर्क करें'}</a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: '#5a67d8', fontSize: '1.3rem' }}><FaFacebookF /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#5a67d8', fontSize: '1.3rem' }}><FaInstagram /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: '#5a67d8', fontSize: '1.3rem' }}><FaLinkedinIn /></a>
              </div>
            )}
          </div>
          <Modal open={showLogin} onClose={() => setShowLogin(false)} type="login" />
          <Modal open={showSignup} onClose={() => setShowSignup(false)} type="signup" />
          {/* Mobile Menu Overlay */}
          {mobileMenu && isMobile && (
            <div
              className="mobileMenuOverlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(34,37,77,0.92)',
                zIndex: 2000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                transition: 'background 0.3s',
              }}
              onClick={e => { if (e.target === e.currentTarget) setMobileMenu(false); }}
            >
              <div
                style={{
                  width: '80vw',
                  maxWidth: 340,
                  height: '100%',
                  background: '#fff',
                  boxShadow: '-2px 0 24px rgba(90,103,216,0.13)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  padding: '2.5rem 1.5rem 1.5rem 1.5rem',
                  position: 'relative',
                  animation: 'slideInRight 0.3s',
                }}
              >
                <button
                  onClick={() => setMobileMenu(false)}
                  style={{ background: 'none', border: 'none', fontSize: 32, color: '#5a67d8', alignSelf: 'flex-end', marginBottom: 24, cursor: 'pointer' }}
                  aria-label={lang === 'en' ? 'Close menu' : 'मेनू बंद करें'}
                >
                  <FaTimes />
                </button>
                <ul style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 28,
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  fontFamily: 'Josefin Sans, Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '1.3rem',
                  justifyContent: 'center',
                  minWidth: 0,
                  flexWrap: 'wrap',
                  marginBottom: 32,
                }}>
                  {menuItems.map(item => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        style={{ color: '#22543d', textDecoration: 'none', transition: 'color 0.2s', whiteSpace: 'nowrap', fontSize: '1.3rem', padding: '0.7rem 0', display: 'block' }}
                        aria-label={lang === 'en' ? item.label :
                          item.label === 'About' ? 'परिचय' :
                          item.label === 'Services' ? 'सेवाएँ' :
                          item.label === 'Consultants' ? 'सलाहकार' :
                          item.label === 'Marketplace' ? 'मार्केटप्लेस' : item.label
                        }
                        onClick={() => setMobileMenu(false)}
                      >
                        {lang === 'en' ? item.label :
                          item.label === 'About' ? 'परिचय' :
                          item.label === 'Services' ? 'सेवाएँ' :
                          item.label === 'Consultants' ? 'सलाहकार' :
                          item.label === 'Marketplace' ? 'मार्केटप्लेस' : item.label
                        }
                      </a>
                    </li>
                  ))}
                </ul>
                <button onClick={() => { setShowLogin(true); setMobileMenu(false); }} style={{ background: '#fff', color: '#5a67d8', border: '1.5px solid #5a67d8', borderRadius: '8px', padding: '0.9rem 1.5rem', fontWeight: 600, fontFamily: 'Josefin Sans, Arial, sans-serif', fontSize: '1.1rem', marginBottom: 16, transition: 'background 0.2s, color 0.2s', cursor: 'pointer', width: '100%' }} aria-label={lang === 'en' ? 'Login' : 'लॉगिन'}>{lang === 'en' ? 'Login' : 'लॉगिन'}</button>
                <button onClick={() => { setShowSignup(true); setMobileMenu(false); }} style={{ background: '#5a67d8', color: '#fff', borderRadius: '8px', padding: '0.9rem 1.5rem', fontWeight: 600, fontFamily: 'Josefin Sans, Arial, sans-serif', fontSize: '1.1rem', border: 'none', transition: 'background 0.2s', cursor: 'pointer', width: '100%' }} aria-label={lang === 'en' ? 'Sign Up' : 'साइन अप'}>{lang === 'en' ? 'Sign Up' : 'साइन अप'}</button>
                <div style={{ display: 'flex', gap: '1.2rem', marginTop: 24, justifyContent: 'center' }}>
                  <button onClick={() => setFontSize(f => Math.max(0.8, f - 0.1))} aria-label={lang === 'en' ? 'Decrease font size' : 'फ़ॉन्ट आकार घटाएँ'} style={{ background: 'none', border: 'none', fontSize: 22, color: '#5a67d8', cursor: 'pointer' }}><FaFont style={{ fontSize: 18, marginRight: 2 }} />-</button>
                  <button onClick={() => setFontSize(f => Math.min(1.5, f + 0.1))} aria-label={lang === 'en' ? 'Increase font size' : 'फ़ॉन्ट आकार बढ़ाएँ'} style={{ background: 'none', border: 'none', fontSize: 22, color: '#5a67d8', cursor: 'pointer' }}><FaFont style={{ fontSize: 22, marginRight: 2 }} />+</button>
                  <button onClick={() => setHighContrast(h => !h)} aria-label={lang === 'en' ? 'Toggle high contrast mode' : 'हाई-कॉन्ट्रास्ट मोड'} style={{ background: 'none', border: 'none', fontSize: 22, color: '#5a67d8', cursor: 'pointer' }}><FaAdjust /></button>
                  <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} aria-label={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'} style={{ background: 'none', border: 'none', fontSize: '2.2rem', color: '#5a67d8', cursor: 'pointer' }}><FaLanguage /></button>
                </div>
                <div style={{ display: 'flex', gap: '1.2rem', marginTop: 24, justifyContent: 'center' }}>
                  <a href="#contact" style={{ background: '#5a67d8', color: '#fff', borderRadius: '8px', padding: '0.9rem 1.5rem', fontWeight: 600, fontFamily: 'Josefin Sans, Arial, sans-serif', fontSize: '1.1rem', border: 'none', transition: 'background 0.2s', display: 'inline-block', whiteSpace: 'nowrap' }} aria-label={lang === 'en' ? 'Contact' : 'संपर्क करें'}>{lang === 'en' ? 'Contact' : 'संपर्क करें'}</a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: '#5a67d8', fontSize: '1.7rem' }}><FaFacebookF /></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#5a67d8', fontSize: '1.7rem' }}><FaInstagram /></a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: '#5a67d8', fontSize: '1.7rem' }}><FaLinkedinIn /></a>
                </div>
              </div>
            </div>
          )}
        </nav>
        {children}
        <footer style={{
          width: '100%',
          background: '#1a202c',
          color: '#fff',
          padding: '2.5rem 0 1.5rem 0',
          marginTop: '3rem',
          position: 'relative',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 3vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}>
            <div style={{ fontFamily: 'Righteous, cursive', fontSize: '2rem', color: '#5a67d8', marginBottom: '0.5rem' }}>
              MieT <span style={{ fontFamily: 'Josefin Sans, Arial, sans-serif', color: '#fff', fontSize: '1.1rem' }}>(मीत)</span>
            </div>
            <div style={{ fontFamily: 'Josefin Sans, Arial, sans-serif', fontSize: '1.1rem', color: '#cbd5e1', textAlign: 'center', maxWidth: '700px' }}>
              Mind Inclusion Education Technology. Empowering children and families through inclusive education, mental health, and technology.
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', margin: '1rem 0' }}>
              {menuItems.map(item => (
                <a key={item.label} href={item.href} style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: 500, fontSize: '1rem', fontFamily: 'Josefin Sans, Arial, sans-serif', transition: 'color 0.2s' }}>{item.label}</a>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: '#5a67d8', fontSize: '1.5rem' }}><FaFacebookF /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#5a67d8', fontSize: '1.5rem' }}><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: '#5a67d8', fontSize: '1.5rem' }}><FaLinkedinIn /></a>
            </div>
            <div style={{ color: '#a0aec0', fontSize: '0.95rem', marginTop: '1.2rem', fontFamily: 'Josefin Sans, Arial, sans-serif' }}>
              &copy; {new Date().getFullYear()} MieT. All rights reserved.
            </div>
          </div>
          {/* Move to Top Arrow */}
          <button
            onClick={handleScrollTop}
            aria-label={lang === 'en' ? 'Move to top' : 'ऊपर जाएं'}
            style={{
              position: 'fixed',
              right: 24,
              bottom: 32 + (showCookie ? 64 : 0),
              zIndex: 120,
              background: '#5a67d8',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 48,
              height: 48,
              boxShadow: '0 2px 8px rgba(90,103,216,0.18)',
              fontSize: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <FaArrowUp />
          </button>
          {/* Cookie Consent Banner */}
          {showCookie && (
            <div style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              background: '#fff',
              color: '#22543d',
              boxShadow: '0 -2px 16px rgba(90,103,216,0.10)',
              padding: '1.2rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              zIndex: 200,
              fontFamily: 'Josefin Sans, Arial, sans-serif',
              fontSize: '1rem',
            }}>
              <span>
                {lang === 'en'
                  ? 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.'
                  : 'हम आपके अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग करते हैं। इस साइट का उपयोग जारी रखने पर आप हमारी कुकीज़ नीति से सहमत होते हैं।'}
              </span>
              <button
                onClick={handleAcceptCookie}
                style={{
                  background: '#5a67d8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.6rem 1.3rem',
                  fontWeight: 600,
                  fontFamily: 'Josefin Sans, Arial, sans-serif',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginRight: 8,
                }}
              >
                {lang === 'en' ? 'Accept' : 'स्वीकार करें'}
              </button>
              <a
                href="#"
                style={{
                  color: '#5a67d8',
                  textDecoration: 'underline',
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {lang === 'en' ? 'Learn More' : 'और जानें'}
              </a>
            </div>
          )}
        </footer>
        </UIContext.Provider>
      </body>
    </html>
  );
}
