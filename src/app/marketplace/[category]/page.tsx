'use client';

import React, { useEffect, useState } from 'react';
import { categories } from '../../../components/marketplaceData';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import TopBar from '../../../components/TopBar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { useCart } from '../../../components/CartContext';

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

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart, removeFromCart } = useCart();

  // Convert URL format back to category name
  const categoryName = params.category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Find the exact category match
  const category = categories.find(cat => 
    cat.toLowerCase().replace(/\s+/g, '-') === params.category ||
    cat.toLowerCase() === categoryName.toLowerCase()
  );

  if (!category) return notFound();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
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
                borderRadius: 16, 
                padding: 24, 
                textAlign: 'center',
                boxShadow: '0 2px 12px var(--accent-20)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '2px solid transparent'
                }}>
                  {/* Clickable course image and title */}
                  <Link 
                    href={`/courses/${product.id}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <Image 
                      src={getProductImage(product)} 
                      alt={getProductDisplayName(product)} 
                      width={400}
                      height={160}
                  style={{ 
                    width: '100%', 
                    height: 160, 
                    objectFit: 'cover', 
                    borderRadius: 12, 
                        marginBottom: 16,
                        cursor: 'pointer'
                      }} 
                    />
                    <h3 style={{ color: '#22543d', fontWeight: '700', fontSize: '18', marginBottom: '8', cursor: 'pointer' }}>
                      {getProductDisplayName(product)}
                    </h3>
                    <p style={{ color: '#666', fontSize: '14', marginBottom: '12', lineHeight: '1.4' }}>
                      {product.description}
                    </p>
                  </Link>
                  
                  {product.price && (
                    <div style={{ color: '#5a67d8', fontWeight: '700', fontSize: '18', marginBottom: '16' }}>₹{product.price}</div>
                  )}
                  
                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <Link 
                      href={`/courses/${product.id}`}
                      style={{
                        background: '#22543d', 
                        color: 'white', 
                        padding: '10px 16px', 
                        borderRadius: '8', 
                        fontSize: '14', 
                        fontWeight: '600',
                        textDecoration: 'none',
                        display: 'inline-block',
                        cursor: 'pointer',
                        flex: 1,
                        textAlign: 'center'
                      }}
                    >
                      View Details
                    </Link>
                    {isInCart(product.id) ? (
                      <button 
                        style={{ 
                          background: '#ef4444', 
                          color: 'white', 
                          padding: '10px 16px', 
                          borderRadius: '8', 
                          fontSize: '14', 
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          flex: 1
                        }}
                        onClick={() => removeFromCart(product.id)}
                      >
                        Remove from Cart
                      </button>
                    ) : (
                      <button 
                        style={{ 
                  background: '#5a67d8', 
                  color: 'white', 
                          padding: '10px 16px', 
                          borderRadius: '8', 
                          fontSize: '14', 
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          flex: 1
                        }}
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            title: getProductDisplayName(product),
                            price: product.price || '0',
                            thumbnail: product.thumbnail,
                            instructor_name: undefined,
                            type: product.type || product.product_type || 'Unknown'
                          });
                          alert('Added to cart!');
                        }}
                      >
                        Add to Cart
                      </button>
                    )}
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