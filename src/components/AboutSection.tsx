import React, { useState } from 'react';

const tabs = [
  {
    label: 'Overview',
    content: (
      <div
        style={{
          maxWidth: 'min(1200px, 96vw)',
          margin: '0 auto',
          color: '#22543d',
          fontSize: 18,
          lineHeight: 1.7,
          display: 'flex',
          flexDirection: 'row',
          gap: 40,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{
            color: '#667eea',
            fontWeight: '700',
            fontSize: 'clamp(1.5rem, 2vw, 1.8rem)',
            marginBottom: '1rem',
            lineHeight: '1.3'
          }}>
            Comprehensive Support for Special Education and Mental Health Challenges
          </h3>
          <p>
            We provide best <b>specialized education services</b> for children with <b>unique needs</b> & services to address <b>Mental Health Challenges</b>.
          </p>
          <h3 style={{ color: '#5a67d8', fontWeight: 700, marginTop: 32 }}>
            Join Our Community of Special Educators & Counsellors
          </h3>
          <p>
            Discover the latest research, strategies & tools for teaching students with diverse learning needs. MieT is right place for guardian of a child with special needs, student persuing Special Education or Psychology, technology enthusiast, experienced Special Educator or Counsellor!
          </p>
          <h3 style={{ color: '#5a67d8', fontWeight: 700, marginTop: 32 }}>About MieT (मीत)</h3>
          <p>
            <b>Introducing MieT (मीत): Your Trusted Partner in Inclusion, Special Education, and Mental Health</b>
          </p>
          <p>
            Based in Gurgaon, MieT is a tech-enabled platform committed to empowering individuals with diverse abilities through personalized Special Education, Mental Health Services and Counselling. Our mission is to unlock potential, nurture growth and build an inclusive community of caregivers, educators, and professionals.
          </p>
          <p>
            We offer comprehensive support through customized care plans, emotional well-being services, social communication coaching and career guidance—ensuring holistic development for every individual. At MieT, education meets empathy and care meets innovation.
          </p>
          <p>Join us in creating a world where everyone has the opportunity to thrive.</p>
          <div style={{ color: '#5a67d8', fontWeight: 600, marginTop: 18 }}>
            Best Reviews · Special Education · Mental Health · Counselling · Assessment · Delhi NCR · Gurgaon · Online · Offline
          </div>
        </div>
        <div className="about-image-container" style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <img
            className="miet-hero-image"
            src="/intro.webp"
            alt="MieT Hero"
            style={{ width: '100%', maxWidth: 420, borderRadius: 16, margin: '0 auto', display: 'block', boxShadow: '0 4px 24px #5a67d822' }}
          />
          <iframe
            width="100%"
            height="260"
            src="https://www.youtube.com/embed/hQFG_yXbmIM"
            title="MieT Introduction"
            style={{ borderRadius: 12, boxShadow: '0 2px 12px #5a67d822', minWidth: 220 }}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    ),
  },
  {
    label: 'Vision',
    content: (
      <div style={{ maxWidth: 900, margin: '0 auto', color: '#22543d', fontSize: 18, lineHeight: 1.7 }}>
        <h3 style={{ color: '#5a67d8', fontWeight: 700 }}>Our Vision</h3>
        <p>At MieT (मीत), we envision a world where inclusion is not an exception but a standard—where every individual, regardless of ability, feels a sense of belonging, purpose and dignity. Our vision is to create a compassionate, tech-enabled ecosystem that celebrates neurodiversity and supports individuals with disabilities through accessible education, mental health services, and counselling.</p>
        <p>We aspire to build a future where children and adults with diverse abilities are not only supported but empowered to realize their full potential. By removing barriers to learning, communication and social participation, we aim to ensure equal access to opportunities in education, employment, and everyday life.</p>
        <p>Through collaboration with families, professionals and communities, MieT seeks to foster a culture of understanding and acceptance. We are dedicated to being a trusted friend—a मीत—on every individual&apos;s journey toward self-reliance, emotional well-being and a more inclusive society.</p>
        <div style={{ color: '#5a67d8', fontWeight: 600, marginTop: 18 }}>Top ranking · Best reviews · Jyoti Bajaj · Best Special Educator · Mental Health · Gurgaon · Delhi NCR · DPS</div>
      </div>
    ),
  },
  {
    label: 'Founder',
    content: (
      <div style={{ maxWidth: 900, margin: '0 auto', color: '#22543d', fontSize: 18, lineHeight: 1.7, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ color: '#5a67d8', fontWeight: 700 }}>Our Founder & Chief Curator</h3>
        <img src="/founder.webp" alt="Dr. Jyoti Bajaj" style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover', border: '4px solid #5a67d8', margin: '18px 0', boxShadow: '0 2px 12px #5a67d822' }} />
        <p><b>Dr. Jyoti Bajaj</b> is the Founder and Chief Curator of MieT. She is a compassionate professional with over 15 years of dedicated service in Physiotherapy, Special Education, and Counselling. Dr. Bajaj has led special education, inclusion and counselling in institutions like St Mary&apos;s School, Venkateshwar Global School, Delhi Public School (Rohini/ Gurgaon). She is deeply committed to supporting children with special needs, helping them thrive physically, academically, and emotionally.</p>
        <p>Her extensive background in physiotherapy enables her to provide specialized care and rehabilitation for children, enhancing their physical well-being and mobility. As a special educator, she understands the unique learning needs and challenges faced by individuals with special needs and thus tailors programmes to ensure their success. Her skills as a counsellor allow her to offer empathetic and effective support, addressing the emotional and mental health needs of individuals and their families.</p>
        <p>Dr. Bajaj is a Gold Medalist in Special Education from Delhi University, Gold Medallist in Physiotherapy from Kurukshetra University and distinction holder in Guidance and Counselling.</p>
        <a href="mailto:info@miet.life" style={{ color: '#5a67d8', fontWeight: 600, textDecoration: 'underline', marginTop: 12, display: 'inline-block' }}>Write to us</a>
      </div>
    ),
  },
  {
    label: 'Team',
    content: (
      <div
        style={{
          maxWidth: 'min(1200px, 96vw)',
          margin: '0 auto',
          color: '#22543d',
          fontSize: 18,
          lineHeight: 1.7,
          display: 'flex',
          flexDirection: 'row',
          gap: 40,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/team.webp" alt="MieT Team" style={{ width: '100%', maxWidth: 480, borderRadius: 16, margin: '18px 0', boxShadow: '0 2px 12px #5a67d822' }} />
        </div>
        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ color: '#5a67d8', fontWeight: 700 }}>Our Team</h3>
          <p>Our team includes special education teachers, Occupational Therapists, Speech Therapists, Behavior analysts, and other professionals, all with a passion for helping children with special needs. We believe in ongoing professional development to ensure that our team stays up-to-date with the latest research and best practices.</p>
          <a href="https://miet.life/meet-our-team" target="_blank" rel="noopener noreferrer" style={{ color: '#5a67d8', fontWeight: 600, textDecoration: 'underline', marginTop: 12, display: 'inline-block' }}>Meet Our Team</a>
        </div>
      </div>
    ),
  },
  {
    label: 'Programmes',
    content: (
      <div
        style={{
          maxWidth: 'min(1200px, 96vw)',
          margin: '0 auto',
          color: '#22543d',
          fontSize: 18,
          lineHeight: 1.7,
          display: 'flex',
          flexDirection: 'row',
          gap: 40,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/programmes.webp" alt="MieT Programmes" style={{ width: '100%', maxWidth: 480, borderRadius: 16, margin: '18px 0', boxShadow: '0 2px 12px #5a67d822' }} />
        </div>
        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ color: '#5a67d8', fontWeight: 700 }}>Our Programmes</h3>
          <h4 style={{ color: '#22543d', fontWeight: 700, marginTop: 18 }}>Special Education</h4>
          <p>We offer a comprehensive range of <b>special education</b> programmes in <b>Gurgaon</b>, including early intervention, preschool, elementary, middle, and high school programmes, as well as special needs education, counselling services, and transition services. Each programme is designed to meet the unique needs of every child, supporting their mental health and developmental goals while helping them reach their full potential through individualized care and learning.</p>
          <h4 style={{ color: '#22543d', fontWeight: 700, marginTop: 18 }}>Mental Health</h4>
          <p>At MieT, we take a <b>holistic approach to mental health</b>, focusing on <b>mental health counselling services</b> in <b>Gurgaon</b> to address diverse challenges. We design tailored intervention plans that are consistently monitored to ensure progress in achieving developmental milestones. Our motto is to promote <b>self-reliance, social inclusion</b>, and empowerment for individuals with diverse abilities, supporting their journey toward better mental health and overall well-being.</p>
        </div>
      </div>
    ),
  },
];

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section
      className="about-section"
      style={{
        padding: '0 2rem',
        textAlign: 'center'
      }}
      aria-label="About us"
    >
      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          padding: '0 1rem'
        }}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            style={{
              background: activeTab === idx ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.9)',
              color: activeTab === idx ? '#ffffff' : '#1e1b4b',
              border: activeTab === idx ? 'none' : '2px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '15px',
              padding: '1rem 2rem',
              fontWeight: '700',
              fontSize: 'clamp(0.9rem, 1.1vw, 1.1rem)',
              cursor: 'pointer',
              boxShadow: activeTab === idx ? '0 8px 25px rgba(99, 102, 241, 0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              outline: 'none',
              backdropFilter: 'blur(10px)',
              minWidth: '120px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== idx) {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== idx) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }
            }}
            aria-selected={activeTab === idx}
            aria-controls={`about-tabpanel-${idx}`}
            id={`about-tab-${idx}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        id={`about-tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`about-tab-${activeTab}`}
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'left',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          padding: '3rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          transition: 'all 0.3s ease'
        }}
      >
        {tabs[activeTab].content}
      </div>

      {/* Mobile Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Mobile styles for About section */
          @media (max-width: 768px) {
            .about-section {
              padding: 0 1rem !important;
            }

            .about-section [role="tabpanel"] {
              padding: 2rem 1.5rem !important;
            }

            /* Reorder image container on mobile */
            .about-image-container {
              order: -1 !important;
              margin-bottom: 1.5rem !important;
            }

            /* Ensure image is at the top */
            .miet-hero-image {
              order: -1 !important;
              margin-bottom: 1rem !important;
            }

            /* Adjust container layout for mobile */
            .about-image-container {
              flex-direction: column !important;
              gap: 1rem !important;
            }

            /* Make image heights consistent across tabs on mobile */
            .miet-hero-image {
              height: 280px !important;
              object-fit: cover !important;
            }

            /* Target images in other tabs to match Team tab height */
            .about-section img[src="/programmes.webp"] {
              height: 280px !important;
              object-fit: cover !important;
            }
          }

          @media (max-width: 480px) {
            .about-section [role="tabpanel"] {
              padding: 1.5rem 1rem !important;
            }

            .about-image-container {
              margin-bottom: 1rem !important;
              gap: 0.75rem !important;
            }

            .miet-hero-image {
              margin-bottom: 0.75rem !important;
            }

            /* Further optimize image heights for small screens */
            .miet-hero-image {
              height: 240px !important;
              object-fit: cover !important;
            }

            .about-section img[src="/programmes.webp"] {
              height: 240px !important;
              object-fit: cover !important;
            }

            .about-section img[src="/team.webp"] {
              height: 240px !important;
              object-fit: cover !important;
            }
          }

          /* Ensure consistent image heights across all screen sizes on mobile */
          @media (max-width: 768px) {
            .about-section img[src="/team.webp"] {
              height: 280px !important;
              object-fit: cover !important;
            }
          }
        `
      }} />
    </section>
  );
}
