'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaStar, FaVideo, FaUsers, FaClock, FaSpinner } from 'react-icons/fa';
import TopBar from '../../components/TopBar';
import Footer from '../../components/Footer';

interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  rating?: number;
  total_ratings?: number;
  enrolled_students?: number;
  duration?: string;
  instructor_name?: string;
  price?: string;
  thumbnail?: string;
  type: string;
  status: string;
  featured?: boolean;
  created_at?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the same pattern as marketplace - fetch all products and filter courses
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Raw backend data:', data);
        
        const productsArray = data.products || data;
        console.log('📦 Products array:', productsArray);
        console.log('📦 Products array length:', productsArray.length);
        
        // Filter only active courses (same logic as marketplace)
        const activeCourses = productsArray.filter((product: any) => {
          const isActive = product.status === 'active';
          const productType = (product.type || product.product_type || '').toLowerCase();
          const isCourse = productType === 'course';
          console.log(`🔍 Product: ${product.title || product.name}, Status: ${product.status}, Type: ${product.type || product.product_type}, Active: ${isActive}, Course: ${isCourse}`);
          return isActive && isCourse;
        });
        
        console.log('✅ Active courses found:', activeCourses.length);
        console.log('✅ Active courses data:', activeCourses);
        
        // Debug: Show all products regardless of filtering
        if (activeCourses.length === 0) {
          console.log('⚠️ No active courses found. Showing all products for debugging:');
          console.log('📋 All products:', productsArray);
          console.log('📋 Products with status:', productsArray.map((p: any) => ({ 
            title: p.title || p.name, 
            status: p.status, 
            type: p.type || p.product_type 
          })));
        }
        
        setCourses(activeCourses);
        
        // Clear any previous errors since we successfully fetched data
        setError(null);
      } else {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
      
    } catch (err) {
      console.error('❌ Error fetching courses:', err);
      
      // Fallback to sample data while backend is being developed
      console.log('🔄 Using fallback sample data');
      const fallbackCourses: Course[] = [
        {
          id: 'time-management-mini-course',
          title: 'A Mini Course on Time Management',
          subtitle: '7 steps you can use immediately to become more productive and master time management',
          description: 'Learn the essential time management techniques that will transform your productivity and help you achieve more in less time.',
          rating: 4.4,
          total_ratings: 47803,
          enrolled_students: 439950,
          duration: '37 min',
          instructor_name: 'Brandon Hakim',
          price: 'Free',
          thumbnail: '/intro.webp',
          type: 'Course',
          status: 'active',
          featured: true
        },
        {
          id: 'productivity-mastery',
          title: 'Productivity Mastery: Complete System',
          subtitle: 'Learn the complete productivity system used by top performers',
          description: 'Master the proven productivity techniques used by successful entrepreneurs and executives worldwide.',
          rating: 4.8,
          total_ratings: 12500,
          enrolled_students: 89000,
          duration: '4.5 hours',
          instructor_name: 'Sarah Johnson',
          price: '$49.99',
          thumbnail: '/programmes.webp',
          type: 'Course',
          status: 'active',
          featured: false
        },
        {
          id: 'mindful-learning',
          title: 'Mindful Learning Strategies',
          subtitle: 'Develop effective learning habits and improve retention',
          description: 'Discover scientifically-proven learning techniques that will help you absorb information faster and retain it longer.',
          rating: 4.6,
          total_ratings: 8900,
          enrolled_students: 67000,
          duration: '3.2 hours',
          instructor_name: 'Dr. Michael Chen',
          price: '$29.99',
          thumbnail: '/mind.webp',
          type: 'Course',
          status: 'active',
          featured: false
        }
      ];
      
      setCourses(fallbackCourses);
      // Set a brief warning message that will be cleared after a few seconds
      setError('Backend API not available yet. Showing sample courses.');
      
      // Clear the error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
      
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          style={{
            color: i <= rating ? '#fbbf24' : '#d1d5db',
            fontSize: '14px'
          }}
        />
      );
    }
    return stars;
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'free') return course.price === 'Free' || course.price === '0';
    if (filter === 'paid') return course.price !== 'Free' && course.price !== '0';
    return true;
  });

  const getPriceDisplay = (price: string | number | undefined) => {
    console.log('💰 Processing price:', price, 'Type:', typeof price);
    
    if (!price || price === '0' || price === 0) return 'Free';
    
    // Convert to string if it's a number
    const priceStr = String(price);
    console.log('💰 Price as string:', priceStr);
    
    if (priceStr.startsWith('$')) return priceStr;
    if (priceStr.toLowerCase() === 'free') return 'Free';
    
    // If it's a number or doesn't start with $, add $ prefix
    return `$${priceStr}`;
  };

  const getDefaultImage = (course: Course) => {
    if (course.thumbnail) {
      // Use the same pattern as marketplace for image URLs
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.thumbnail}`;
    }
    // Return default image based on course type or use a generic one
    return '/intro.webp';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <main style={{ flex: 1, padding: '2rem 2vw', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <FaSpinner style={{ fontSize: '3rem', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem', fontSize: '1.125rem', color: '#6b7280' }}>Loading courses...</p>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error && courses.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <main style={{ flex: 1, padding: '2rem 2vw', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.125rem', color: '#ef4444', marginBottom: '1rem' }}>Error: {error}</p>
            <button 
              onClick={fetchCourses}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      
      <main style={{ flex: 1, padding: '2rem 2vw', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
            Explore Our Courses
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Discover courses designed to help you grow, learn, and achieve your goals
          </p>
          {courses.length > 0 && error && (
            <p style={{ fontSize: '0.875rem', color: '#f59e0b', marginTop: '1rem', fontStyle: 'italic' }}>
              Currently showing sample courses while backend is being developed
            </p>
          )}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            background: '#f3f4f6', 
            borderRadius: '8px', 
            padding: '0.25rem',
            gap: '0.25rem'
          }}>
            {[
              { key: 'all', label: 'All Courses', count: courses.length },
              { key: 'free', label: 'Free', count: courses.filter(c => c.price === 'Free' || c.price === '0').length },
              { key: 'paid', label: 'Paid', count: courses.filter(c => c.price !== 'Free' && c.price !== '0').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as 'all' | 'free' | 'paid')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: filter === key ? '#3b82f6' : 'transparent',
                  color: filter === key ? 'white' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Backend API Warning */}
        {error && courses.length > 0 && (
          <div style={{
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ color: '#92400e', margin: 0, fontSize: '0.875rem' }}>
              ⚠️ {error}
            </p>
            <p style={{ color: '#92400e', margin: '0.5rem 0 0 0', fontSize: '0.75rem', opacity: 0.8 }}>
              This message will disappear automatically in a few seconds.
            </p>
          </div>
        )}

        {filteredCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              {filter === 'all' ? 'No courses available at the moment.' : `No ${filter} courses available.`}
            </p>
            <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
              Check back soon for new courses!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {filteredCourses.map((course) => (
              <Link 
                key={course.id} 
                href={`/courses/${course.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  background: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={getDefaultImage(course)} 
                      alt={course.title}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover' 
                      }} 
                    />
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: getPriceDisplay(course.price) === 'Free' ? '#10b981' : '#8b5cf6',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {getPriceDisplay(course.price)}
                    </div>
                    {course.featured && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: '#f59e0b',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700', 
                      color: '#1f2937', 
                      marginBottom: '0.5rem',
                      lineHeight: '1.3'
                    }}>
                      {course.title}
                    </h3>
                    
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280', 
                      marginBottom: '1rem',
                      lineHeight: '1.5'
                    }}>
                      {course.subtitle || course.description.substring(0, 120) + '...'}
                    </p>
                    
                    {course.rating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                          {course.rating}
                        </span>
                        <div style={{ display: 'flex', gap: '1px' }}>
                          {renderStars(course.rating)}
                        </div>
                        {course.total_ratings && (
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            ({course.total_ratings.toLocaleString()})
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {course.duration && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FaVideo />
                          {course.duration}
                        </div>
                      )}
                      {course.enrolled_students && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FaUsers />
                          {course.enrolled_students.toLocaleString()} students
                        </div>
                      )}
                    </div>
                    
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280',
                      borderTop: '1px solid #f3f4f6',
                      paddingTop: '1rem'
                    }}>
                      Created by <span style={{ color: '#3b82f6' }}>{course.instructor_name || 'Unknown Instructor'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
