import React from 'react';
import styles from './WelcomeBoard.module.css';



export default function WelcomeBoard() {
  // Use public/brain-miet.svg as the center icon, floating, with animated concentric circles and 4 floating labels
  return (
    <section
      className={`welcome-board ${styles.welcomeBoard}`}
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
        overflow: 'hidden',
      }}
      aria-label="Welcome message"
    >
      {/* Animated Background Glow Elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-20%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.20) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'glowFloat1 8s ease-in-out infinite',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '-15%',
        width: '35%',
        height: '35%',
        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.18) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'glowFloat2 10s ease-in-out infinite reverse',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '10%',
        width: '25%',
        height: '25%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'glowFloat3 12s ease-in-out infinite',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '10%',
        width: '20%',
        height: '20%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'glowFloat4 15s ease-in-out infinite reverse',
        zIndex: 0,
      }} />
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
                    <div
            className="hero-title"
            style={{
              fontSize: 'clamp(2.5rem, 3vw, 2rem)',
              color: 'var(--text-accent-alt)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              letterSpacing: '0.5px'
            }}
          >
            Comprehensive Support for Special Education and Mental Health Challenges
          </div>
                    <div
            className="hero-subtitle"
            style={{
              fontSize: 'clamp(1.3rem, 1.5vw, 1rem)',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              marginBottom: '2rem',
              lineHeight: 1.4,
              maxWidth: '600px'
            }}
          >
            We provide best specialized education services for children with unique needs &amp; services to address Mental Health Challenges.
          </div>
                    <div
            className="hero-welcome"
            style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              color: 'var(--text-accent-alt)',
              fontWeight: 700,
              lineHeight: 1.4,
              marginBottom: '1rem',
              textShadow: '0 1px 5px rgba(0,0,0,0.1)'
            }}
          >
            Welcome to <b style={{ color: '#5a67d8' }}>MieT</b>! <br />
                        <span
              className="hero-description"
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                color: '#444',
                fontWeight: 500,
                lineHeight: 1.6
              }}
            >
              Book sessions, get support, and thrive with MieT.<br />
              Your trusted platform for connecting with Special Education and Mental Health Professionals, and accessing inclusive resources.
            </span>
          </div>

                    <button
            onClick={() => window.location.href = '/about'}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '0.8rem 1.5rem',
              fontWeight: '700',
              fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
              cursor: 'pointer',
              marginTop: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
              display: 'inline-block'
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
            Learn More
          </button>
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
            <div className={styles.rotatingCircles} style={{ position: 'absolute', left: 0, top: 0, width: 320, height: 320, zIndex: 1, pointerEvents: 'none' }}>
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
              className={styles.brainFloat}
              style={{
                width: 140,
                height: 140,
                zIndex: 2,
                position: 'absolute',
                left: 90,
                top: 90,
                filter: 'drop-shadow(0 2px 8px #5a67d822)',
                background: 'transparent',
              }}
              draggable={false}
            />
            {/* Animated Dots/Particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={styles[`dotFloat${i % 3}`]}
                style={{
                  position: 'absolute',
                  left: 160 + 120 * Math.cos((i / 12) * 2 * Math.PI) - 7,
                  top: 160 + 120 * Math.sin((i / 12) * 2 * Math.PI) - 7,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? '#5a67d8' : '#25d366',
                  opacity: 0.7,
                  zIndex: 3,
                  boxShadow: '0 1px 4px #5a67d822',
                }}
              />
            ))}
            {/* Animated Text Labels - precisely aligned */}
            <div className={styles.labelFloat1} style={{
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
              zIndex: 10,
              pointerEvents: 'none',
              textAlign: 'center',
              minWidth: 90,
            }}>Mind</div>
            <div className={styles.labelFloat2} style={{
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
              zIndex: 10,
              pointerEvents: 'none',
              textAlign: 'center',
              minWidth: 110,
            }}>Inclusion</div>
            <div className={styles.labelFloat3} style={{
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
              zIndex: 10,
              pointerEvents: 'none',
              textAlign: 'center',
              minWidth: 110,
            }}>Education</div>
            <div className={styles.labelFloat4} style={{
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
        /* Background Glow Animations */
        @keyframes glowFloat1 {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.8; }
          50% { transform: translateY(-30px) scale(1.1); opacity: 1; }
        }
        @keyframes glowFloat2 {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(25px) scale(1.05); opacity: 0.9; }
        }
        @keyframes glowFloat3 {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.5; }
          50% { transform: translateY(-20px) scale(1.08); opacity: 0.8; }
        }
        @keyframes glowFloat4 {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(15px) scale(1.03); opacity: 0.7; }
        }

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

          /* Responsive font adjustments for mobile */
          .welcome-board .hero-title {
            font-size: clamp(2rem, 4vw, 3rem) !important;
            margin-bottom: 1rem !important;
          }
          .welcome-board .hero-subtitle {
            font-size: clamp(1.1rem, 2vw, 1.5rem) !important;
            margin-bottom: 1.5rem !important;
          }
          .welcome-board .hero-welcome {
            font-size: clamp(1.2rem, 2.5vw, 1.6rem) !important;
            margin-bottom: 0.8rem !important;
          }
          .welcome-board .hero-description {
            font-size: clamp(1rem, 1.8vw, 1.2rem) !important;
          }
        }

        /* iPhone 14 Pro Max specific optimizations (430px width) */
        @media (max-width: 430px) {
          .welcome-board {
            padding: 1.5rem 1rem !important;
            min-height: 100vh !important;
            justify-content: center !important;
          }
          
          .welcome-board .hero-title {
            font-size: clamp(1.6rem, 4.5vw, 2.2rem) !important;
            line-height: 1.1 !important;
            margin-bottom: 0.8rem !important;
            max-width: 90% !important;
          }
          
          .welcome-board .hero-subtitle {
            font-size: clamp(0.9rem, 2.2vw, 1.2rem) !important;
            line-height: 1.2 !important;
            margin-bottom: 1.2rem !important;
            max-width: 95% !important;
          }
          
          .welcome-board .hero-welcome {
            font-size: clamp(1rem, 2.8vw, 1.3rem) !important;
            margin-bottom: 0.6rem !important;
          }
          
          .welcome-board .hero-description {
            font-size: clamp(0.85rem, 2vw, 1rem) !important;
            line-height: 1.3 !important;
            max-width: 100% !important;
          }
          
          /* Optimize floating brain animation for mobile */
          .welcome-board [style*="position: absolute"] {
            transform: scale(0.7) !important;
          }
          
          /* Adjust floating labels for smaller screen */
          .welcome-board .floating-label {
            font-size: clamp(0.7rem, 1.8vw, 0.9rem) !important;
            padding: 0.3rem 0.6rem !important;
          }
          
          /* Better spacing for touch interactions */
          .welcome-board button,
          .welcome-board a {
            min-height: 48px !important;
            padding: 0.75rem 1.5rem !important;
            font-size: clamp(0.9rem, 2.2vw, 1rem) !important;
          }

          /* Scale down the entire animation container for mobile */
          .welcome-board > div > div:last-child > div:last-child {
            transform: scale(0.75) !important;
            transform-origin: center !important;
          }

          /* Ensure all labels are visible within the scaled container */
          .welcome-board .labelFloat1,
          .welcome-board .labelFloat2,
          .welcome-board .labelFloat3,
          .welcome-board .labelFloat4 {
            font-size: 16px !important;
            padding: 3px 14px !important;
            min-width: 80px !important;
          }
        }

        /* Mobile optimization for labels visibility */
        @media (max-width: 768px) {
          /* Scale down the animation container on mobile */
          .welcome-board > div > div:last-child > div:last-child {
            transform: scale(0.85) !important;
            transform-origin: center !important;
          }

          /* Adjust label positions to ensure visibility */
          .welcome-board .labelFloat1,
          .welcome-board .labelFloat2,
          .welcome-board .labelFloat3,
          .welcome-board .labelFloat4 {
            font-size: 18px !important;
            padding: 4px 16px !important;
          }

          /* Reorder elements on mobile - animation first, then text */
          .welcome-board > div {
            flex-direction: column !important;
          }

          .welcome-board > div > div:first-child {
            order: 2 !important;
            flex: 1 !important;
            min-width: 100% !important;
            max-width: 100% !important;
            padding: 2rem 1.5rem !important;
            text-align: center !important;
          }

          .welcome-board > div > div:last-child {
            order: 1 !important;
            flex: 1 !important;
            min-width: 100% !important;
            max-width: 100% !important;
            height: 50vh !important;
            min-height: 280px !important;
            margin-bottom: 1rem !important;
          }
        }

        @media (max-width: 480px) {
          .welcome-board .hero-title {
            font-size: clamp(1.8rem, 3.5vw, 2.5rem) !important;
            line-height: 1.2 !important;
          }
          .welcome-board .hero-subtitle {
            font-size: clamp(1rem, 1.8vw, 1.3rem) !important;
            line-height: 1.3 !important;
          }
          .welcome-board .hero-welcome {
            font-size: clamp(1.1rem, 2.2vw, 1.4rem) !important;
          }
          .welcome-board .hero-description {
            font-size: clamp(0.9rem, 1.6vw, 1.1rem) !important;
            line-height: 1.4 !important;
          }

          /* Further scale down for very small screens */
          .welcome-board > div > div:last-child > div:last-child {
            transform: scale(0.7) !important;
            transform-origin: center !important;
          }

          /* Optimize layout for very small screens */
          .welcome-board > div > div:first-child {
            padding: 1.5rem 1rem !important;
            margin-top: 0 !important;
          }

          .welcome-board > div > div:last-child {
            height: 45vh !important;
            min-height: 250px !important;
            margin-bottom: 0.5rem !important;
          }
        }
      `,
        }}
      />
    </section>
  );
}
