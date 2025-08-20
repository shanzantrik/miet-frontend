import React, { useEffect, useState, useRef } from 'react';

interface Blog {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  author: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface TransformedBlog {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchBlogs();
    }
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      console.log('Fetching blogs from:', `${backendUrl}/api/blogs`);
      console.log('Environment variable NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

      // Test if the endpoint is reachable
      try {
        const testResponse = await fetch(`${backendUrl}/api/blogs`, { method: 'HEAD' });
        console.log('API endpoint test - Status:', testResponse.status);
        console.log('API endpoint test - Headers:', Object.fromEntries(testResponse.headers.entries()));
      } catch (testErr) {
        console.log('API endpoint test failed:', testErr);
      }

      const response = await fetch(`${backendUrl}/api/blogs`);
      console.log('Main API response status:', response.status);
      console.log('Main API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw API response:', data);
      console.log('Response type:', typeof data);
      console.log('Is array?', Array.isArray(data));

      // Extract blogs array from response and filter only active/published blogs
      const blogsArray = data.blogs || data;
      console.log('Blogs array:', blogsArray);
      console.log('Blogs array length:', blogsArray?.length || 0);

      if (blogsArray && Array.isArray(blogsArray)) {
        console.log('First blog sample:', blogsArray[0]);

        const activeBlogs = blogsArray.filter((blog: Blog) => {
          const isActive = blog.status === 'active' || blog.status === 'published' || blog.status === 'live';
          console.log(`Blog "${blog.title}" status: ${blog.status}, isActive: ${isActive}`);
          return isActive;
        });

        console.log('Active blogs count:', activeBlogs.length);
        console.log('Active blogs:', activeBlogs);

        setBlogs(activeBlogs);
      } else {
        console.log('No valid blogs array found, setting empty array');
        setBlogs([]);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
      // Fallback to empty array if API fails
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Use API blogs only - no fallback data
  const displayBlogs = blogs;

  // Transform API blogs to match the display format
  const transformedBlogs: TransformedBlog[] = displayBlogs.map(blog => {
    console.log('Transforming blog:', blog);

    if ('thumbnail' in blog) {
      // API blog format
      const transformed: TransformedBlog = {
        id: blog.id,
        image: blog.thumbnail || 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
        title: blog.title,
        excerpt: blog.description,
        author: blog.author,
        date: blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'Recent',
        category: blog.category,
      };
      console.log('Transformed API blog:', transformed);
      return transformed;
    } else {
      // This should never happen now since we removed fallback data
      console.log('Unexpected blog format:', blog);
      return blog as TransformedBlog;
    }
  });

  console.log('Final transformed blogs:', transformedBlogs);
  console.log('Display blogs count:', displayBlogs.length);
  console.log('Blogs state count:', blogs.length);

  // Create posts array for marquee - NO DUPLICATION, show blogs only once
  let posts: TransformedBlog[];
  if (transformedBlogs.length > 0) {
    // Have blogs - show them only once, no duplication
    posts = [...transformedBlogs];
  } else {
    // No blogs - empty array
    posts = [];
  }

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <section style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '4rem 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }} aria-label="Blog and media">
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
          textAlign: 'center',
          marginBottom: '3rem',
          zIndex: 2,
          position: 'relative'
        }}>
          <h2 style={{
            fontFamily: 'Righteous, cursive',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: '700',
            color: '#1e1b4b',
            marginBottom: '1rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
            letterSpacing: '1px'
          }}>
            Blog & Media
          </h2>
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
            color: '#4b5563',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Stay updated with our latest insights and stories
          </p>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          flexDirection: 'column',
          gap: '1.5rem',
          zIndex: 2,
          position: 'relative'
        }}>
          <div style={{
            fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
            color: '#667eea',
            fontWeight: '600'
          }}>
            Loading blogs...
          </div>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(99, 102, 241, 0.2)',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
          `
        }} />
      </section>
    );
  }

  return (
    <section style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '4rem 0',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }} aria-label="Blog and media">

      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-20%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-15%',
        width: '30%',
        height: '30%',
        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite reverse'
      }} />

      {/* Section Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        zIndex: 2,
        position: 'relative'
      }}>
        <h2 style={{
          fontFamily: 'Righteous, cursive',
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: '700',
          color: '#1e1b4b',
          marginBottom: '1rem',
          textShadow: '0 2px 10px rgba(0,0,0,0.1)',
          letterSpacing: '1px'
        }}>
          Blog & Media
        </h2>
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
          color: '#4b5563',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6',
          fontWeight: '400'
        }}>
          Stay updated with our latest insights and stories
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div style={{
          color: '#dc2626',
          marginBottom: '2rem',
          padding: '1.5rem',
          background: 'rgba(252, 165, 165, 0.1)',
          borderRadius: '16px',
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
          border: '1px solid rgba(252, 165, 165, 0.3)',
          fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
          fontWeight: '500',
          zIndex: 2,
          position: 'relative'
        }}>
          {error} - Please try again later
        </div>
      )}

      {/* No Blogs State */}
      {blogs.length === 0 && !loading && !error && (
        <div style={{
          color: '#6b7280',
          marginBottom: '2rem',
          padding: '3rem 2rem',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '24px',
          maxWidth: '600px',
          margin: '0 auto',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          backdropFilter: 'blur(10px)',
          zIndex: 2,
          position: 'relative'
        }}>
          <div style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', marginBottom: '1rem' }}>📝</div>
          <h3 style={{
            fontSize: 'clamp(1.3rem, 2vw, 1.5rem)',
            fontWeight: '700',
            color: '#1e1b4b',
            marginBottom: '0.5rem'
          }}>
            No blogs available yet
          </h3>
          <p style={{
            fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
            fontWeight: '500'
          }}>
            Create your first blog in the admin panel!
          </p>
        </div>
      )}

      {/* Blogs Grid - Modern Layout */}
      {blogs.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          zIndex: 2,
          position: 'relative'
        }}>
          {posts.slice(0, 6).map((post, index) => (
            <div
              key={`${post.id}-${index}`}
              className="blog-card"
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                minHeight: '450px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 30px 80px rgba(99, 102, 241, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)';
              }}
            >
              {/* Image Container */}
              <div style={{
                width: '100%',
                height: '220px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: 'clamp(0.8rem, 1vw, 0.9rem)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {post.category}
                </div>
              </div>

              {/* Content Container */}
              <div style={{
                padding: '2rem',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                {/* Title */}
                <h3 style={{
                  fontWeight: '700',
                  color: '#1e1b4b',
                  fontSize: 'clamp(1.2rem, 1.4vw, 1.3rem)',
                  marginBottom: '1rem',
                  lineHeight: '1.3',
                  textAlign: 'left'
                }}>
                  {post.title}
                </h3>

                {/* Description */}
                <p style={{
                  color: '#4b5563',
                  fontSize: 'clamp(1rem, 1.1vw, 1.05rem)',
                  marginBottom: '1.5rem',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  flex: 1
                }}>
                  {truncateDescription(post.excerpt)}
                </p>

                {/* Meta Information */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(99, 102, 241, 0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}>
                    <div style={{
                      color: '#667eea',
                      fontSize: 'clamp(0.9rem, 1vw, 0.95rem)',
                      fontWeight: '600'
                    }}>
                      {post.author}
                    </div>
                    <div style={{
                      color: '#6b7280',
                      fontSize: 'clamp(0.8rem, 0.9vw, 0.85rem)'
                    }}>
                      {post.date}
                    </div>
                  </div>

                  {/* Read More Button */}
                  <button style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.6rem 1.2rem',
                    fontSize: 'clamp(0.9rem, 1vw, 0.95rem)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                  }}
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Button */}
      {blogs.length > 6 && (
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          zIndex: 2,
          position: 'relative'
        }}>
          <button style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '16px',
            padding: '1rem 2rem',
            fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(99, 102, 241, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
          }}
          >
            View All Blogs ({blogs.length})
          </button>
        </div>
      )}

      {/* CSS Animations and Responsive Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .blog-card {
              min-height: 400px !important;
            }

            .blog-card img {
              height: 180px !important;
            }
          }

          @media (max-width: 480px) {
            .blog-card {
              min-height: 380px !important;
            }

            .blog-card img {
              height: 160px !important;
            }
          }
        `
      }} />
    </section>
  );
}
