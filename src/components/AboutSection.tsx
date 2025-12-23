"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function AboutSection() {
  const t = useTranslations('AboutSection');
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: t('tabs.overview'),
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
              {t('overview.title')}
            </h3>
            <p dangerouslySetInnerHTML={{ __html: t.raw('overview.description1') }} />
            <h3 style={{ color: '#5a67d8', fontWeight: 700, marginTop: 32 }}>
              {t('overview.communityTitle')}
            </h3>
            <p>
              {t('overview.communityDescription')}
            </p>
            <h3 style={{ color: '#5a67d8', fontWeight: 700, marginTop: 32 }}>{t('overview.aboutTitle')}</h3>
            <p dangerouslySetInnerHTML={{ __html: t.raw('overview.aboutIntro') }} />
            <p>
              {t('overview.aboutDesc1')}
            </p>
            <p>
              {t('overview.aboutDesc2')}
            </p>
            <p>{t('overview.joinUs')}</p>
            <div style={{ color: '#5a67d8', fontWeight: 600, marginTop: 18 }}>
              {t('overview.tags')}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <img
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
      label: t('tabs.vision'),
      content: (
        <div style={{ maxWidth: 900, margin: '0 auto', color: '#22543d', fontSize: 18, lineHeight: 1.7 }}>
          <h3 style={{ color: '#5a67d8', fontWeight: 700 }}>{t('vision.title')}</h3>
          <p>{t('vision.p1')}</p>
          <p>{t('vision.p2')}</p>
          <p>{t('vision.p3')}</p>
          <div style={{ color: '#5a67d8', fontWeight: 600, marginTop: 18 }}>{t('vision.tags')}</div>
        </div>
      ),
    },
    {
      label: t('tabs.founder'),
      content: (
        <div style={{ maxWidth: 900, margin: '0 auto', color: '#22543d', fontSize: 18, lineHeight: 1.7, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ color: '#5a67d8', fontWeight: 700 }}>{t('founder.title')}</h3>
          <img src="/founder.webp" alt="Dr. Jyoti Bajaj" style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover', border: '4px solid #5a67d8', margin: '18px 0', boxShadow: '0 2px 12px #5a67d822' }} />
          <p dangerouslySetInnerHTML={{ __html: t.raw('founder.p1') }} />
          <p>{t('founder.p2')}</p>
          <p>{t('founder.p3')}</p>
          <a href="mailto:info@miet.life" style={{ color: '#5a67d8', fontWeight: 600, textDecoration: 'underline', marginTop: 12, display: 'inline-block' }}>{t('founder.writeToUs')}</a>
        </div>
      ),
    },
    {
      label: t('tabs.team'),
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
            <h3 style={{ color: '#5a67d8', fontWeight: 700 }}>{t('team.title')}</h3>
            <p>{t('team.description')}</p>
            <a href="https://miet.life/meet-our-team" target="_blank" rel="noopener noreferrer" style={{ color: '#5a67d8', fontWeight: 600, textDecoration: 'underline', marginTop: 12, display: 'inline-block' }}>{t('team.meetTeam')}</a>
          </div>
        </div>
      ),
    },
    {
      label: t('tabs.programmes'),
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
            <h3 style={{ color: '#5a67d8', fontWeight: 700 }}>{t('programmes.title')}</h3>
            <h4 style={{ color: '#22543d', fontWeight: 700, marginTop: 18 }}>{t('programmes.p1Title')}</h4>
            <p dangerouslySetInnerHTML={{ __html: t.raw('programmes.p1Desc') }} />
            <h4 style={{ color: '#22543d', fontWeight: 700, marginTop: 18 }}>{t('programmes.p2Title')}</h4>
            <p dangerouslySetInnerHTML={{ __html: t.raw('programmes.p2Desc') }} />
          </div>
        </div>
      ),
    },
  ];

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
    </section>
  );
}
