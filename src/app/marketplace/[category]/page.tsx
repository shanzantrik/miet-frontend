'use client';

import React, { useEffect, useState, use } from 'react';
import { categories } from '../../../components/marketplaceData';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import TopBar from '../../../components/TopBar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { useCart } from '../../../components/CartContext';
import { useCallback } from 'react';

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

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryParam } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: number]: boolean }>({});
  const { addToCart, isInCart, removeFromCart } = useCart();

  // Convert URL format back to category name
  const categoryName = categoryParam
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Find the exact category match
  const category = categories.find(cat => 
    cat.toLowerCase().replace(/\s+/g, '-') === categoryParam ||
    cat.toLowerCase() === categoryName.toLowerCase()
  );

  const fetchProducts = useCallback(async () => {
    if (!category) return;
    
    try {
      setLoading(true);
      
      // Debug environment variable
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      console.log(`🔧 ${category} Category - Backend URL:`, backendUrl);
      
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
        console.log(`📊 ${category} Category - Raw backend data:`, data);
        
        const productsArray = data.products || data;
        console.log(`📦 ${category} Category - Products array:`, productsArray);
        console.log(`📦 ${category} Category - Products array length:`, productsArray.length);
        
        // Filter by category and only show active products
        const categoryProducts = productsArray.filter((product: Product) => {
          const productType = product.type || product.product_type;
          const isActive = product.status === 'active';
          const matchesCategory = productType?.toLowerCase() === category.toLowerCase();
          console.log(`🔍 ${category} Category - Product: ${product.title || product.name}, Type: ${productType}, Active: ${isActive}, Category Match: ${matchesCategory}`);
          return isActive && matchesCategory;
        });
        
        console.log(`✅ ${category} Category - Category products found:`, categoryProducts.length);
        console.log(`✅ ${category} Category - Category products data:`, categoryProducts);
        
        setProducts(categoryProducts);
      } else {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ ${category} Category - Error fetching products:`, error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`❌ ${category} Category - Request timed out`);
        } else {
          console.error(`❌ ${category} Category - Error: ${error.message}`);
        }
      }
      
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [fetchProducts]);

  if (!category) return notFound();

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

  // Helper function to truncate description to 2-3 lines
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Helper function to toggle description expansion
  const toggleDescription = (productId: number) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <section style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', minHeight: '100vh' }} aria-label={`${category} Marketplace`}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '24px', color: '#5a67d8', fontWeight: '600' }}>Loading {category} Products...</div>
            <div style={{ fontSize: '16px', color: '#666' }}>Fetching {category.toLowerCase()} from backend...</div>
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
      <section style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', minHeight: '100vh' }} aria-label={`${category} Marketplace`}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32' }}>
            <div>
              <h2 style={{ fontFamily: 'Righteous, cursive', color: '#5a67d8', fontSize: '28', fontWeight: '700', marginBottom: '12' }}>{category}</h2>
              <p style={{ color: '#666', fontSize: '18', marginBottom: '0' }}>
                {products.length} {products.length === 1 ? 'item' : 'items'} available in {category}
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
          
          {products.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 350px))', gap: 24, justifyContent: 'center' }}>
              {products.map(product => (
                <div key={product.id} style={{ 
                  background: 'var(--muted)', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  textAlign: 'center', 
                  boxShadow: '0 2px 12px var(--accent-20)', 
                  transition: 'transform 0.2s, box-shadow 0.2s', 
                  border: '2px solid transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '500px'
                }}>
                  <a href={`/courses/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', flex: '1' }}>
                    <img 
                      alt={getProductDisplayName(product)} 
                      loading="lazy" 
                      width={400} 
                      height={160} 
                      decoding="async" 
                      data-nimg="1" 
                      srcSet={product.thumbnail ? `${getProductImage(product)}?w=640&q=75 1x, ${getProductImage(product)}?w=828&q=75 2x` : ''} 
                      src={getProductImage(product)} 
                      style={{ 
                        color: 'transparent', 
                        width: '100%', 
                        height: '160px', 
                        objectFit: 'cover', 
                        borderRadius: '12px', 
                        marginBottom: '16px', 
                        cursor: 'pointer' 
                      }} 
                    />
                    <h3 style={{ color: '#22543d', fontWeight: '700', fontSize: '18', marginBottom: '8', cursor: 'pointer' }}>
                      {getProductDisplayName(product)}
                    </h3>
                    <div style={{ color: '#666', fontSize: '14', marginBottom: '12', lineHeight: '1.4', flex: '1' }}>
                      <p style={{ margin: 0, marginBottom: '8px' }}>
                        {expandedDescriptions[product.id] 
                          ? product.description 
                          : truncateDescription(product.description)
                        }
                      </p>
                      {product.description.length > 150 && (
                        <span style={{ color: '#5a67d8', fontWeight: '600', fontSize: '14px' }}>
                          Read more...
                        </span>
                      )}
                    </div>
                  </a>
                  <div style={{ color: '#5a67d8', fontWeight: '700', marginBottom: '16px' }}>
                    ₹{product.price}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: 'auto' }}>
                    <a 
                      href={`/courses/${product.id}`} 
                      style={{ 
                        background: 'linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)', 
                        color: 'rgb(255, 255, 255)', 
                        padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', 
                        fontWeight: '600', 
                        textDecoration: 'none', 
                        display: 'inline-block', 
                        cursor: 'pointer', 
                        flex: '1 1 0%', 
                        textAlign: 'center',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                        transition: '0.3s',
                        boxShadow: 'rgba(99, 102, 241, 0.3) 0px 4px 15px',
                        minWidth: 'clamp(80px, 20vw, 100px)',
                        minHeight: 'clamp(36px, 8vw, 44px)',
                        transform: 'translateY(0px)'
                      }}
                    >
                      View Details
                    </a>
                    <button 
                      onClick={() => addToCart({
                        id: product.id,
                        title: getProductDisplayName(product),
                        price: product.price || '0',
                        thumbnail: product.thumbnail,
                        instructor_name: undefined,
                        type: product.type || product.product_type || 'Unknown'
                      })}
                      style={{ 
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                        color: 'rgb(255, 255, 255)', 
                        padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', 
                        fontWeight: '600', 
                        border: 'none', 
                        cursor: 'pointer', 
                        flex: '1 1 0%',
                        borderRadius: '12px',
                        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                        transition: '0.3s',
                        boxShadow: 'rgba(239, 68, 68, 0.3) 0px 4px 15px',
                        minWidth: 'clamp(80px, 20vw, 100px)',
                        minHeight: 'clamp(36px, 8vw, 44px)',
                        transform: 'translateY(0px)'
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
              <h3 style={{ color: '#666', fontSize: 20, marginBottom: 8 }}>No items found</h3>
              <p style={{ color: '#888', fontSize: 16 }}>We're working on adding more {category.toLowerCase()} items. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
} 