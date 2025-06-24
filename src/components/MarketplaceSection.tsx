import React, { useState } from 'react';

const categories = [
  'Courses',
  'Books',
  'Apps',
  'Gadgets',
  'Products',
  'Others',
];

const marketplaceItems = [
  // Courses
  { id: 1, category: 'Courses', title: 'Inclusive Education 101', image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80', desc: 'A foundational course for inclusive teaching.', price: '₹999' },
  { id: 2, category: 'Courses', title: 'Speech Therapy Basics', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', desc: 'Learn the basics of speech therapy for children.', price: '₹799' },
  { id: 3, category: 'Courses', title: 'Autism Support Strategies', image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80', desc: 'Practical strategies for supporting children with autism.', price: '₹1199' },
  { id: 4, category: 'Courses', title: 'Parenting Special Needs', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80', desc: 'Empower yourself as a parent of a child with special needs.', price: '₹899' },
  { id: 5, category: 'Courses', title: 'CBT for Kids', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', desc: 'Cognitive Behavioral Therapy techniques for children.', price: '₹1099' },
  { id: 6, category: 'Courses', title: 'Mindfulness for Educators', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=400&q=80', desc: 'Mindfulness practices for teachers and therapists.', price: '₹799' },
  { id: 32, category: 'Courses', title: 'Behavioral Interventions', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', desc: 'Effective behavioral interventions for classrooms.', price: '₹1299' },
  { id: 33, category: 'Courses', title: 'Assistive Technology', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', desc: 'Using technology to support learning.', price: '₹999' },
  // Books
  { id: 7, category: 'Books', title: 'Understanding Dyslexia', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80', desc: 'A comprehensive guide to dyslexia.', price: '₹499' },
  { id: 8, category: 'Books', title: 'The Inclusive Classroom', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80', desc: 'Best practices for inclusive education.', price: '₹599' },
  { id: 9, category: 'Books', title: 'Speech Therapy at Home', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', desc: 'Speech therapy exercises for parents.', price: '₹399' },
  { id: 10, category: 'Books', title: 'Autism Explained', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=400&q=80', desc: 'A parent-friendly guide to autism.', price: '₹549' },
  { id: 11, category: 'Books', title: 'CBT for Children', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', desc: 'CBT techniques for young minds.', price: '₹499' },
  { id: 34, category: 'Books', title: 'Neurodiversity in Schools', image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80', desc: 'Celebrating neurodiversity in education.', price: '₹699' },
  { id: 35, category: 'Books', title: 'Parenting with Empathy', image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80', desc: 'Empathetic parenting for special needs.', price: '₹599' },
  { id: 36, category: 'Books', title: 'Learning Disabilities', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', desc: 'Understanding and supporting learning disabilities.', price: '₹499' },
  // Apps
  { id: 12, category: 'Apps', title: 'Speech Buddy', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', desc: 'An app for speech therapy practice.', price: 'Free' },
  { id: 13, category: 'Apps', title: 'Mindful Kids', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=400&q=80', desc: 'Mindfulness exercises for children.', price: '₹199' },
  { id: 14, category: 'Apps', title: 'Autism Connect', image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80', desc: 'A support app for autism.', price: '₹299' },
  { id: 15, category: 'Apps', title: 'CBT Coach', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80', desc: 'CBT tools for kids and parents.', price: '₹149' },
  { id: 16, category: 'Apps', title: 'Inclusive Games', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', desc: 'Games for inclusive learning.', price: '₹99' },
  { id: 37, category: 'Apps', title: 'Visual Schedules App', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', desc: 'Visual schedules for routines.', price: '₹149' },
  { id: 38, category: 'Apps', title: 'Parent Support App', image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80', desc: 'Support for parents and caregivers.', price: '₹99' },
  { id: 39, category: 'Apps', title: 'Therapy Tracker', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=400&q=80', desc: 'Track therapy progress.', price: '₹199' },
  // Gadgets
  { id: 17, category: 'Gadgets', title: 'Noise Cancelling Headphones', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80', desc: 'Reduce distractions for focused learning.', price: '₹2999' },
  { id: 18, category: 'Gadgets', title: 'Fidget Spinner', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80', desc: 'A sensory tool for children.', price: '₹199' },
  { id: 19, category: 'Gadgets', title: 'Weighted Blanket', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', desc: 'For calming and comfort.', price: '₹1499' },
  { id: 20, category: 'Gadgets', title: 'Visual Timer', image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80', desc: 'Helps children manage time.', price: '₹499' },
  { id: 21, category: 'Gadgets', title: 'Talking Pen', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', desc: 'Interactive learning tool.', price: '₹799' },
  { id: 40, category: 'Gadgets', title: 'Light Board', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=400&q=80', desc: 'A light board for visual learning.', price: '₹999' },
  { id: 41, category: 'Gadgets', title: 'Therapy Ball', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', desc: 'A ball for therapy exercises.', price: '₹499' },
  { id: 42, category: 'Gadgets', title: 'Sensory Lamp', image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80', desc: 'A calming sensory lamp.', price: '₹799' },
  // Products
  { id: 22, category: 'Products', title: 'Sensory Ball Set', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80', desc: 'A set of sensory balls for play.', price: '₹399' },
  { id: 23, category: 'Products', title: 'Visual Schedules', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80', desc: 'Visual schedules for routines.', price: '₹299' },
  { id: 24, category: 'Products', title: 'Social Stories Cards', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', desc: 'Cards to teach social skills.', price: '₹349' },
  { id: 25, category: 'Products', title: 'Therapy Putty', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', desc: 'Strengthen hands and fingers.', price: '₹249' },
  { id: 26, category: 'Products', title: 'Chewy Necklace', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', desc: 'A sensory chew necklace.', price: '₹199' },
  { id: 43, category: 'Products', title: 'Weighted Vest', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=400&q=80', desc: 'A vest for sensory input.', price: '₹999' },
  { id: 44, category: 'Products', title: 'Therapy Bands', image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80', desc: 'Bands for resistance exercises.', price: '₹299' },
  { id: 45, category: 'Products', title: 'Fine Motor Kit', image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80', desc: 'A kit for fine motor skills.', price: '₹499' },
  // Others
  { id: 27, category: 'Others', title: 'Online Consultation', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80', desc: 'Book a session with an expert.', price: '₹499' },
  { id: 28, category: 'Others', title: 'Assessment Kit', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80', desc: 'A kit for developmental assessment.', price: '₹999' },
  { id: 29, category: 'Others', title: 'Parent Support Group', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', desc: 'Join our online support group.', price: 'Free' },
  { id: 30, category: 'Others', title: 'Resource Download', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fdc?auto=format&fit=crop&w=400&q=80', desc: 'Download helpful resources.', price: 'Free' },
  { id: 31, category: 'Others', title: 'Webinar Access', image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80', desc: 'Access to exclusive webinars.', price: '₹299' },
  { id: 46, category: 'Others', title: 'IEP Templates', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', desc: 'Download IEP templates.', price: 'Free' },
  { id: 47, category: 'Others', title: 'Therapist Directory', image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80', desc: 'Find a therapist near you.', price: 'Free' },
  { id: 48, category: 'Others', title: 'Newsletter Signup', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', desc: 'Sign up for our newsletter.', price: 'Free' },
];

const PAGE_SIZE = 5;

export default function MarketplaceSection() {
  const [selectedCategory, setSelectedCategory] = useState('Courses');
  const [page, setPage] = useState(1);

  const filtered = marketplaceItems.filter(item => item.category === selectedCategory);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="marketplace-section" style={{ background: 'var(--card)', padding: '2.5rem 0', textAlign: 'center' }} aria-label="Marketplace">
      <h2 style={{ fontFamily: 'Righteous, cursive', color: 'var(--accent)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Marketplace: Courses, Books, Apps, Gadgets, Products <span style={{ color: 'red' }}>and much more…</span>
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setPage(1); }}
            style={{
              background: selectedCategory === cat ? 'var(--accent)' : 'var(--muted)',
              color: selectedCategory === cat ? 'var(--text-on-accent)' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 1.5rem',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: selectedCategory === cat ? '0 2px 12px var(--accent-opacity)' : 'none',
              transition: 'all 0.2s',
            }}
            aria-pressed={selectedCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
        {paginated.map(item => (
          <div key={item.id} style={{ width: 220, minHeight: 320, background: 'var(--muted)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', color: 'var(--text-secondary)', fontWeight: 600, boxShadow: '0 2px 12px var(--accent-opacity)', padding: 18, position: 'relative' }}>
            <img src={item.image} alt={item.title} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12, marginBottom: 14, boxShadow: '0 1px 6px var(--accent-opacity)' }} />
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{item.title}</div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: 15, marginBottom: 10 }}>{item.desc}</div>
            <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{item.price}</div>
            <button style={{ background: 'var(--accent)', color: 'var(--text-on-accent)', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 'auto', boxShadow: '0 1px 6px var(--accent-opacity)' }}>Buy Now</button>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: 'var(--muted)', color: 'var(--text-secondary)', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 16, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{ background: page === i + 1 ? 'var(--accent)' : 'var(--muted)', color: page === i + 1 ? 'var(--text-on-accent)' : 'var(--text-secondary)', border: '1.5px solid var(--accent)', borderRadius: 6, padding: '6px 12px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ background: 'var(--muted)', color: 'var(--text-secondary)', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 16, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>Next</button>
        </div>
      )}
    </section>
  );
}
