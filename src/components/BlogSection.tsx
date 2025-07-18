import React from 'react';
import styles from './BlogSection.module.css';

const blogPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    title: 'Empowering Children with Special Needs',
    excerpt: 'Discover strategies and resources to empower children with special needs in education and daily life.',
    author: 'Dr. Asha Mehta',
    date: '2024-06-01',
    category: 'Inclusion',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    title: 'Speech Therapy at Home',
    excerpt: 'How to support your child with speech therapy exercises at home, with expert tips.',
    author: 'Mr. Rajiv Kumar',
    date: '2024-05-28',
    category: 'Therapy',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    title: 'Mental Health for Families',
    excerpt: 'A guide to maintaining mental health and well-being for families and caregivers.',
    author: 'Ms. Priya Singh',
    date: '2024-05-20',
    category: 'Mental Health',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    title: 'Inclusive Classrooms: Best Practices',
    excerpt: 'Learn about best practices for creating inclusive classrooms for all learners.',
    author: 'Dr. Neha Sharma',
    date: '2024-05-15',
    category: 'Education',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
    title: 'Occupational Therapy Tools',
    excerpt: 'Explore the latest tools and techniques in occupational therapy for children.',
    author: 'Mr. Anil Kapoor',
    date: '2024-05-10',
    category: 'Therapy',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=400&q=80',
    title: 'Parent Support Groups',
    excerpt: 'The importance of parent support groups and how to find one near you.',
    author: 'Ms. Ritu Verma',
    date: '2024-05-05',
    category: 'Support',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    title: 'Technology in Special Education',
    excerpt: 'How technology is transforming special education and accessibility.',
    author: 'Dr. Suresh Gupta',
    date: '2024-05-01',
    category: 'Technology',
  },
];

export default function BlogSection() {
  // Duplicate posts for seamless loop
  const posts = [...blogPosts, ...blogPosts];
  return (
    <section className={styles.blogSection} style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} aria-label="Blog and media">
      <h2 style={{ fontFamily: 'Righteous, cursive', color: 'var(--accent)', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Blog & Media</h2>
      <div className={styles.blogMarqueeOuter} style={{ width: '100%', maxWidth: 1400, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 370 }}>
        <div className={styles.blogMarquee} style={{ display: 'flex', gap: 24, alignItems: 'center', animation: 'marquee 32s linear infinite', willChange: 'transform' }}>
          {posts.map(post => (
            <div key={post.id + Math.random()} style={{ flex: '0 0 220px', width: 220, background: 'var(--muted)', borderRadius: 14, boxShadow: '0 2px 12px var(--accent-20)', display: 'flex', flexDirection: 'column', alignItems: 'stretch', transition: 'box-shadow 0.2s', cursor: 'pointer', minHeight: 340, justifyContent: 'flex-start' }}>
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
      {/* Removed inline <style> tag, all styles moved to BlogSection.module.css */}
    </section>
  );
}
