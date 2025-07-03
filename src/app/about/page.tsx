"use client";
import AboutSection from '../../components/AboutSection';
import TopBar from '../../components/TopBar';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <main style={{ minHeight: '60vh', background: '#f7fafc', padding: '32px 0' }}>
        <h1 style={{ textAlign: 'center', color: '#22543d', fontFamily: 'Righteous, cursive', fontSize: 36, fontWeight: 800, marginBottom: 32 }}>About Us</h1>
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
