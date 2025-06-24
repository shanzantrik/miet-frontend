'use client';
import React from 'react';
import { consultants } from '../../components/consultantsData';
import Link from 'next/link';
import TopBar from '../../components/TopBar';
import Footer from '../../components/Footer';

export default function ConsultantsPage() {
  return (
    <>
      <TopBar />
      <section style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center' }} aria-label="All Consultants">
        <h2 style={{ fontFamily: 'Righteous, cursive', color: '#5a67d8', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>All Consultants</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          {consultants.map(consultant => (
            <div key={consultant.id} style={{ width: 260, background: 'var(--muted)', borderRadius: 14, boxShadow: '0 2px 12px var(--accent-20)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 18 }}>
              <img src={consultant.image} alt={consultant.name} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid #5a67d8', marginBottom: 12 }} />
              <div style={{ fontWeight: 700, color: '#22543d', fontSize: 18 }}>{consultant.name}</div>
              <div style={{ color: '#5a67d8', fontSize: 15, fontWeight: 600 }}>{consultant.expertise}</div>
              <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>{consultant.city} &middot; <span style={{ color: consultant.mode === 'Online' ? '#39e639' : '#22543d', fontWeight: 600 }}>{consultant.mode}</span></div>
              <Link href={`/consultants/${consultant.id}`} style={{ marginTop: 10, background: 'var(--accent)', color: 'var(--text-on-accent)', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>View Profile</Link>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
} 