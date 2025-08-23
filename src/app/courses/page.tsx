'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaStar, FaVideo, FaUsers, FaClock, FaSpinner } from 'react-icons/fa';
import TopBar from '../../components/TopBar';
import Footer from '../../components/Footer';
import { useCart } from '../../components/CartContext';

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
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Debug environment variable
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      console.log('🔧 Backend URL:', backendUrl);

      if (!backendUrl) {
        throw new Error('Backend URL not configured. Please check your environment variables.');
      }

      // Fetch courses from backend API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${backendUrl}/api/products`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Raw backend data:', data);

        const productsArray = data.products || data;
        console.log('📦 Products array:', productsArray);
        console.log('📦 Products array length:', productsArray.length);

        // Filter only active courses
        const activeCourses = productsArray.filter((product: any) => {
          const isActive = product.status === 'active';
          const productType = (product.type || product.product_type || '').toLowerCase();
          const isCourse = productType === 'course';
          console.log(`🔍 Product: ${product.title || product.name}, Status: ${product.status}, Type: ${product.type || product.product_type}, Active: ${isActive}, Course: ${isCourse}`);
          return isActive && isCourse;
        });

        console.log('✅ Active courses found:', activeCourses.length);
        console.log('✅ Active courses data:', activeCourses);

        if (activeCourses.length === 0) {
          console.log('⚠️ No active courses found in backend data');
          setError('No courses are currently available. Please check back later or contact support if you believe this is an error.');
        } else {
          setCourses(activeCourses);
          setError(null);
        }
      } else {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

    } catch (err) {
      console.error('❌ Error fetching courses:', err);

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out. Please check your connection and try again.');
        } else {
          setError(`Failed to load courses: ${err.message}`);
        }
      } else {
        setError('Failed to load courses. Please check your connection and try again.');
      }

      setCourses([]);

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
    <>
      <TopBar />

      <main style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
        padding: '4rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-15%',
          width: '30%',
          height: '30%',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite reverse'
        }} />

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Page Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{
              fontFamily: 'Righteous, cursive',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              color: '#1e1b4b',
              marginBottom: '1rem',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              letterSpacing: '1px'
            }}>
              Explore Our Courses
            </h1>
            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: '#4b5563',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              Discover courses designed to help you grow, learn, and achieve your goals
            </p>
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



        {filteredCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            {error ? (
              <>
                <p style={{ fontSize: '1.125rem', color: '#ef4444', marginBottom: '1rem' }}>
                  Unable to load courses
                </p>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  {error}
                </p>
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
              </>
            ) : (
              <>
                <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
                  {filter === 'all' ? 'No courses available at the moment.' : `No ${filter} courses available.`}
                </p>
                <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
                  Check back soon for new courses!
                </p>
              </>
            )}
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

                    <p className="course-description" style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '1rem',
                      lineHeight: '1.5'
                    }}>
                      {course.subtitle || course.description.substring(0, 120) + '...'}
                    </p>

                    {course.rating && course.rating > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                          {course.rating}
                        </span>
                        <div style={{ display: 'flex', gap: '1px' }}>
                          {renderStars(course.rating)}
                        </div>
                        {course.total_ratings && course.total_ratings > 0 && (
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            ({course.total_ratings.toLocaleString()})
                          </span>
                        )}
                      </div>
                    )}

                    {(course.duration || course.enrolled_students) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        {course.duration && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <FaVideo />
                            {course.duration}
                          </div>
                        )}
                        {course.enrolled_students && course.enrolled_students > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <FaUsers />
                            {course.enrolled_students.toLocaleString()} students
                          </div>
                        )}
                      </div>
                    )}

                    {course.instructor_name && (
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        borderTop: '1px solid #f3f4f6',
                        paddingTop: '1rem'
                      }}>
                        Created by <span style={{ color: '#3b82f6' }}>{course.instructor_name}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: 'auto' }}>
                    <Link 
                      href={`/courses/${course.id}`}
                      style={{
                        background: 'linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)',
                        color: 'rgb(255, 255, 255)',
                        padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                        transition: '0.3s',
                        boxShadow: 'rgba(99, 102, 241, 0.3) 0px 4px 15px',
                        minWidth: 'clamp(80px, 20vw, 100px)',
                        minHeight: 'clamp(36px, 8vw, 44px)',
                        transform: 'translateY(0px)',
                        display: 'inline-block',
                        cursor: 'pointer',
                        flex: '1 1 0%',
                        textAlign: 'center'
                      }}
                    >
                      View Details
                    </Link>
                    <button 
                      onClick={() => addToCart({
                        id: course.id,
                        title: course.title || 'Untitled Course',
                        price: course.price || '0',
                        thumbnail: course.thumbnail,
                        instructor_name: course.instructor_name,
                        type: 'Course'
                      })}
                      style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #000000 100%)', // Add to Cart (red to black)
                        color: 'rgb(255, 255, 255)',
                        padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                        borderRadius: '12px',
                        border: 'none',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                        transition: '0.3s',
                        boxShadow: 'rgba(239, 68, 68, 0.3) 0px 4px 15px',
                        minWidth: 'clamp(80px, 20vw, 100px)',
                        minHeight: 'clamp(36px, 8vw, 44px)',
                        transform: 'translateY(0px)',
                        flex: '1 1 0%'
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>

        {/* CSS Animation */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
          `
        }} />
      </main>

      <Footer />
    </>
  );
}
