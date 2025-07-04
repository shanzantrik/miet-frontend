"use client";
import TopBar from '../components/TopBar';
import WelcomeBoard from '../components/WelcomeBoard';
import SearchPanel from '../components/SearchPanel';
import FeaturedSection from '../components/FeaturedSection';
import MarketplaceSection from '../components/MarketplaceSection';
import CTASection from '../components/CTASection';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';
import '@fontsource/righteous';
import '@fontsource/josefin-sans';

export default function Home() {
  return (
    <>
      <TopBar />
      <WelcomeBoard />
      <SearchPanel />
      <FeaturedSection />
      {/* Miet Intro + CTA for About Us */}
      <section style={{ background: '#f7fafc', padding: '2.5rem 0', textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'Righteous, cursive', color: '#22543d', fontSize: 32, fontWeight: 700, marginBottom: 16 }}>About MieT</h2>
        <p style={{ maxWidth: 700, margin: '0 auto 24px', color: '#5a67d8', fontSize: 24, lineHeight: 1.7, letterSpacing: 0.2, fontWeight: 500 }}>
          MieT (मीत) is a tech-enabled platform based in Gurgaon, empowering individuals with diverse abilities through personalized Special Education, Mental Health Services, and Counselling. Our mission is to unlock potential, nurture growth, and build an inclusive community for all.
        </p>
        <a href="/about" style={{ display: 'inline-block', background: '#5a67d8', color: '#fff', borderRadius: 8, padding: '14px 36px', fontWeight: 700, fontSize: 20, textDecoration: 'none', marginTop: 8, boxShadow: '0 2px 12px #5a67d822' }}>
          Know More
        </a>
      </section>
      <MarketplaceSection />
      <CTASection />
      <BlogSection />
      <Footer />
    </>
  );
}
