"use client";
import React, { useState } from 'react';
import TopBar from '../../components/TopBar';
import Footer from '../../components/Footer';
import { marketplaceItems, categories } from '../../components/marketplaceData';

// Define the type for marketplace items
type MarketplaceItem = {
  id: number;
  category: string;
  title: string;
  image: string;
  desc: string;
  price: string;
  type?: string; // optional, for one-time/monthly/yearly etc
};

const FILTERS = [
  { label: 'All', value: '' },
  ...categories.map(cat => ({ label: cat, value: cat }))
];

const typeFilters = [
  { label: 'All Types', value: '' },
  { label: 'One Time', value: 'one-time' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];

type SidebarProps = {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
};

function Sidebar({ selectedCategory, setSelectedCategory, selectedType, setSelectedType }: SidebarProps) {
  return (
    <aside style={{ minWidth: 220, background: '#f7fafc', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px #e2e8f0', height: 'fit-content', marginTop: 24 }}>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18, color: '#22543d' }}>Filters</h3>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Category</div>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setSelectedCategory(f.value)}
            style={{
              display: 'block',
              background: selectedCategory === f.value ? '#22543d' : 'transparent',
              color: selectedCategory === f.value ? '#fff' : '#22543d',
              border: 'none',
              borderRadius: 6,
              padding: '8px 12px',
              marginBottom: 6,
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              transition: 'background 0.2s',
            }}
            aria-pressed={selectedCategory === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Type</div>
        {typeFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setSelectedType(f.value)}
            style={{
              display: 'block',
              background: selectedType === f.value ? '#22543d' : 'transparent',
              color: selectedType === f.value ? '#fff' : '#22543d',
              border: 'none',
              borderRadius: 6,
              padding: '8px 12px',
              marginBottom: 6,
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              transition: 'background 0.2s',
            }}
            aria-pressed={selectedType === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

function CourseCard({ item }: { item: MarketplaceItem }) {
  return (
    <div style={{ width: 260, background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 18, marginBottom: 24 }}>
      <img src={item.image} alt={item.title} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: 14 }} />
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6, color: '#22543d' }}>{item.title}</div>
      <div style={{ color: '#555', fontWeight: 400, fontSize: 15, marginBottom: 10 }}>{item.desc}</div>
      <div style={{ color: '#5a67d8', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{item.price}</div>
      <button style={{ background: '#22543d', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 'auto' }}>Buy Now</button>
    </div>
  );
}

function ConsultationCard({ item }: { item: MarketplaceItem }) {
  return (
    <div style={{ display: 'flex', background: '#f0fff4', borderRadius: 14, boxShadow: '0 2px 12px #c6f6d5', alignItems: 'center', padding: 18, marginBottom: 24, minWidth: 400, maxWidth: 600 }}>
      <img src={item.image} alt={item.title} style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: 14, marginRight: 24 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6, color: '#22543d' }}>{item.title}</div>
        <div style={{ color: '#555', fontWeight: 400, fontSize: 15, marginBottom: 10 }}>{item.desc}</div>
        <div style={{ color: '#38a169', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{item.price}</div>
        <button style={{ background: '#38a169', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Book Now</button>
      </div>
    </div>
  );
}

function BookCard({ item }: { item: MarketplaceItem }) {
  return (
    <div style={{ width: 220, background: '#f7fafc', borderRadius: 14, boxShadow: '0 2px 12px #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16, marginBottom: 24 }}>
      <img src={item.image} alt={item.title} style={{ width: 80, height: 110, objectFit: 'cover', borderRadius: 8, marginBottom: 10, boxShadow: '0 1px 6px #b2f5ea' }} />
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: '#22543d' }}>{item.title}</div>
      <div style={{ color: '#555', fontWeight: 400, fontSize: 14, marginBottom: 8 }}>{item.desc}</div>
      <div style={{ color: '#d69e2e', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{item.price}</div>
      <button style={{ background: '#d69e2e', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Buy Book</button>
    </div>
  );
}

function ProductCard({ item }: { item: MarketplaceItem }) {
  return (
    <div style={{ width: 220, background: '#fff5f7', borderRadius: 14, boxShadow: '0 2px 12px #fed7e2', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16, marginBottom: 24 }}>
      <img src={item.image} alt={item.title} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12, marginBottom: 10, boxShadow: '0 1px 6px #fbb6ce' }} />
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: '#b83280' }}>{item.title}</div>
      <div style={{ color: '#555', fontWeight: 400, fontSize: 14, marginBottom: 8 }}>{item.desc}</div>
      <div style={{ color: '#b83280', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{item.price}</div>
      <button style={{ background: '#b83280', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Buy Product</button>
    </div>
  );
}

function getCardComponent(item: MarketplaceItem) {
  if (item.category === 'Courses') return CourseCard;
  if (item.category === 'Consultations') return ConsultationCard;
  if (item.category === 'Books') return BookCard;
  if (item.category === 'Products') return ProductCard;
  // fallback
  return CourseCard;
}

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  // Filter logic (extend as needed)
  const filtered = (marketplaceItems as MarketplaceItem[]).filter(item =>
    (!selectedCategory || item.category === selectedCategory) &&
    (!selectedType || (item.type && item.type === selectedType))
  );

  return (
    <>
      <TopBar />
      <div style={{ display: 'flex', maxWidth: 1300, margin: '0 auto', padding: '32px 0 48px 0', gap: 36, minHeight: 600 }}>
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
        <main style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontFamily: 'Righteous, cursive', color: '#22543d', fontSize: 32, fontWeight: 800, marginBottom: 18 }}>Marketplace</h1>
          <div style={{ color: '#555', fontSize: 18, marginBottom: 32 }}>Explore our curated selection of courses, consultation packages, books, and products.</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {filtered.length === 0 ? (
              <div style={{ color: '#e53e3e', fontWeight: 600, fontSize: 18 }}>No items found.</div>
            ) : filtered.map(item => {
              const Card = getCardComponent(item);
              return <Card key={item.id} item={item} />;
            })}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
