'use client';

import React, { useEffect, useState } from 'react';
import { categories } from '../../components/marketplaceData';
import Link from 'next/link';
import TopBar from '../../components/TopBar';
import Footer from '../../components/Footer';
import Image from 'next/image';

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

export default function MarketplacePage() {
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

  const getCategoryCount = (category: string) => {
    return products.filter(item => {
      const itemType = item.type || item.product_type;
      return itemType?.toLowerCase() === category.toLowerCase();
    }).length;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Course': '📚',
      'E-book': '📖',
      'App': '📱',
      'Gadget': '🔧'
    };
    return icons[category] || '📋';
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured).slice(0, 6);
  };

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
      <>
        <TopBar />
        <section style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', minHeight: '100vh' }} aria-label="Marketplace">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <div style={{ fontSize: '18px', color: '#666' }}>Loading marketplace...</div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <section style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', minHeight: '100vh' }} aria-label="Marketplace">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto 32px', padding: '0 20px' }}>
          <div>
            <h2 style={{ fontFamily: 'Righteous, cursive', color: '#5a67d8', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Marketplace</h2>
            <p style={{ color: '#666', fontSize: 18, maxWidth: 600 }}>
              Discover comprehensive resources for special education, therapy, and inclusive learning
            </p>
          </div>
          <button
            onClick={fetchProducts}
            style={{
              background: '#5a67d8',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔄 Refresh
          </button>
        </div>

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
          {getFeaturedProducts().length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              {getFeaturedProducts().map(product => (
                <div key={product.id} style={{
                  background: 'var(--muted)',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <Image
                    src={getProductImage(product)}
                    alt={getProductDisplayName(product)}
                    width={400}
                    height={120}
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
                    priority
                  />
                  <h4 style={{ color: '#22543d', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{getProductDisplayName(product)}</h4>
                  <p style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>{product.description}</p>
                  {product.price && (
                    <div style={{ color: '#5a67d8', fontWeight: 700, fontSize: 16 }}>₹{product.price}</div>
                  )}
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
          ) : (
            <div style={{ textAlign: 'center', color: '#666', fontSize: '16' }}>
              No featured products available yet. Check back soon!
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
