"use client";
import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

const events = [
  {
    id: 1,
    title: "Inclusive Education Workshop",
    date: "2024-08-10",
    image: "/programmes.webp",
    summary: "A hands-on workshop for parents and educators on inclusive education strategies.",
    details: "Join us for a full-day workshop with leading experts in special education. Learn practical strategies, network with peers, and get your questions answered. Lunch and materials included.",
    location: "MieT Center, Gurgaon",
  },
  {
    id: 2,
    title: "Mental Health Webinar",
    date: "2024-08-18",
    image: "/brain-miet.png",
    summary: "An online webinar on supporting mental health for children and families.",
    details: "This interactive webinar covers the latest research and practical tips for supporting mental health at home and in school. Q&A with our panel of psychologists.",
    location: "Online (Google Meet)",
  },
  {
    id: 3,
    title: "Assistive Technology Fair",
    date: "2024-09-05",
    image: "/window.svg",
    summary: "Explore the latest in assistive technology for learning and communication.",
    details: "Discover new tools and devices that can help children with diverse abilities thrive. Live demos, expert talks, and hands-on experience for all attendees.",
    location: "MieT Center, Delhi NCR",
  },
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState(null as typeof events[0] | null);
  return (
    <>
      <TopBar />
      <main style={{ background: '#f7fafc', minHeight: '80vh', padding: '2.5rem 0' }}>
        <section style={{ maxWidth: 1000, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e2e8f0', padding: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#22543d', marginBottom: 18, textAlign: 'center' }}>Upcoming Events</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
            {events.map(event => (
              <div key={event.id} style={{ flex: '1 1 280px', minWidth: 280, maxWidth: 340, background: '#f7fafc', borderRadius: 14, boxShadow: '0 2px 8px #e2e8f0', padding: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s' }} onClick={() => setSelectedEvent(event)}>
                <img src={event.image} alt={event.title} style={{ width: '100%', maxWidth: 220, height: 120, objectFit: 'cover', borderRadius: 10, marginBottom: 14, background: '#fff' }} />
                <div style={{ fontWeight: 700, color: '#22543d', fontSize: 20, marginBottom: 6 }}>{event.title}</div>
                <div style={{ color: '#5a67d8', fontSize: 15, marginBottom: 8 }}>{new Date(event.date).toLocaleDateString()}</div>
                <div style={{ color: '#444', fontSize: 15, marginBottom: 8, textAlign: 'center' }}>{event.summary}</div>
                <div style={{ color: '#22543d', fontSize: 14, fontWeight: 600 }}>{event.location}</div>
              </div>
            ))}
          </div>
        </section>
        {/* Event Modal */}
        {selectedEvent && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,37,77,0.45)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { if (e.target === e.currentTarget) setSelectedEvent(null); }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #5a67d855', padding: '2.5rem 2rem 2rem 2rem', minWidth: 320, maxWidth: 420, position: 'relative', outline: 'none' }}>
              <button aria-label="Close modal" onClick={() => setSelectedEvent(null)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 26, color: '#5a67d8', cursor: 'pointer' }}>×</button>
              <img src={selectedEvent.image} alt={selectedEvent.title} style={{ width: '100%', maxWidth: 260, height: 120, objectFit: 'cover', borderRadius: 10, marginBottom: 16, background: '#fff' }} />
              <h2 style={{ color: '#22543d', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>{selectedEvent.title}</h2>
              <div style={{ color: '#5a67d8', fontSize: 16, marginBottom: 8 }}>{new Date(selectedEvent.date).toLocaleDateString()}</div>
              <div style={{ color: '#444', fontSize: 16, marginBottom: 12 }}>{selectedEvent.details}</div>
              <div style={{ color: '#22543d', fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{selectedEvent.location}</div>
              <button style={{ background: '#5a67d8', color: '#fff', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer', marginTop: 8 }}>Book Now</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
