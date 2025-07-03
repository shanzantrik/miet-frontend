'use client';

import React from 'react';
import { categories, marketplaceItems } from '../../components/marketplaceData';
import Link from 'next/link';
import TopBar from '../../components/TopBar';
import Footer from '../../components/Footer';

export default function MarketplacePage() {
  const getCategoryCount = (category: string) => {
    return marketplaceItems.filter(item => item.category === category).length;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Courses': '📚',
      'Books': '📖',
      'Apps': '📱',
      'Gadgets': '🔧',
      'Products': '🛍️',
      'Others': '📦'
    };
    return icons[category] || '📋';
  };

  return (
    <>
      <TopBar />
      <section style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', minHeight: '100vh' }} aria-label="Marketplace">
        <h2 style={{ fontFamily: 'Righteous, cursive', color: '#5a67d8', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Marketplace</h2>
        <p style={{ color: '#666', fontSize: 18, marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
          Discover comprehensive resources for special education, therapy, and inclusive learning
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          {categories.map(category => (
            <Link
              key={category}
              href={`/marketplace/${category.toLowerCase().replace(/\s+/g, '-')}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div style={{
                background: 'var(--muted)',
                borderRadius: 16,
                padding: 32,
                textAlign: 'center',
                boxShadow: '0 2px 12px var(--accent-20)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(90,103,216,0.3)';
                e.currentTarget.style.borderColor = '#5a67d8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(90,103,216,0.2)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>{getCategoryIcon(category)}</div>
                <h3 style={{ color: '#5a67d8', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>{category}</h3>
                <p style={{ color: '#666', fontSize: 16, marginBottom: 12 }}>
                  {getCategoryCount(category)} {getCategoryCount(category) === 1 ? 'item' : 'items'} available
                </p>
                <div style={{
                  background: '#5a67d8',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'inline-block'
                }}>
                  Browse {category}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 48, maxWidth: 1200, margin: '48px auto 0', padding: '0 20px' }}>
          <h3 style={{ color: '#5a67d8', fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Featured Items</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {marketplaceItems.slice(0, 6).map(item => (
              <div key={item.id} style={{
                background: 'var(--muted)',
                borderRadius: 12,
                padding: 20,
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: 120,
                    objectFit: 'cover',
                    borderRadius: 8,
                    marginBottom: 12
                  }}
                />
                <h4 style={{ color: '#22543d', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{item.title}</h4>
                <p style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>{item.desc}</p>
                <div style={{ color: '#5a67d8', fontWeight: 700, fontSize: 16 }}>{item.price}</div>
                <div style={{
                  background: '#5a67d8',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'inline-block',
                  marginTop: 8,
                  cursor: 'pointer'
                }}>
                  View Details
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
