'use client';
import React, { useState, useEffect } from 'react';
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



export default function CourseDetailPage({ params }: { params: { id: string } }) {
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
  }, [params.id]);

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
          (product.id.toString() === params.id || product.id === parseInt(params.id)) &&
          (product.type === 'Course' || product.product_type === 'course')
        );

        if (foundCourse) {
          console.log('✅ Course found:', foundCourse);
          setCourse(foundCourse);
        } else {
          console.log('❌ Course not found for ID:', params.id);
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

  const addToCart = () => {
    if (!course) return;

    const cartItem = {
      id: course.id,
      title: course.title,
      name: course.name,
      description: course.description,
      price: course.price,
      thumbnail: course.thumbnail,
      type: course.type,
      product_type: course.product_type,
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

      <main style={{ flex: 1, padding: '2rem 2vw', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', maxWidth: '1400px', margin: '0 auto' }}>

          {/* Left Column - Course Content */}
          <div>
        {/* Course Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '1rem', lineHeight: '1.2' }}>
                {getCourseDisplayName(course)}
              </h1>

              {course.subtitle && (
                <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  {course.subtitle}
                </p>
              )}

              <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                {course.description}
              </p>

            </div>

            {/* Course Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
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
        <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {[
              { id: 'what-you-learn', label: 'What you\'ll learn' },
              { id: 'course-content', label: 'Course content' },
                  { id: 'requirements', label: 'Requirements' },
                  { id: 'description', label: 'Description' }
            ].map((tab) => (
              <button
                key={tab.id}
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
        <div style={{ minHeight: '400px' }}>
          {activeTab === 'what-you-learn' && (
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                What you'll learn
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
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
            <div>
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
          <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>

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
                <Link
                  href="/marketplace/course"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #8b5cf6',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#8b5cf6',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#8b5cf6';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#8b5cf6';
                  }}>
                  Buy Now
                </Link>

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

      <Footer />
    </div>
  );
}
