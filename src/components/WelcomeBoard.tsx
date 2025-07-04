import React from 'react';

export default function WelcomeBoard() {
  // Use public/brain-miet.svg as the center icon, floating, with animated concentric circles and 4 floating labels
  return (
    <section
      className="welcome-board"
      style={{
        background: 'var(--muted-alt)',
        padding: 0,
        minHeight: '60vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        position: 'relative',
      }}
      aria-label="Welcome message"
    >
      <div style={{
        width: '100%',
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        flexWrap: 'wrap',
        boxSizing: 'border-box',
      }}>
        {/* Left: Text */}
        <div style={{
          flex: 1,
          minWidth: 320,
          maxWidth: 700,
          textAlign: 'left',
          padding: '3.5rem 2.5rem',
          color: 'var(--text-accent-alt)',
          zIndex: 2,
          boxSizing: 'border-box',
        }}>
          <div style={{ fontSize: 32, color: 'var(--text-accent-alt)', fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
            Comprehensive Support for Special Education and Mental Health Challenges
          </div>
          <div style={{ fontSize: 20, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 28 }}>
            We provide best specialized education services for children with unique needs &amp; services to address Mental Health Challenges.
          </div>
          <div style={{ fontSize: 22, color: 'var(--text-accent-alt)', fontWeight: 600, lineHeight: 1.5, marginBottom: 10 }}>
            Welcome to <b>MieT</b>! <br />
            <span style={{ fontSize: 18, color: '#444', fontWeight: 400 }}>
              Book sessions, get support, and thrive with MieT.<br />
              Your trusted platform for connecting with Special Education and Mental Health Professionals, and accessing inclusive resources. <a href="#" style={{ color: '#5a67d8', textDecoration: 'underline' }}>Learn more</a>.
            </span>
          </div>
        </div>
        {/* Right: Animated Brain Hero */}
        <div style={{
          flex: 1,
          minWidth: 320,
          maxWidth: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          height: '60vh',
          minHeight: 320,
          zIndex: 1,
          boxSizing: 'border-box',
        }}>
          <div style={{ position: 'relative', width: 320, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Rotating Concentric Circles */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: 320, height: 320, zIndex: 1, pointerEvents: 'none', animation: 'rotateCircles 12s linear infinite' }}>
              {[1, 2, 3].map((n) => (
                <svg
                  key={n}
                  width={320}
                  height={320}
                  style={{ position: 'absolute', left: 0, top: 0 }}
                >
                  <circle
                    cx={160}
                    cy={160}
                    r={90 + n * 25}
                    fill="none"
                    stroke={n % 2 === 0 ? '#5a67d8' : '#25d366'}
                    strokeWidth={n === 1 ? 2.5 : 1.5}
                    opacity={0.18 + n * 0.07}
                    strokeDasharray={n === 3 ? '8 8' : 'none'}
                  />
                </svg>
              ))}
            </div>
            {/* Center: Floating Brain Icon */}
            <img
              src="/brain-miet.svg"
              alt="MieT Brain Logo"
              style={{
                width: 140,
                height: 140,
                zIndex: 2,
                position: 'absolute',
                left: 90,
                top: 90,
                animation: 'brainFloat 3.2s ease-in-out infinite alternate',
                filter: 'drop-shadow(0 2px 8px #5a67d822)',
                background: 'transparent',
              }}
              draggable={false}
            />
            {/* Animated Dots/Particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 160 + 120 * Math.cos((i / 12) * 2 * Math.PI) - 7,
                  top: 160 + 120 * Math.sin((i / 12) * 2 * Math.PI) - 7,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? '#5a67d8' : '#25d366',
                  opacity: 0.7,
                  animation: `dotFloat${i % 3} 2.8s ${(i * 0.2).toFixed(1)}s infinite alternate`,
                  zIndex: 3,
                  boxShadow: '0 1px 4px #5a67d822',
                }}
              />
            ))}
            {/* Animated Text Labels - precisely aligned */}
            <div style={{
              position: 'absolute',
              left: 160,
              top: 18,
              transform: 'translate(-50%, -100%)',
              color: '#5a67d8',
              fontWeight: 700,
              fontSize: 20,
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 12,
              padding: '4px 18px',
              boxShadow: '0 2px 8px #5a67d822',
              animation: 'labelFloat1 3.2s 0.2s infinite alternate',
              zIndex: 10,
              pointerEvents: 'none',
              textAlign: 'center',
              minWidth: 90,
            }}>Mind</div>
            <div style={{
              position: 'absolute',
              left: 302,
              top: 160,
              transform: 'translate(0, -50%)',
              color: '#25d366',
              fontWeight: 700,
              fontSize: 20,
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 12,
              padding: '4px 18px',
              boxShadow: '0 2px 8px #5a67d822',
              animation: 'labelFloat2 3.2s 0.5s infinite alternate',
              zIndex: 10,
              pointerEvents: 'none',
              textAlign: 'center',
              minWidth: 110,
            }}>Inclusion</div>
            <div style={{
              position: 'absolute',
              left: 160,
              top: 302,
              transform: 'translate(-50%, 0)',
              color: '#5a67d8',
              fontWeight: 700,
              fontSize: 20,
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 12,
              padding: '4px 18px',
              boxShadow: '0 2px 8px #5a67d822',
              animation: 'labelFloat3 3.2s 0.8s infinite alternate',
              zIndex: 10,
              pointerEvents: 'none',
              textAlign: 'center',
              minWidth: 110,
            }}>Education</div>
            <div style={{
              position: 'absolute',
              left: -115,
              top: 160,
              transform: 'translate(0, -50%)',
              color: '#5a67d8',
              fontWeight: 700,
              fontSize: 20,
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 12,
              padding: '4px 18px',
              boxShadow: '0 2px 8px #5a67d822',
              animation: 'labelFloat4 3.2s 1.1s infinite alternate',
              zIndex: 10,
              pointerEvents: 'none',
              textAlign: 'center',
              minWidth: 110,
            }}>Technology</div>
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes rotateCircles {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes brainFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-18px); }
        }
        @keyframes dotFloat0 {
          0% { transform: translateY(0); }
          100% { transform: translateY(-12px); }
        }
        @keyframes dotFloat1 {
          0% { transform: translateY(0); }
          100% { transform: translateY(-7px); }
        }
        @keyframes dotFloat2 {
          0% { transform: translateY(0); }
          100% { transform: translateY(-16px); }
        }
        @keyframes labelFloat1 {
          0% { transform: translate(-50%, -100%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -120%) scale(1.08); opacity: 0.92; }
        }
        @keyframes labelFloat2 {
          0% { transform: translate(0, -50%) scale(1); opacity: 1; }
          100% { transform: translate(10px, -60%) scale(1.08); opacity: 0.92; }
        }
        @keyframes labelFloat3 {
          0% { transform: translate(-50%, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, 20px) scale(1.08); opacity: 0.92; }
        }
        @keyframes labelFloat4 {
          0% { transform: translate(0, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-10px, -40%) scale(1.08); opacity: 0.92; }
        }
        @media (max-width: 900px) {
          .welcome-board {
            flex-direction: column !important;
            text-align: center !important;
            min-height: 420px !important;
            height: auto !important;
          }
          .welcome-board > div,
          .welcome-board > div > div {
            max-width: 100vw !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
          }
        }
      `,
        }}
      />
    </section>
  );
}
