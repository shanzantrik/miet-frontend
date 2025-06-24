"use client";
import TopBar from '../components/TopBar';
import WelcomeBoard from '../components/WelcomeBoard';
import SearchPanel from '../components/SearchPanel';
import FeaturedSection from '../components/FeaturedSection';
import AboutSection from '../components/AboutSection';
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
      <AboutSection />
      <MarketplaceSection />
      <CTASection />
      <BlogSection />
      <Footer />
    </>
  );
}
