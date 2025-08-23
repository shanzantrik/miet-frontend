import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTwitter, FaGoogle } from 'react-icons/fa';

export default function Footer() {
  return (
    <>
      <footer className="footer" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #3730a3 50%, #4338ca 75%, #6366f1 100%)',
        color: '#ffffff',
        padding: '4rem 0 2rem 0',
        position: 'relative',
        overflow: 'hidden'
      }} aria-label="Footer">

        {/* Background decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '-20%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-25%',
          right: '-15%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 2
        }}>

          {/* Main Footer Content */}
          <div className="footer-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>

            {/* Brand Section */}
            <div className="footer-brand" style={{ textAlign: 'left' }}>
              <div style={{
                fontFamily: 'Righteous, cursive',
                fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                color: '#ffffff',
                marginBottom: '1rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                MieT
              </div>
              <p style={{
                fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
                lineHeight: '1.6',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '1.5rem',
                fontWeight: '400'
              }}>
                Mind Inclusion Education Technology. Empowering children and families through inclusive education, mental health, and technology.
              </p>

              {/* Social Media Icons */}
              <div className="social-icons" style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                {[
                  { name: 'Facebook', icon: <FaFacebookF />, href: '#' },
                  { name: 'Instagram', icon: <FaInstagram />, href: '#' },
                  { name: 'LinkedIn', icon: <FaLinkedinIn />, href: '#' },
                  { name: 'YouTube', icon: <FaYoutube />, href: '#' },
                  { name: 'Twitter', icon: <FaTwitter />, href: '#' },
                  { name: 'Google Review', icon: <FaGoogle />, href: '#' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-quick-links" style={{ textAlign: 'left' }}>
              <h3 style={{
                fontSize: 'clamp(1.3rem, 1.5vw, 1.4rem)',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '1.5rem',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}>
                Quick Links
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem'
              }}>
                {[
                  { name: 'About Us', href: '/about' },
                  { name: 'Our Services', href: '/services' },
                  { name: 'Find Consultants', href: '/consultants' },
                  { name: 'Marketplace', href: '/marketplace' },
                  { name: 'Courses', href: '/courses' },
                  { name: 'Contact Us', href: '/contact' }
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: 'clamp(1rem, 1.1vw, 1.05rem)',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'inline-block'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.textShadow = '0 2px 8px rgba(255,255,255,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.textShadow = 'none';
                    }}
                  >
                    → {link.name}
                  </a>
                ))}
              </div>

              {/* Mobile Social Icons - Hidden on desktop, visible on mobile */}
              <div className="mobile-social-icons" style={{
                display: 'none',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                {[
                  { name: 'Facebook', icon: <FaFacebookF />, href: '#' },
                  { name: 'Instagram', icon: <FaInstagram />, href: '#' },
                  { name: 'LinkedIn', icon: <FaLinkedinIn />, href: '#' },
                  { name: 'YouTube', icon: <FaYoutube />, href: '#' },
                  { name: 'Twitter', icon: <FaTwitter />, href: '#' },
                  { name: 'Google Review', icon: <FaGoogle />, href: '#' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="footer-contact" style={{ textAlign: 'left' }}>
              <h3 style={{
                fontSize: 'clamp(1.3rem, 1.5vw, 1.4rem)',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '1.5rem',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}>
                Get in Touch
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{
                  fontSize: 'clamp(1rem, 1.1vw, 1.05rem)',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: '500',
                  lineHeight: '1.6'
                }}>
                  📍 Gurgaon, Haryana, India
                </div>
                <div style={{
                  fontSize: 'clamp(1rem, 1.1vw, 1.05rem)',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: '500',
                  lineHeight: '1.6'
                }}>
                  📞 +91 90855 38844
                </div>
                <div style={{
                  fontSize: 'clamp(1rem, 1.1vw, 1.05rem)',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: '500',
                  lineHeight: '1.6'
                }}>
                  ✉️ info@miet.in
                </div>

                {/* Newsletter Signup */}
                <div style={{ marginTop: '1rem' }}>
                  <p style={{
                    fontSize: 'clamp(0.9rem, 1vw, 1rem)',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '0.8rem',
                    fontWeight: '500'
                  }}>
                    Subscribe to our newsletter
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '0.8rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#ffffff',
                        fontSize: '1rem',
                        backdropFilter: 'blur(10px)',
                        outline: 'none'
                      }}
                    />
                    <button style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.8rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
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
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '2rem',
            textAlign: 'center'
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 'clamp(0.9rem, 1vw, 1rem)',
              fontWeight: '500',
              lineHeight: '1.6'
            }}>
              &copy; {new Date().getFullYear()} MieT (Mind Inclusion Education Technology). All rights reserved.
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 'clamp(0.8rem, 0.9vw, 0.9rem)',
              marginTop: '0.5rem',
              fontWeight: '400'
            }}>
              Designed with ❤️ for inclusive education and mental health support
            </p>
          </div>
        </div>

        {/* CSS Animations */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
              .footer {
                padding: 3rem 0 1.5rem 0 !important;
              }

              .footer input {
                min-width: 100% !important;
                margin-bottom: 0.5rem !important;
              }

              .footer button {
                width: 100% !important;
              }

              /* Mobile footer layout reordering */
              .footer-grid {
                grid-template-columns: 1fr !important;
                gap: 2rem !important;
              }

              .footer-brand {
                order: 1 !important;
                text-align: center !important;
              }

              .footer-quick-links {
                order: 2 !important;
                text-align: left !important;
                position: relative !important;
              }

              .footer-contact {
                order: 3 !important;
                text-align: center !important;
              }

              /* Move social icons to Quick Links section on mobile */
              .footer-brand .social-icons {
                display: none !important;
              }

              .footer-quick-links {
                position: relative !important;
              }

              .footer-quick-links::after {
                content: '' !important;
                display: block !important;
                height: 2rem !important;
              }

              /* Add social icons after Quick Links on mobile */
              .footer-quick-links .mobile-social-icons {
                display: flex !important;
                flex-direction: column !important;
                justify-content: flex-start !important;
                align-items: center !important;
                gap: 0.75rem !important;
                margin-top: 0 !important;
                padding-top: 0 !important;
                border-top: none !important;
                position: absolute !important;
                right: 0 !important;
                top: 0 !important;
                width: 60px !important;
              }

              /* Adjust Quick Links container for side-by-side layout */
              .footer-quick-links > div:first-child {
                display: inline-block !important;
                width: calc(100% - 80px) !important;
                margin-right: 80px !important;
              }

              /* Reduce footer height on mobile */
              .footer {
                padding: 2rem 0 1rem 0 !important;
              }

              .footer-grid {
                gap: 1.5rem !important;
                margin-bottom: 2rem !important;
              }

              .footer-brand,
              .footer-quick-links,
              .footer-contact {
                padding: 0 1rem !important;
              }

              .footer-quick-links .mobile-social-icons a {
                width: 44px !important;
                height: 44px !important;
                font-size: 1.1rem !important;
              }
            }

            @media (max-width: 480px) {
              .footer {
                padding: 2rem 0 1rem 0 !important;
              }

              /* Further optimize mobile layout for small screens */
              .footer-grid {
                gap: 1.5rem !important;
              }

              .footer-brand,
              .footer-quick-links,
              .footer-contact {
                padding: 0 1rem !important;
              }

              /* Optimize side-by-side layout for very small screens */
              .footer-quick-links > div:first-child {
                width: calc(100% - 70px) !important;
                margin-right: 70px !important;
              }

              .footer-quick-links .mobile-social-icons {
                width: 50px !important;
                gap: 0.5rem !important;
              }

              .footer-quick-links .mobile-social-icons a {
                width: 40px !important;
                height: 40px !important;
                font-size: 1rem !important;
              }

              /* Reduce spacing further for small screens */
              .footer-quick-links h3 {
                margin-bottom: 1rem !important;
              }

              .footer-quick-links > div:first-child {
                gap: 0.6rem !important;
              }
            }
          `
        }} />
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
