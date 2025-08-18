'use client';
import React, { useState, useEffect } from 'react';
import { categories } from './marketplaceData';

interface Product {
  id: number;
  type: string;
  product_type?: string;
  title?: string;
  name?: string;
  description: string;
  price?: string;
  thumbnail?: string;
  status: 'active' | 'inactive';
  featured?: boolean;
}

const PAGE_SIZE = 5;

export default function MarketplaceSection() {
  const [selectedCategory, setSelectedCategory] = useState('Course');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        const productsArray = data.products || data;
        // Only show active products
        const activeProducts = productsArray.filter((p: Product) => p.status === 'active');
        setProducts(activeProducts);
      } else {
        console.error('Failed to fetch products');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(item => {
    const itemType = item.type || item.product_type;
    return itemType?.toLowerCase() === selectedCategory.toLowerCase();
  });
  
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getProductDisplayName = (product: Product) => {
    return product.title || product.name || 'Untitled Product';
  };

  const getProductImage = (product: Product) => {
    if (product.thumbnail) {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.thumbnail}`;
    }
    // Fallback to a default image
    return 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80';
  };

  if (loading) {
    return (
      <section className="marketplace-section" style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center' }} aria-label="Marketplace">
        <div style={{ fontSize: '18px', color: '#666' }}>Loading marketplace...</div>
      </section>
    );
  }

  return (
    <section className="marketplace-section" style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center' }} aria-label="Marketplace">
      <h2 style={{ fontFamily: 'Righteous, cursive', color: 'var(--accent)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Marketplace: Courses, Books, Apps, Gadgets <span style={{ color: 'red' }}>and much more…</span>
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
      
      {filtered.length > 0 ? (
        <>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            {paginated.map(product => (
              <div key={product.id} style={{ width: 220, minHeight: 320, background: 'var(--muted)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', color: 'var(--text-secondary)', fontWeight: 600, boxShadow: '0 2px 12px var(--accent-opacity)', padding: 18, position: 'relative' }}>
                <img src={getProductImage(product)} alt={getProductDisplayName(product)} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12, marginBottom: 14, boxShadow: '0 1px 6px var(--accent-opacity)' }} />
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{getProductDisplayName(product)}</div>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: 15, marginBottom: 10 }}>{product.description}</div>
                {product.price && (
                  <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>₹{product.price}</div>
                )}
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
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <h3 style={{ color: '#666', fontSize: 20, marginBottom: 8 }}>No products found</h3>
          <p style={{ color: '#888', fontSize: 16 }}>No {selectedCategory.toLowerCase()} products available yet. Check back soon!</p>
        </div>
      )}
    </section>
  );
}
