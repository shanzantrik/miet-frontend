'use client';
import React, { useState, useEffect } from 'react';
import { FaPlay, FaCheck, FaStar, FaVideo, FaGlobe, FaChevronDown, FaChevronRight, FaSpinner } from 'react-icons/fa';
import TopBar from '../../../components/TopBar';
import Footer from '../../../components/Footer';

interface Course {
  id: string | number;
  title: string;
  subtitle?: string;
  description: string;
  rating?: number;
  total_ratings?: number;
  enrolled_students?: number;
  duration?: string;
  instructor_name?: string;
  price?: string | number;
  thumbnail?: string;
  type: string;
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

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          style={{
            color: i <= rating ? '#fbbf24' : '#d1d5db',
            fontSize: '16px'
          }}
        />
      );
    }
    return stars;
  };

  const getPriceDisplay = (price: string | number | undefined) => {
    if (!price || price === '0' || price === 0) return 'Free';
    
    // Convert to string if it's a number
    const priceStr = String(price);
    
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
            <p style={{ marginTop: '1rem', fontSize: '1.125rem', color: '#6b7280' }}>Loading course...</p>
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

  if (error || !course) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <main style={{ flex: 1, padding: '2rem 2vw', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.125rem', color: '#ef4444', marginBottom: '1rem' }}>Error: {error || 'Course not found'}</p>
            <button 
              onClick={() => window.history.back()}
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
              Go Back
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
        {/* Course Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', marginBottom: '3rem' }}>
          {/* Video Player */}
          <div style={{ background: '#8b5cf6', borderRadius: '12px', padding: '2rem', position: 'relative', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                background: '#fbbf24', 
                borderRadius: '50%', 
                margin: '0 auto 1rem',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: '#60a5fa',
                  borderRadius: '50%',
                  position: 'relative'
                }}>
                  <FaPlay 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      fontSize: '24px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <FaCheck style={{ color: 'white', fontSize: '16px' }} />
                  <FaCheck style={{ color: 'white', fontSize: '16px' }} />
                  <FaCheck style={{ color: 'white', fontSize: '16px' }} />
                </div>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  border: '2px dashed white', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaCheck style={{ color: 'white', fontSize: '20px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ width: '20px', height: '2px', background: 'white' }}></div>
                  <div style={{ width: '20px', height: '2px', background: 'white' }}></div>
                  <div style={{ width: '20px', height: '2px', background: 'white' }}></div>
                </div>
              </div>
              
              <p style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                Preview this course
              </p>
            </div>
          </div>

          {/* Course Details */}
          <div style={{ padding: '1rem 0' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem', lineHeight: '1.2' }}>
              {course.title}
            </h1>
            
            <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {course.subtitle || course.description}
            </p>

            <div style={{ 
              display: 'inline-block', 
              background: '#f97316', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px', 
              fontSize: '14px', 
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              {getPriceDisplay(course.price)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                {course.rating || 'N/A'}
              </span>
              <div style={{ display: 'flex', gap: '2px' }}>
                {renderStars(course.rating || 0)}
              </div>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                ({course.total_ratings || 0} ratings)
              </span>
            </div>

            <p style={{ fontSize: '16px', color: '#1f2937', marginBottom: '1rem' }}>
              {course.enrolled_students || 0} students
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaVideo style={{ color: '#6b7280' }} />
              <span style={{ fontSize: '16px', color: '#1f2937' }}>
                {course.duration || 'N/A'} of on-demand video
              </span>
            </div>

            <p style={{ fontSize: '16px', color: '#1f2937', marginBottom: '1rem' }}>
              Created by{' '}
              <span style={{ color: '#3b82f6', cursor: 'pointer' }}>
                {course.instructor_name || 'Unknown Instructor'}
              </span>
              ,{' '}
              <span style={{ color: '#3b82f6', cursor: 'pointer' }}>
                Insider School
              </span>
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <FaGlobe style={{ color: '#6b7280' }} />
              <span style={{ fontSize: '16px', color: '#1f2937' }}>
                English English [Auto], Arabic [Auto],{' '}
                <span style={{ color: '#3b82f6', cursor: 'pointer' }}>
                  23 more
                </span>
              </span>
            </div>

            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
              {getPriceDisplay(course.price)}
            </div>

            <button style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #8b5cf6',
              borderRadius: '8px',
              background: 'white',
              color: '#8b5cf6',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#8b5cf6';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#8b5cf6';
            }}>
              Enroll now
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {[
              { id: 'what-you-learn', label: 'What you\'ll learn' },
              { id: 'course-content', label: 'Course content' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'instructors', label: 'Instructors' }
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

          {activeTab === 'reviews' && (
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                Reviews
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { rating: 5, comment: 'Excellent course! The 7-step system is practical and easy to implement.', author: 'Sarah Johnson', date: '2 weeks ago' },
                  { rating: 4, comment: 'Great content, helped me organize my day better.', author: 'Mike Chen', date: '1 month ago' }
                ].map((review, index) => (
                  <div key={index} style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {renderStars(review.rating)}
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        {review.author} • {review.date}
                      </span>
                    </div>
                    <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.5' }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructors' && (
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                Instructors
              </h3>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                <img 
                  src={getDefaultImage(course)} 
                  alt={course.instructor_name || 'Instructor'}
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    objectFit: 'cover' 
                  }} 
                />
                <div>
                  <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                    {course.instructor_name || 'Unknown Instructor'}
                  </h4>
                  <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '1rem' }}>
                    Productivity Expert & Time Management Coach
                  </p>
                  <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>
                    {course.instructor_name ? `This course is taught by ${course.instructor_name}, a productivity expert and time management coach.` : 'This course is taught by an expert in productivity and time management.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collapsible Sections */}
        <div style={{ marginTop: '1.5rem' }}>
          {/* Requirements Section */}
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => toggleSection('requirements')}
              style={{
                width: '100%',
                padding: '1rem 0',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                Requirements
              </h3>
              {expandedSections.requirements ? (
                <FaChevronDown style={{ color: '#6b7280' }} />
              ) : (
                <FaChevronRight style={{ color: '#6b7280' }} />
              )}
            </button>
            {expandedSections.requirements && (
              <div style={{ padding: '1rem 0' }}>
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
            )}
          </div>

          {/* Description Section */}
          <div>
            <button
              onClick={() => toggleSection('description')}
              style={{
                width: '100%',
                padding: '1rem 0',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                Description
              </h3>
              {expandedSections.description ? (
                <FaChevronDown style={{ color: '#6b7280' }} />
              ) : (
                <FaChevronRight style={{ color: '#6b7280' }} />
              )}
            </button>
            {expandedSections.description && (
              <div style={{ padding: '1rem 0' }}>
                <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                  {course.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
