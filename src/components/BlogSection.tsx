import React, { useEffect, useState, useRef } from 'react';
import styles from './BlogSection.module.css';

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
  const transformedBlogs = displayBlogs.map(blog => {
    console.log('Transforming blog:', blog);
    
    if ('thumbnail' in blog) {
      // API blog format
      const transformed = {
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
      return blog;
    }
  });

  console.log('Final transformed blogs:', transformedBlogs);
  console.log('Display blogs count:', displayBlogs.length);
  console.log('Blogs state count:', blogs.length);
  
  // Create posts array for marquee - NO DUPLICATION, show blogs only once
  let posts;
  if (transformedBlogs.length > 0) {
    // Have blogs - show them only once, no duplication
    posts = [...transformedBlogs];
  } else {
    // No blogs - empty array
    posts = [];
  }

  if (loading) {
    return (
      <section className={styles.blogSection} style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} aria-label="Blog and media">
        <h2 style={{ fontFamily: 'Righteous, cursive', color: 'var(--accent)', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Blog & Media</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '18px', color: '#5a67d8', fontWeight: '600' }}>Loading blogs...</div>
          <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #5a67d8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.blogSection} style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} aria-label="Blog and media">
      <h2 style={{ fontFamily: 'Righteous, cursive', color: 'var(--accent)', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Blog & Media</h2>
      
      {error && (
        <div style={{ color: '#e53e3e', marginBottom: '20px', padding: '10px', background: '#fed7d7', borderRadius: '8px', maxWidth: '600px' }}>
          {error} - Showing sample content
        </div>
      )}
      
      {blogs.length === 0 && !loading && (
        <div style={{ color: '#666', marginBottom: '20px', padding: '20px', background: '#f7fafc', borderRadius: '8px', maxWidth: '600px' }}>
          No blogs available yet. Create your first blog in the admin panel!
        </div>
      )}
      
      {blogs.length > 0 && (
        <div className={styles.blogMarqueeOuter} style={{ width: '100%', maxWidth: 1400, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 370 }}>
          <div className={styles.blogMarquee} style={{ display: 'flex', gap: 24, alignItems: 'center', animation: 'marquee 32s linear infinite', willChange: 'transform' }}>
            {posts.map((post, index) => (
              <div key={`${post.id}-${index}`} style={{ flex: '0 0 220px', width: 220, background: 'var(--muted)', borderRadius: 14, boxShadow: '0 2px 12px var(--accent-20)', display: 'flex', flexDirection: 'column', alignItems: 'stretch', transition: 'box-shadow 0.2s', cursor: 'pointer', minHeight: 340, justifyContent: 'flex-start' }}>
                <div style={{ width: '100%', height: 120, borderTopLeftRadius: 14, borderTopRightRadius: 14, overflow: 'hidden' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ padding: '14px 14px 10px 14px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-accent-alt)', fontSize: 16, marginBottom: 6, textAlign: 'left', width: '100%' }}>{post.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, textAlign: 'left', width: '100%' }}>{post.excerpt}</div>
                  <div style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{post.category}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 2 }}>{post.date}</div>
                  <div style={{ color: 'var(--text-accent-alt)', fontSize: 13, fontWeight: 600 }}>{post.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .blog-marquee-outer { position: relative; }
        .blog-marquee {
          animation-play-state: running;
        }
        .blog-marquee-outer:hover .blog-marquee {
          animation-play-state: paused !important;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .blog-section::-webkit-scrollbar { display: none; }
        .blog-section { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 1400px) {
          .blog-marquee-outer { max-width: 100vw; }
        }
        @media (max-width: 1200px) {
          .blog-marquee-outer { height: 350px; }
        }
        @media (max-width: 900px) {
          .blog-marquee-outer { height: 320px; }
        }
        @media (max-width: 600px) {
          .blog-marquee-outer { height: 260px; }
          .blog-marquee > div { width: 170px !important; min-height: 200px !important; }
        }
      `,
        }}
      />
    </section>
  );
}
