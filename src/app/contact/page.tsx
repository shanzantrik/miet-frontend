'use client';

import React, { useState } from 'react';
import TopBar from '../../components/TopBar';
import Footer from '../../components/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <>
      <TopBar />
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1rem', display: 'flex', flexWrap: 'wrap', gap: 48 }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-accent-alt)', marginBottom: 18 }}>Contact Us</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 24 }}>
            We&apos;d love to hear from you! Fill out the form below and our team will get back to you soon.
          </p>
          {submitted ? (
            <div style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 20, marginTop: 32 }}>Thank you for contacting us! We&apos;ll be in touch soon.</div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }}
                />
              </label>
              <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }}
                />
              </label>
              <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                Phone
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }}
                />
              </label>
              <label style={{ fontWeight: 600, color: 'var(--text-accent-alt)' }}>
                Message
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid var(--border)', marginTop: 4, minHeight: 80 }}
                />
              </label>
              <button
                type="submit"
                style={{ background: 'var(--accent)', color: 'var(--text-on-accent)', border: 'none', borderRadius: 8, padding: '1rem 2rem', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginTop: 8 }}
              >
                Send Message
              </button>
            </form>
          )}
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-accent-alt)', marginBottom: 8 }}>Our Address</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.6 }}>
              214, Tower A, Spazedge,<br />
              Badshahpur Sohna Road Highway,<br />
              Malibu Town, Sector 47,<br />
              Gurugram, Haryana, India,<br />
              Pin Code 122018
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 17, marginTop: 12 }}>
              <b>Phone:</b> 9319027664
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 17, marginTop: 12 }}>
              <b>Hours:</b> 10:00 am – 07:00 pm (Open today)
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <iframe
            title="MieT Location Map"
            src="https://www.google.com/maps?q=214+Tower+A+Spazedge+Badshahpur+Sohna+Road+Highway+Malibu+Town+Sector+47+Gurugram+Haryana+India+122018&output=embed"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: 12 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
      <Footer />
    </>
  );
}
