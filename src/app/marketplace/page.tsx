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
      setLoading(true);
      
      // Debug environment variable
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      console.log('🔧 Marketplace - Backend URL:', backendUrl);
      
      if (!backendUrl) {
        throw new Error('Backend URL not configured. Please check your environment variables.');
      }
      
      // Fetch products with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${backendUrl}/api/products`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Marketplace - Raw backend data:', data);
        
        const productsArray = data.products || data;
        console.log('📦 Marketplace - Products array:', productsArray);
        console.log('📦 Marketplace - Products array length:', productsArray.length);
        
        // Only show active products
        const activeProducts = productsArray.filter((p: Product) => p.status === 'active');
        console.log('✅ Marketplace - Active products found:', activeProducts.length);
        console.log('✅ Marketplace - Active products data:', activeProducts);
        
        setProducts(activeProducts);
      } else {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Marketplace - Error fetching products:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('❌ Marketplace - Request timed out');
        } else {
          console.error(`❌ Marketplace - Error: ${error.message}`);
        }
      }
      
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '24px', color: '#5a67d8', fontWeight: '600' }}>Loading Marketplace...</div>
            <div style={{ fontSize: '16px', color: '#666' }}>Fetching products from backend...</div>
            <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #5a67d8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
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
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48' }}>
            <div>
              <h1 style={{ fontFamily: 'Righteous, cursive', color: '#5a67d8', fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Marketplace</h1>
              <p style={{ color: '#666', fontSize: 18, marginBottom: 0 }}>
                Discover amazing courses, e-books, apps, and gadgets
              </p>
            </div>
            <Link 
              href="/cart"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#8b5cf6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              🛒 View Cart
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 320px))', gap: 24, maxWidth: 1200, margin: '0 auto', padding: '0 20px', justifyContent: 'center' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 300px))', gap: 20, justifyContent: 'center' }}>
              {getFeaturedProducts().map(product => (
                <Link
                  key={product.id}
                  href={`/courses/${product.id}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div style={{
                    background: 'var(--muted)',
                    borderRadius: 12,
                    padding: 20,
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                  >
                    <Image
                      src={getProductImage(product)}
                      alt={getProductDisplayName(product)}
                      width={400}
                      height={120}
                      style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
                      priority
                    />
                    <h4 style={{ color: '#22543d', fontWeight: '600', fontSize: '16', marginBottom: '4' }}>{getProductDisplayName(product)}</h4>
                    <p style={{ color: '#666', fontSize: '14', marginBottom: '8' }}>{product.description}</p>
                    {product.price && (
                      <div style={{ color: '#5a67d8', fontWeight: '700', fontSize: '16' }}>₹{product.price}</div>
                    )}
                    <div style={{
                      background: '#5a67d8',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6',
                      fontSize: '12',
                      fontWeight: '600',
                      display: 'inline-block',
                      marginTop: '8'
                    }}>
                      View Details
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '1rem' }}>No featured products available at the moment.</p>
              <p style={{ fontSize: '16px', color: '#999' }}>Check back soon for new featured items!</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
