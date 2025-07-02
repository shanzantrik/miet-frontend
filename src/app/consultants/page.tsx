'use client';
import React, { useState, useMemo } from 'react';
import { consultants } from '../../components/consultantsData';
import Link from 'next/link';
import TopBar from '../../components/TopBar';
import Footer from '../../components/Footer';
import Image from 'next/image';

const PAGE_SIZE = 4;

export default function ConsultantsPage() {
  // Filter states
  const [city, setCity] = useState('');
  const [expertise, setExpertise] = useState('');
  const [mode, setMode] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Unique filter options
  const cities = useMemo(() => Array.from(new Set(consultants.map(c => c.city))), []);
  const expertises = useMemo(() => Array.from(new Set(consultants.map(c => c.expertise))), []);
  const modes = useMemo(() => Array.from(new Set(consultants.map(c => c.mode))), []);

  // Filtered consultants
  const filtered = useMemo(() => {
    return consultants.filter(c =>
      (!city || c.city === city) &&
      (!expertise || c.expertise === expertise) &&
      (!mode || c.mode === mode) &&
      (!search || c.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [city, expertise, mode, search]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 on filter/search change
  React.useEffect(() => { setPage(1); }, [city, expertise, mode, search]);

  return (
    <>
      <TopBar />
      <section style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center' }} aria-label="All Consultants">
        <h2 style={{ fontFamily: 'Righteous, cursive', color: '#5a67d8', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>All Consultants</h2>
        {/* Filters and Search */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
          <select value={city} onChange={e => setCity(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={expertise} onChange={e => setExpertise(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
            <option value="">All Categories</option>
            {expertises.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={mode} onChange={e => setMode(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
            <option value="">All Modes</option>
            {modes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name..."
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }}
          />
          <button onClick={() => setPage(1)} style={{ padding: '8px 18px', borderRadius: 6, background: '#5a67d8', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Search</button>
        </div>
        {/* Consultant Cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          {paginated.length === 0 ? (
            <div style={{ color: '#e53e3e', fontWeight: 600, fontSize: 18 }}>No consultants found.</div>
          ) : paginated.map(consultant => (
            <div key={consultant.id} style={{ width: 260, background: 'var(--muted)', borderRadius: 14, boxShadow: '0 2px 12px var(--accent-20)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 18 }}>
              <Image src={consultant.image} alt={consultant.name} width={90} height={90} style={{ borderRadius: '50%', objectFit: 'cover', border: '3px solid #5a67d8', marginBottom: 12 }} />
              <div style={{ fontWeight: 700, color: '#22543d', fontSize: 18 }}>{consultant.name}</div>
              <div style={{ color: '#5a67d8', fontSize: 15, fontWeight: 600 }}>{consultant.expertise}</div>
              <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>{consultant.city} &middot; <span style={{ color: consultant.mode === 'Online' ? '#39e639' : '#22543d', fontWeight: 600 }}>{consultant.mode}</span></div>
              <Link href={`/consultants/${consultant.id}`} style={{ marginTop: 10, background: 'var(--accent)', color: 'var(--text-on-accent)', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>View Profile</Link>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 28 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: 'var(--muted)', color: 'var(--text-secondary)', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 16, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} style={{ background: page === i + 1 ? 'var(--accent)' : 'var(--muted)', color: page === i + 1 ? 'var(--text-on-accent)' : 'var(--text-secondary)', border: '1.5px solid var(--accent)', borderRadius: 6, padding: '6px 12px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{i + 1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ background: 'var(--muted)', color: 'var(--text-secondary)', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 16, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>Next</button>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
