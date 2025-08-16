import React from 'react';

export default function Footer() {
  // TODO: Add more links, social, accessibility info
  return (
    <>
      <footer className="footer" style={{ background: '#22543d', color: '#fff', padding: '2.5rem 0', textAlign: 'center' }} aria-label="Footer">
        <div style={{ maxWidth: 900, margin: '0 auto', fontSize: 16 }}>
          <div style={{ fontFamily: 'Righteous, cursive', fontSize: 24, color: '#5a67d8', marginBottom: 8 }}>MieT</div>
          <div style={{ marginBottom: 12 }}>Mind Inclusion Education Technology. Empowering children and families through inclusive education, mental health, and technology.</div>
          <div style={{ marginBottom: 12 }}>
            <a href="#" style={{ color: '#fff', margin: '0 10px', textDecoration: 'underline' }}>About</a>
            <a href="#" style={{ color: '#fff', margin: '0 10px', textDecoration: 'underline' }}>Services</a>
            <a href="#" style={{ color: '#fff', margin: '0 10px', textDecoration: 'underline' }}>Consultants</a>
            <a href="#" style={{ color: '#fff', margin: '0 10px', textDecoration: 'underline' }}>Marketplace</a>
            <a href="/courses" style={{ color: '#fff', margin: '0 10px', textDecoration: 'underline' }}>Courses</a>
            <a href="#" style={{ color: '#fff', margin: '0 10px', textDecoration: 'underline' }}>Contact</a>
          </div>
          <div style={{ marginBottom: 12 }}>
            <a href="#" aria-label="Facebook" style={{ color: '#fff', margin: '0 8px' }}>F</a>
            <a href="#" aria-label="Instagram" style={{ color: '#fff', margin: '0 8px' }}>I</a>
            <a href="#" aria-label="LinkedIn" style={{ color: '#fff', margin: '0 8px' }}>L</a>
            <a href="#" aria-label="YouTube" style={{ color: '#fff', margin: '0 8px' }}>Y</a>
            <a href="#" aria-label="Twitter" style={{ color: '#fff', margin: '0 8px' }}>T</a>
            <a href="#" aria-label="Google Review" style={{ color: '#fff', margin: '0 8px' }}>G</a>
          </div>
          <div style={{ color: '#cbd5e1', fontSize: 14, marginTop: 18 }}>
            &copy; {new Date().getFullYear()} MieT. All rights reserved.
          </div>
        </div>
      </footer>
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919085538844"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          background: '#25d366',
          color: '#fff',
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px #5a67d822',
          fontSize: 36,
          zIndex: 2000,
          textDecoration: 'none',
        }}
      >
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <circle cx="16" cy="16" r="16" fill="#25d366"/>
          <path d="M23.472 19.339c-.355-.177-2.104-1.037-2.43-1.155-.326-.119-.563-.177-.8.177-.237.355-.914 1.155-1.122 1.392-.207.237-.414.266-.769.089-.355-.178-1.5-.553-2.858-1.763-1.056-.944-1.77-2.108-1.98-2.463-.207-.355-.022-.546.155-.723.159-.158.355-.414.533-.621.178-.207.237-.355.355-.592.119-.237.06-.444-.03-.621-.089-.178-.8-1.924-1.096-2.637-.289-.693-.583-.597-.8-.608-.207-.009-.444-.011-.681-.011-.237 0-.621.089-.946.444-.326.355-1.24 1.211-1.24 2.955 0 1.744 1.268 3.429 1.445 3.667.178.237 2.5 3.82 6.055 5.209.847.291 1.507.464 2.023.594.85.203 1.624.174 2.236.106.682-.075 2.104-.859 2.402-1.689.296-.83.296-1.541.207-1.689-.089-.148-.326-.237-.681-.414z" fill="#fff"/>
        </svg>
      </a>
      {/* Move to Top Floating Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Move to top"
        style={{
          position: 'fixed',
          bottom: 100,
          right: 32,
          background: '#5a67d8',
          color: '#fff',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px #5a67d822',
          fontSize: 28,
          zIndex: 2001,
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <path d="M12 4l-8 8h6v8h4v-8h6z" fill="#fff"/>
        </svg>
      </button>
    </>
  );
}
