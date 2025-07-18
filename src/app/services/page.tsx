"use client";
import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Link from 'next/link';

const serviceCards = [
  {
    key: 'appointments',
    title: 'Appointments',
    description: 'Book one-on-one sessions with our expert consultants for personalized support in special education, mental health, and therapy.',
    features: [
      'Consultation: Online or offline sessions for assessment, guidance, and planning.',
      'Therapy: Specialized therapy sessions (Speech, Occupational, Behavioral, etc.) available online or at our centers.',
      'Choose your consultant, select an available slot, and book your appointment.',
      'Online sessions via secure video call; offline sessions at our accessible centers.'
    ],
    cta: 'Book Appointment',
    ctaLink: '/consultants',
    color: '#5a67d8',
  },
  {
    key: 'subscriptions',
    title: 'Subscriptions',
    description: 'Flexible monthly or yearly plans for ongoing support, learning, and progress tracking.',
    features: [
      'Online: Access regular sessions, resources, and progress tracking from home.',
      'Offline: Attend sessions at our centers, with personalized plans and in-person support.',
      'Discounted rates for long-term engagement.',
      'Set your own start and end dates.'
    ],
    cta: 'Subscribe Now',
    ctaLink: '/contact',
    color: '#22543d',
  },
  {
    key: 'events',
    title: 'Events',
    description: 'Join our workshops, webinars, and community events to learn, connect, and grow.',
    features: [
      'Online: Participate from anywhere via Google Meet or other platforms.',
      'Offline: Attend in-person at our centers, with full accessibility and support.',
      'Browse upcoming events and register to secure your spot.'
    ],
    cta: 'View Events',
    ctaLink: '/contact',
    color: '#e53e3e',
  },
  {
    key: 'tests',
    title: 'Tests',
    description: 'Assessments and tests to help you understand needs and track progress.',
    features: [
      'Online: Take assessments from home with instant results and recommendations.',
      'Offline: Comprehensive evaluations conducted at our centers by professionals.',
      'Receive a detailed report and recommendations.'
    ],
    cta: 'Take a Test',
    ctaLink: '/contact',
    color: '#38a169',
  },
];

