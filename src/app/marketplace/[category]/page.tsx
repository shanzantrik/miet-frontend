'use client';

import React, { useEffect, useState } from 'react';
import { categories } from '../../../components/marketplaceData';
import { notFound } from 'next/navigation';
import TopBar from '../../../components/TopBar';
import Footer from '../../../components/Footer';
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

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        const productsArray = data.products || data;
        // Filter by category and only show active products
        const categoryProducts = productsArray.filter((product: Product) => {
          const productType = product.type || product.product_type;
          return product.status === 'active' && 
                 productType?.toLowerCase() === category.toLowerCase();
        });
        setProducts(categoryProducts);
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <div style={{ fontSize: '18px', color: '#666' }}>Loading {category} products...</div>
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
          <h2 style={{ fontFamily: 'Righteous, cursive', color: '#5a67d8', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>{category}</h2>
          <p style={{ color: '#666', fontSize: 18, marginBottom: 32 }}>
            {products.length} {products.length === 1 ? 'item' : 'items'} available in {category}
          </p>
          
          {products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {products.map(product => (
                <div key={product.id} style={{ 
                  background: 'var(--muted)', 
                  borderRadius: 16, 
                  padding: 24, 
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
                      marginBottom: 16 
                    }} 
                  />
                  <h3 style={{ color: '#22543d', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{getProductDisplayName(product)}</h3>
                  <p style={{ color: '#666', fontSize: 14, marginBottom: 12, lineHeight: 1.4 }}>{product.description}</p>
                  {product.price && (
                    <div style={{ color: '#5a67d8', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>₹{product.price}</div>
                  )}
                  <div style={{ 
                    background: '#5a67d8', 
                    color: 'white', 
                    padding: '10px 20px', 
                    borderRadius: 8, 
                    fontSize: 14, 
                    fontWeight: 600,
                    display: 'inline-block',
                    cursor: 'pointer'
                  }}>
                    Buy Now
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