'use client';
import React, { useState, useEffect, use } from 'react';
import { FaPlay, FaCheck, FaStar, FaVideo, FaGlobe, FaChevronDown, FaChevronRight, FaSpinner, FaUser, FaClock, FaBook, FaGraduationCap } from 'react-icons/fa';
import TopBar from '../../../components/TopBar';
import Footer from '../../../components/Footer';
import Link from 'next/link';

interface Course {
  id: string | number;
  title?: string;
  name?: string;
  subtitle?: string;
  description: string;
  rating?: number;
  total_ratings?: number;
  enrolled_students?: number;
  duration?: string;
  instructor_name?: string;
  instructor_title?: string;
  instructor_bio?: string;
  instructor_image?: string;
  price?: string | number;
  thumbnail?: string;
  type?: string;
  product_type?: string;
  status: string;
  featured?: boolean;
  created_at?: string;
  learning_objectives?: string[];
  requirements?: string[];
  course_content?: {
    section: string;
    lectures: number;
    duration: string;
    items: string[];
  }[];
  total_lectures?: number;
  language?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  video_url?: string;
  author?: string;
}



export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('what-you-learn');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    'what-you-learn': false,
    'course-content': true,
    'requirements': false,
    'description': false
  });
  const [showAddToCartSuccess, setShowAddToCartSuccess] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course data from backend using the same pattern as courses listing
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`);

      if (response.ok) {
        const data = await response.json();
        const productsArray = data.products || data;

        // Find the specific course by ID
        const foundCourse = productsArray.find((product: any) =>
          (product.id.toString() === id || product.id === parseInt(id)) &&
          (product.type === 'Course' || product.product_type === 'course')
        );

        if (foundCourse) {
          console.log('✅ Course found:', foundCourse);
          setCourse(foundCourse);
        } else {
          console.log('❌ Course not found for ID:', id);
          setError('Course not found');
        }
      } else {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

    } catch (err) {
      console.error('❌ Error fetching course:', err);
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Helper functions
  const getCourseDisplayName = (course: Course) => {
    return course.title || course.name || 'Untitled Course';
  };

  const getCourseImage = (course: Course) => {
    if (course.thumbnail) {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.thumbnail}`;
    }
    return '/intro.webp'; // Default image
  };

  const getPriceDisplay = (price: string | number | undefined) => {
    if (!price || price === '0' || price === 0) return 'Free';
    if (typeof price === 'string' && price.toLowerCase() === 'free') return 'Free';

    // Convert to string and remove any existing currency symbols
    let cleanPrice = String(price).replace(/[$€£₹]/g, '').trim();

    // If it's a valid number, format it
    if (cleanPrice && !isNaN(Number(cleanPrice))) {
      return `₹${cleanPrice}`;
    }

    // Fallback to original price with ₹ symbol
    return `₹${price}`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={i} style={{ color: '#fbbf24', fontSize: '14px' }} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FaStar key="half" style={{ color: '#fbbf24', fontSize: '14px' }} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar key={`empty-${i}`} style={{ color: '#d1d5db', fontSize: '14px' }} />
      );
    }

    return stars;
  };

  const getDefaultImage = (course: Course) => {
    if (course.instructor_image) {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.instructor_image}`;
    }
    return '/founder.webp'; // Default instructor image
  };

  const addToCart = (item: any) => {
    if (!course) return;

    const cartItem = {
      id: item.id,
      title: item.title,
      name: item.name,
      description: course.description,
      price: item.price,
      thumbnail: course.thumbnail,
      type: item.type,
      product_type: item.product_type,
      quantity: 1
    };

    const existingCart = localStorage.getItem('cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];

    const existingItemIndex = cart.findIndex((item: any) => item.id === course.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    setShowAddToCartSuccess(true);
    setTimeout(() => setShowAddToCartSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <FaSpinner style={{ fontSize: '48px', color: '#8b5cf6', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem', fontSize: '18px', color: '#6b7280' }}>Loading course...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px', color: '#ef4444', marginBottom: '1rem' }}>Error: {error || 'Course not found'}</p>
            <button
              onClick={fetchCourseData}
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

      {/* Mobile Sticky Header */}
      <div className="mobile-sticky-header" style={{
        position: 'sticky',
        top: '0',
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem',
        zIndex: 100,
        display: 'none',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#1f2937',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '200px'
          }}>
            {getCourseDisplayName(course)}
          </h2>
          <div style={{ 
            background: '#8b5cf6', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '20px', 
            fontSize: '14px', 
            fontWeight: '600' 
          }}>
            {getPriceDisplay(course.price)}
          </div>
        </div>
      </div>

      <main style={{ flex: 1, padding: '2rem 2vw', width: '100%' }}>
        <div className="course-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', maxWidth: '1400px', margin: '0 auto' }}>

          {/* Left Column - Course Content */}
          <div className="course-content">
        {/* Course Header */}
            <div className="course-header" style={{ marginBottom: '2rem' }}>
              <h1 className="course-title" style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '1rem', lineHeight: '1.2' }}>
                {getCourseDisplayName(course)}
              </h1>

              {course.subtitle && (
                <p className="course-subtitle" style={{ fontSize: '18px', color: '#4b5563', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  {course.subtitle}
                </p>
              )}

              <p className="course-description" style={{ fontSize: '16px', color: '#4b5563', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                {course.description}
              </p>

            </div>

            {/* Mobile Course Preview Card */}
            <div className="mobile-course-preview" style={{ display: 'none', marginBottom: '1.5rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '1.5rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      background: 'rgba(255,255,255,0.2)', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      ₹
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', opacity: 0.9 }}>Course Price</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{getPriceDisplay(course.price)}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '14px', opacity: 0.9 }}>
                    {course.duration && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FaClock />
                        {course.duration}
                      </div>
                    )}
                    {course.total_lectures && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FaBook />
                        {course.total_lectures} lectures
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="course-stats" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
              {course.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaStar style={{ color: '#fbbf24', fontSize: '20px' }} />
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {course.rating}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {course.total_ratings || 0} ratings
                    </div>
                  </div>
                </div>
              )}

              {course.total_lectures && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaBook style={{ color: '#8b5cf6', fontSize: '20px' }} />
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {course.total_lectures}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Lectures
                    </div>
                  </div>
                </div>
              )}

              {course.duration && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaClock style={{ color: '#10b981', fontSize: '20px' }} />
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {course.duration}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Duration
                    </div>
                  </div>
                </div>
              )}

              {course.level && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaGraduationCap style={{ color: '#f59e0b', fontSize: '20px' }} />
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {course.level}
              </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Level
            </div>
          </div>
            </div>
              )}

              {course.language && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaGlobe style={{ color: '#3b82f6', fontSize: '20px' }} />
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {course.language}
              </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Language
            </div>
            </div>
            </div>
              )}
        </div>

        {/* Navigation Tabs */}
        <div className="course-tabs" style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '2rem' }}>
          <div className="tab-buttons" style={{ display: 'flex', gap: '0' }}>
            {[
              { id: 'what-you-learn', label: 'What you\'ll learn' },
              { id: 'course-content', label: 'Course content' },
                  { id: 'requirements', label: 'Requirements' },
                  { id: 'description', label: 'Description' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1rem 1.5rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: activeTab === tab.id ? '#8b5cf6' : '#6b7280',
                  borderBottom: activeTab === tab.id ? '2px solid #8b5cf6' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '200px' }}>
          {activeTab === 'what-you-learn' && (
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                What you'll learn
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }} className="course-learning-objectives">
                {course.learning_objectives && course.learning_objectives.length > 0 ? (
                  course.learning_objectives.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <FaCheck style={{ color: '#10b981', marginTop: '4px', flexShrink: 0 }} />
                      <span style={{ fontSize: '16px', color: '#374151', lineHeight: '1.5' }}>
                        {item}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                    <p style={{ fontSize: '16px', color: '#6b7280', fontStyle: 'italic' }}>
                      Learning objectives not available yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'course-content' && (
            <div className="course-content-section">
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                Course content
              </h3>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                {course.course_content && course.course_content.length > 0 ? (
                  course.course_content.map((section, index) => (
                    <div key={index} style={{ borderBottom: index < course.course_content!.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                      <button
                        onClick={() => toggleSection(`course-content-${index}`)}
                        style={{
                          width: '100%',
                          padding: '1.5rem',
                          background: 'none',
                          border: 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                            {section.section || `Section ${index + 1}`}
                          </span>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>
                            {section.lectures || 0} lectures
                          </span>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>
                            {section.duration || 'N/A'}
                          </span>
                        </div>
                        {expandedSections[`course-content-${index}`] ? (
                          <FaChevronDown style={{ color: '#6b7280' }} />
                        ) : (
                          <FaChevronRight style={{ color: '#6b7280' }} />
                        )}
                      </button>

                      {expandedSections[`course-content-${index}`] && (
                        <div style={{ padding: '0 1.5rem 1.5rem' }}>
                          {section.items && section.items.length > 0 ? (
                            section.items.map((item, itemIndex) => (
                              <div key={itemIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <FaVideo style={{ color: '#6b7280', fontSize: '14px' }} />
                                <span style={{ fontSize: '14px', color: '#374151' }}>
                                  {item || `Lecture ${itemIndex + 1}`}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                              No lecture details available for this section.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', color: '#6b7280', fontStyle: 'italic' }}>
                      Course content structure not available yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

              {activeTab === 'requirements' && (
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                Requirements
              </h3>
                  <div>
                {course.requirements && course.requirements.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    {course.requirements.map((requirement, index) => (
                      <li key={index} style={{ fontSize: '16px', color: '#374151', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '16px', color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                    No specific requirements listed for this course.
                  </p>
                )}
                  </div>
                </div>
              )}

              {activeTab === 'description' && (
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                    Description
                  </h3>
                  <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                    {course.description}
                  </p>
              </div>
            )}
            </div>
          </div>

          {/* Right Column - Course Card */}
          <div className="course-purchase-card" style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            <div className="purchase-card-inner" style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>

              {/* Course Thumbnail */}
              <div style={{ position: 'relative' }}>
                <img
                  src={getCourseImage(course)}
                  alt={getCourseDisplayName(course)}
              style={{
                width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />

                {/* Price Badge */}
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

                {/* Featured Badge */}
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

              {/* Course Info */}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '0.5rem',
                  lineHeight: '1.3'
                }}>
                  {getCourseDisplayName(course)}
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
                  {course.total_lectures && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FaBook />
                      {course.total_lectures} lectures
                    </div>
                  )}
                </div>

                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  borderTop: '1px solid #f3f4f6',
                  paddingTop: '1rem'
                }}>
                  Created by <span style={{ color: '#3b82f6' }}>{course.instructor_name || course.author || 'Unknown Instructor'}</span>
                </div>
              </div>

              {/* Buy Now Button */}
              <div style={{ padding: '0 1.5rem 1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
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
                      textAlign: 'center'
                    }}
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => addToCart({
                      id: course.id,
                      title: course.title || course.name || 'Untitled Course',
                      price: course.price || '0',
                      thumbnail: course.thumbnail,
                      instructor_name: course.instructor_name,
                      type: 'Course'
                    })}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
                      transform: 'translateY(0px)'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>

                {/* Success Message */}
                {showAddToCartSuccess && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: '#10b981',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '14px',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    ✅ Added to cart! <a href="/cart" style={{ color: 'white', textDecoration: 'underline', marginLeft: '0.5rem' }}>View Cart</a>
                  </div>
                )}
              </div>
            </div>

            {/* Instructor Info */}
            {(course.instructor_name || course.author) && (
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                  About the Instructor
                </h4>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <img
                    src={getDefaultImage(course)}
                    alt={course.instructor_name || course.author || 'Instructor'}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {course.instructor_name || course.author}
                    </h5>
                    {course.instructor_title && (
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '0.5rem' }}>
                        {course.instructor_title}
                      </p>
                    )}
                    {course.instructor_bio && (
                      <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                        {course.instructor_bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Professional Mobile-First Responsive Design */
          
          /* Base Mobile Layout (up to 1024px) */
          @media (max-width: 1024px) {
            .course-layout {
              grid-template-columns: 1fr !important;
              gap: 2.5rem !important;
              max-width: 100% !important;
            }
            
            .course-purchase-card {
              position: relative !important;
              top: 0 !important;
              order: -1 !important;
              margin-bottom: 0 !important;
            }
          }

          /* Mobile Breakpoint (up to 768px) */
          @media (max-width: 768px) {
            /* Layout & Spacing */
            main {
              padding: 0 !important;
            }
            
            .course-layout {
              gap: 0 !important;
              margin: 0 !important;
            }

            /* Hero Section - Course Header */
            .course-header {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              margin: 0 0 2rem 0 !important;
              padding: 2rem 1.5rem !important;
              border-radius: 0 !important;
              position: relative;
              overflow: hidden;
            }

            .course-header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(45deg, rgba(139, 92, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
              z-index: 0;
            }

            .course-header > * {
              position: relative;
              z-index: 1;
            }

            .course-title {
              font-size: clamp(1.75rem, 6vw, 2.25rem) !important;
              font-weight: 800 !important;
              line-height: 1.2 !important;
              margin-bottom: 1rem !important;
              background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }

            .course-subtitle {
              font-size: clamp(1.125rem, 3.5vw, 1.25rem) !important;
              font-weight: 500 !important;
              color: #475569 !important;
              margin-bottom: 1.25rem !important;
              line-height: 1.4 !important;
            }

            .course-description {
              font-size: clamp(1rem, 2.8vw, 1.125rem) !important;
              color: #64748b !important;
              line-height: 1.6 !important;
              margin-bottom: 0 !important;
            }

            /* Mobile Course Preview - Beautiful Card Design */
            .mobile-course-preview {
              display: block !important;
              margin: 0 1.5rem 2rem 1.5rem !important;
            }

            .mobile-course-preview > div {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
              border-radius: 20px !important;
              padding: 2rem !important;
              box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3) !important;
              position: relative;
              overflow: hidden;
            }

            .mobile-course-preview > div::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -20%;
              width: 300px;
              height: 300px;
              background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
              border-radius: 50%;
            }

            .mobile-course-preview > div::after {
              content: '';
              position: absolute;
              bottom: -30%;
              left: -20%;
              width: 200px;
              height: 200px;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
              border-radius: 50%;
            }

            /* Hide desktop stats on mobile */
            .course-stats {
              display: none !important;
            }

            /* Enhanced Mobile Tabs */
            .course-tabs {
              margin: 0 1.5rem 2rem 1.5rem !important;
              background: white !important;
              border-radius: 16px !important;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
              overflow: hidden !important;
            }

            .tab-buttons {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 0 !important;
            }

            .tab-button {
              padding: 1.25rem 1rem !important;
              font-size: clamp(0.875rem, 2.5vw, 1rem) !important;
              font-weight: 600 !important;
              border-radius: 0 !important;
              border: none !important;
              background: transparent !important;
              color: #64748b !important;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
              position: relative;
              overflow: hidden;
            }

            .tab-button::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
              transform: translateY(100%);
              transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              z-index: -1;
            }

            .tab-button.active {
              color: white !important;
              border-bottom: none !important;
            }

            .tab-button.active::before {
              transform: translateY(0);
            }

            .tab-button:not(.active):hover {
              color: #8b5cf6 !important;
              background: rgba(139, 92, 246, 0.05) !important;
            }

            /* Tab Content Mobile Styling */
            .course-content {
              padding: 0 1.5rem 2rem 1.5rem !important;
            }

            .course-content > div > div {
              min-height: auto !important;
            }

            .course-content h3 {
              font-size: clamp(1.5rem, 4.5vw, 1.75rem) !important;
              font-weight: 700 !important;
              color: #1e293b !important;
              margin-bottom: 1.5rem !important;
              position: relative;
            }

            .course-content h3::after {
              content: '';
              position: absolute;
              bottom: -0.5rem;
              left: 0;
              width: 3rem;
              height: 3px;
              background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);
              border-radius: 2px;
            }

            /* Learning Objectives Mobile Grid */
            .course-learning-objectives {
              display: grid !important;
              grid-template-columns: 1fr !important;
              gap: 1rem !important;
            }

            .course-learning-objectives > div {
              background: white !important;
              padding: 1.25rem !important;
              border-radius: 12px !important;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
              border: 1px solid #f1f5f9 !important;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
              position: relative;
              overflow: hidden;
            }

            .course-learning-objectives > div::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              background: linear-gradient(180deg, #10b981 0%, #059669 100%);
              transform: scaleY(0);
              transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .course-learning-objectives > div:hover {
              transform: translateY(-2px) !important;
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
              border-color: #dbeafe !important;
            }

            .course-learning-objectives > div:hover::before {
              transform: scaleY(1);
            }

            .course-learning-objectives span {
              font-size: clamp(0.95rem, 2.8vw, 1rem) !important;
              color: #374151 !important;
              line-height: 1.5 !important;
              font-weight: 500 !important;
            }

            /* Course Content Section Mobile */
            .course-content-section {
              background: white !important;
              border-radius: 16px !important;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
              overflow: hidden !important;
            }

            .course-content-section > div {
              border: none !important;
              border-radius: 0 !important;
            }

            .course-content-section button {
              padding: 1.5rem !important;
              min-height: 70px !important;
              background: transparent !important;
              border: none !important;
              border-bottom: 1px solid #f1f5f9 !important;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
              position: relative;
            }

            .course-content-section button:hover {
              background: rgba(139, 92, 246, 0.02) !important;
            }

            .course-content-section button:active {
              background: rgba(139, 92, 246, 0.05) !important;
              transform: scale(0.98) !important;
            }

            .course-content-section > div > div {
              padding: 0 1.5rem 1.5rem !important;
              background: #fafbfc !important;
            }

            /* Purchase Card Mobile Styling */
            .course-purchase-card {
              margin: 0 1.5rem 2rem 1.5rem !important;
            }

            .purchase-card-inner {
              border-radius: 20px !important;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
              border: none !important;
              overflow: hidden !important;
              position: relative;
            }

            .purchase-card-inner::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 0%, #10b981 100%);
            }

            .purchase-card-inner img {
              height: 200px !important;
            }

            .purchase-card-inner > div:last-child {
              padding: 1.5rem !important;
            }

            .purchase-card-inner h3 {
              font-size: clamp(1.25rem, 3.5vw, 1.375rem) !important;
              font-weight: 700 !important;
              color: #1e293b !important;
              margin-bottom: 0.75rem !important;
              line-height: 1.3 !important;
            }

            .purchase-card-inner p {
              font-size: clamp(0.9rem, 2.5vw, 0.95rem) !important;
              color: #64748b !important;
              line-height: 1.5 !important;
              margin-bottom: 1rem !important;
            }

            /* Mobile Sticky Header */
            .mobile-sticky-header {
              display: block !important;
              background: rgba(255, 255, 255, 0.95) !important;
              backdrop-filter: blur(20px) !important;
              border-bottom: 1px solid rgba(226, 232, 240, 0.8) !important;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
            }

            .mobile-sticky-header > div {
              padding: 0 1.5rem !important;
            }

            .mobile-sticky-header h2 {
              font-size: clamp(0.95rem, 2.8vw, 1rem) !important;
              font-weight: 600 !important;
              color: #1e293b !important;
              max-width: 180px !important;
            }

            .mobile-sticky-header > div > div:last-child {
              background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%) !important;
              padding: 0.5rem 1rem !important;
              border-radius: 25px !important;
              font-size: clamp(0.8rem, 2.2vw, 0.875rem) !important;
              font-weight: 600 !important;
              box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3) !important;
            }
          }

          /* Small Mobile Breakpoint (up to 480px) */
          @media (max-width: 480px) {
            .course-header {
              padding: 1.5rem 1rem !important;
              margin: 0 0 1.5rem 0 !important;
            }

            .course-title {
              font-size: clamp(1.5rem, 5.5vw, 2rem) !important;
            }

            .course-subtitle {
              font-size: clamp(1rem, 3vw, 1.125rem) !important;
            }

            .course-description {
              font-size: clamp(0.9rem, 2.5vw, 1rem) !important;
            }

            .mobile-course-preview {
              margin: 0 1rem 1.5rem 1rem !important;
            }

            .mobile-course-preview > div {
              padding: 1.5rem !important;
            }

            .course-tabs {
              margin: 0 1rem 1.5rem 1rem !important;
            }

            .course-content {
              padding: 0 1rem 1.5rem 1rem !important;
            }

            .course-purchase-card {
              margin: 0 1rem 1.5rem 1rem !important;
            }

            .mobile-sticky-header > div {
              padding: 0 1rem !important;
            }

            .mobile-sticky-header h2 {
              max-width: 150px !important;
            }

            .tab-buttons {
              grid-template-columns: 1fr !important;
            }

            .tab-button {
              padding: 1rem !important;
              font-size: clamp(0.875rem, 2.8vw, 0.95rem) !important;
            }
          }

          /* Smooth Transitions & Animations */
          .course-layout,
          .course-header,
          .course-stats,
          .course-tabs,
          .course-purchase-card,
          .purchase-card-inner,
          .course-learning-objectives > div,
          .course-content-section button {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }

          /* Enhanced Mobile Interactions */
          @media (max-width: 768px) {
            .course-learning-objectives > div:active {
              transform: translateY(-1px) scale(0.98) !important;
            }

            .course-content-section button:active {
              transform: scale(0.97) !important;
            }

            .purchase-card-inner:active {
              transform: translateY(-1px) !important;
            }
          }

          /* Custom Scrollbar for Mobile Tabs */
          @media (max-width: 768px) {
            .course-tabs::-webkit-scrollbar {
              height: 3px !important;
            }

            .course-tabs::-webkit-scrollbar-track {
              background: transparent !important;
            }

            .course-tabs::-webkit-scrollbar-thumb {
              background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%) !important;
              border-radius: 2px !important;
            }

            /* Floating Action Button */
            .mobile-fab {
              display: block !important;
            }

            .mobile-fab button {
              width: 56px !important;
              height: 56px !important;
              font-size: 20px !important;
              box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4) !important;
            }

            .mobile-fab button:active {
              transform: scale(0.95) !important;
              box-shadow: 0 4px 15px rgba(139, 92, 246, 0.6) !important;
            }
          }

          /* Small Mobile FAB */
          @media (max-width: 480px) {
            .mobile-fab {
              bottom: 1rem !important;
              right: 1rem !important;
            }

            .mobile-fab button {
              width: 52px !important;
              height: 52px !important;
              font-size: 18px !important;
            }
          }
        `
      }} />

      {/* Mobile Floating Action Button */}
      <div className="mobile-fab" style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        display: 'none'
      }}>
        <button
          onClick={() => {
            const card = document.querySelector('.course-purchase-card');
            if (card) {
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
            border: 'none',
            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(139, 92, 246, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
          }}
        >
          ₹
        </button>
      </div>

      <Footer />
    </div>
  );
}

