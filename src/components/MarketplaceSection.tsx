'use client';
import React, { useState } from 'react';
import { marketplaceItems, categories } from './marketplaceData';

const PAGE_SIZE = 5;

export default function MarketplaceSection() {
  const [selectedCategory, setSelectedCategory] = useState('Courses');
  const [page, setPage] = useState(1);

  const filtered = marketplaceItems.filter(item => item.category === selectedCategory);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="marketplace-section" style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center' }} aria-label="Marketplace">
      <h2 style={{ fontFamily: 'Righteous, cursive', color: 'var(--accent)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Marketplace: Courses, Books, Apps, Gadgets, Products <span style={{ color: 'red' }}>and much more…</span>
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setPage(1); }}
            style={{
              background: selectedCategory === cat ? 'var(--accent)' : 'var(--muted)',
              color: selectedCategory === cat ? 'var(--text-on-accent)' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 1.5rem',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: selectedCategory === cat ? '0 2px 12px var(--accent-opacity)' : 'none',
              transition: 'all 0.2s',
            }}
            aria-pressed={selectedCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
        {paginated.map(item => (
          <div key={item.id} style={{ width: 220, minHeight: 320, background: 'var(--muted)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', color: 'var(--text-secondary)', fontWeight: 600, boxShadow: '0 2px 12px var(--accent-opacity)', padding: 18, position: 'relative' }}>
            <img src={item.image} alt={item.title} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12, marginBottom: 14, boxShadow: '0 1px 6px var(--accent-opacity)' }} />
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{item.title}</div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: 15, marginBottom: 10 }}>{item.desc}</div>
            <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{item.price}</div>
            <button style={{ background: 'var(--accent)', color: 'var(--text-on-accent)', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 'auto', boxShadow: '0 1px 6px var(--accent-opacity)' }}>Buy Now</button>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: 'var(--muted)', color: 'var(--text-secondary)', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 16, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{ background: page === i + 1 ? 'var(--accent)' : 'var(--muted)', color: page === i + 1 ? 'var(--text-on-accent)' : 'var(--text-secondary)', border: '1.5px solid var(--accent)', borderRadius: 6, padding: '6px 12px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ background: 'var(--muted)', color: 'var(--text-secondary)', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 16, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>Next</button>
        </div>
      )}
    </section>
  );
}
