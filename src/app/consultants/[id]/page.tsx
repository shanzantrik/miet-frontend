'use client';
import React from 'react';
import { consultants } from '../../../components/consultantsData';
import { marketplaceItems } from '../../../components/marketplaceData';
import { blogPosts } from '../../../components/blogData';
import { notFound } from 'next/navigation';
import TopBar from '../../../components/TopBar';
import Footer from '../../../components/Footer';

export default async function ConsultantProfilePage({ params }: { params: { id: string } }) {
  // Await params if it's a Promise (for edge/serverless environments)
  const resolvedParams = typeof params.then === 'function' ? await params : params;
  const consultant = consultants.find(c => c.id === Number(resolvedParams.id));
  if (!consultant) return notFound();

  // Related resources: show up to 4 courses/products
  const relatedResources = marketplaceItems.filter(item =>
    item.title.toLowerCase().includes(consultant.name.split(' ')[1]?.toLowerCase() || '') ||
    item.desc.toLowerCase().includes(consultant.expertise.toLowerCase())
  ).slice(0, 4);

  // Related blog posts: show up to 3
  const relatedBlogs = blogPosts.filter(post =>
    post.author === consultant.name ||
    post.title.toLowerCase().includes(consultant.expertise.toLowerCase())
  ).slice(0, 3);

  return (
    <>
      <TopBar />
      <section style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center', minHeight: '100vh' }} aria-label="Consultant Profile">
        <div style={{ maxWidth: 800, margin: '0 auto', background: 'var(--muted)', borderRadius: 16, boxShadow: '0 2px 16px var(--accent-20)', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={consultant.image} alt={consultant.name} style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #5a67d8', marginBottom: 18 }} />
          <h2 style={{ color: '#5a67d8', fontWeight: 700, fontSize: 28 }}>{consultant.name}</h2>
          <div style={{ color: '#22543d', fontWeight: 600, fontSize: 20, marginBottom: 6 }}>{consultant.expertise}</div>
          <div style={{ color: '#888', fontSize: 16, marginBottom: 8 }}>{consultant.city} &middot; <span style={{ color: consultant.mode === 'Online' ? '#39e639' : '#22543d', fontWeight: 600 }}>{consultant.mode}</span></div>
          <div style={{ color: '#444', fontSize: 16, fontStyle: 'italic', marginBottom: 8 }}>{consultant.tagline}</div>
          <div style={{ color: '#5a67d8', fontSize: 15, marginBottom: 8 }}>{consultant.highlights}</div>
          <div style={{ color: '#22543d', fontSize: 15, background: '#e6f0f7', borderRadius: 8, padding: '6px 12px', marginTop: 4, fontWeight: 500, boxShadow: '0 1px 4px #5a67d822', marginBottom: 12 }}>
            <span role="img" aria-label="star">⭐</span> Featured Consultant
          </div>
          <div style={{ color: '#333', fontSize: 16, marginBottom: 8 }}><b>Bio:</b> {consultant.bio}</div>
          <div style={{ color: '#333', fontSize: 16, marginBottom: 8 }}><b>Address:</b> {consultant.address}</div>
          <div style={{ color: '#333', fontSize: 16, marginBottom: 8 }}><b>Phone:</b> {consultant.phone}</div>
          <div style={{ color: '#333', fontSize: 16, marginBottom: 8 }}><b>Email:</b> {consultant.email}</div>
          <div style={{ color: '#333', fontSize: 16, marginBottom: 8 }}><b>Location:</b> {consultant.location}</div>
          {/* Reviews placeholder */}
          <div style={{ color: '#5a67d8', fontWeight: 700, fontSize: 20, margin: '24px 0 12px' }}>Reviews</div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>
            {/* In a real app, map over reviews array */}
            <div><b>Parent:</b> "Wonderful experience, very helpful!"</div>
            <div><b>Student:</b> "Helped me a lot with my learning challenges."</div>
          </div>
          {/* Related Resources */}
          <div style={{ color: '#5a67d8', fontWeight: 700, fontSize: 20, margin: '24px 0 12px' }}>Related Resources</div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 18 }}>
            {relatedResources.length === 0 && <div style={{ color: '#888' }}>No related resources found.</div>}
            {relatedResources.map(item => (
              <div key={item.id} style={{ width: 180, background: 'var(--muted)', borderRadius: 10, boxShadow: '0 1px 6px var(--accent-20)', padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={item.image} alt={item.title} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', marginBottom: 8 }} />
                <div style={{ fontWeight: 700, fontSize: 15 }}>{item.title}</div>
                <div style={{ color: '#888', fontSize: 13 }}>{item.desc}</div>
                <div style={{ color: '#5a67d8', fontWeight: 700, fontSize: 14, marginTop: 4 }}>{item.price}</div>
              </div>
            ))}
          </div>
          {/* Related Blog Posts */}
          <div style={{ color: '#5a67d8', fontWeight: 700, fontSize: 20, margin: '24px 0 12px' }}>Related Blog Posts</div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
            {relatedBlogs.length === 0 && <div style={{ color: '#888' }}>No related blog posts found.</div>}
            {relatedBlogs.map(post => (
              <div key={post.id} style={{ width: 220, background: 'var(--muted)', borderRadius: 10, boxShadow: '0 1px 6px var(--accent-20)', padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: 80, borderRadius: 8, objectFit: 'cover', marginBottom: 8 }} />
                <div style={{ fontWeight: 700, fontSize: 15 }}>{post.title}</div>
                <div style={{ color: '#888', fontSize: 13 }}>{post.excerpt}</div>
                <div style={{ color: '#5a67d8', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{post.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
} 