export default function ServicesPage() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const subscriptionPlans = [
    {
      key: 'basic',
      name: 'Basic',
      monthly: 999,
      yearly: 9999,
      features: ['2 sessions/month', 'Access to online resources', 'Email support'],
    },
    {
      key: 'standard',
      name: 'Standard',
      monthly: 1799,
      yearly: 17999,
      features: ['4 sessions/month', 'Priority booking', 'Progress tracking', 'Chat support'],
    },
    {
      key: 'premium',
      name: 'Premium',
      monthly: 2999,
      yearly: 29999,
      features: ['8 sessions/month', 'Dedicated consultant', 'Personalized plans', 'Phone & chat support'],
    },
  ];

  return (
    <>
      <TopBar />
      <main style={{ background: '#f7fafc', minHeight: '80vh', padding: '2.5rem 0' }}>
        <section style={{ maxWidth: 1100, margin: '0 auto', background: 'none', borderRadius: 16, padding: 0 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#22543d', marginBottom: 18, textAlign: 'center' }}>Our Services</h1>
          <p style={{ fontSize: 20, color: '#5a67d8', marginBottom: 32, textAlign: 'center' }}>
            Explore our comprehensive range of services designed to support individuals and families in Special Education, Mental Health, and Inclusive Growth.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
            {serviceCards.map(card => (
              <div key={card.key} style={{ flex: '1 1 320px', minWidth: 320, maxWidth: 420, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e2e8f0', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderTop: `6px solid ${card.color}` }}>
                <h2 style={{ fontSize: 26, color: card.color, fontWeight: 800, marginBottom: 10 }}>{card.title}</h2>
                <p style={{ color: '#444', fontSize: 17, marginBottom: 14 }}>{card.description}</p>
                <ul style={{ color: '#22543d', fontSize: 16, marginBottom: 18, paddingLeft: 18 }}>
                  {card.features.map((f, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{f}</li>
                  ))}
                </ul>
                {card.key === 'subscriptions' ? (
                  <button onClick={() => setShowSubscriptionModal(true)} style={{ marginTop: 'auto', background: card.color, color: '#fff', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 18, textDecoration: 'none', boxShadow: '0 2px 12px #5a67d822', transition: 'background 0.2s', display: 'inline-block', border: 'none', cursor: 'pointer' }}>
                    {card.cta}
                  </button>
                ) : card.key === 'events' ? (
                  <a href="/events" style={{ marginTop: 'auto', background: card.color, color: '#fff', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 18, textDecoration: 'none', boxShadow: '0 2px 12px #5a67d822', transition: 'background 0.2s', display: 'inline-block' }}>
                    {card.cta}
                  </a>
                ) : card.key === 'tests' ? (
                  <Link href="/#test-section" style={{ marginTop: 'auto', background: card.color, color: '#fff', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 18, textDecoration: 'none', boxShadow: '0 2px 12px #5a67d822', transition: 'background 0.2s', display: 'inline-block' }}>
                    {card.cta}
                  </Link>
                ) : (
                  <a href={card.ctaLink} style={{ marginTop: 'auto', background: card.color, color: '#fff', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 18, textDecoration: 'none', boxShadow: '0 2px 12px #5a67d822', transition: 'background 0.2s', display: 'inline-block' }}>
                    {card.cta}
                  </a>
                )}
              </div>
            ))}
          </div>
          <div style={{ color: '#22543d', fontSize: 18, marginTop: 48, textAlign: 'center', fontWeight: 600 }}>
            Have questions? <a href="/contact" style={{ color: '#5a67d8', textDecoration: 'underline' }}>Contact us</a> to learn more or get personalized guidance.
          </div>
        </section>
        {/* Subscription Modal */}
        {showSubscriptionModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,37,77,0.45)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { if (e.target === e.currentTarget) setShowSubscriptionModal(false); }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #5a67d855', padding: '2.5rem 2rem 2rem 2rem', minWidth: 340, maxWidth: 420, position: 'relative', outline: 'none' }}>
              <button aria-label="Close modal" onClick={() => setShowSubscriptionModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 26, color: '#5a67d8', cursor: 'pointer' }}>×</button>
              <h2 style={{ color: '#22543d', fontWeight: 700, fontSize: 26, marginBottom: 18, textAlign: 'center' }}>Choose Your Subscription</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
                {subscriptionPlans.map(plan => (
                  <button key={plan.key} onClick={() => setActiveTab(plan.key as 'basic' | 'standard' | 'premium')} style={{ background: activeTab === plan.key ? '#5a67d8' : '#e2e8f0', color: activeTab === plan.key ? '#fff' : '#22543d', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 17, cursor: 'pointer', transition: 'background 0.2s' }}>{plan.name}</button>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 18 }}>
                <button onClick={() => setBilling('monthly')} style={{ background: billing === 'monthly' ? '#22543d' : '#e2e8f0', color: billing === 'monthly' ? '#fff' : '#22543d', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}>Monthly</button>
                <button onClick={() => setBilling('yearly')} style={{ background: billing === 'yearly' ? '#22543d' : '#e2e8f0', color: billing === 'yearly' ? '#fff' : '#22543d', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}>Yearly</button>
              </div>
              {subscriptionPlans.filter(p => p.key === activeTab).map(plan => (
                <div key={plan.key} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#22543d', marginBottom: 8 }}>
                    ₹{billing === 'monthly' ? plan.monthly : plan.yearly} <span style={{ fontSize: 18, color: '#5a67d8', fontWeight: 600 }}>/ {billing}</span>
                  </div>
                  <ul style={{ color: '#22543d', fontSize: 16, marginBottom: 18, paddingLeft: 18, textAlign: 'left' }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>{f}</li>
                    ))}
                  </ul>
                  <button style={{ background: '#5a67d8', color: '#fff', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer', marginTop: 8 }}>Proceed to Payment</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
