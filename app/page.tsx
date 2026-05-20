'use client';

import StambhixHero from './components/StambhixHero';
import StambhixServices from './components/StambhixServices';
import StambhixStats from './components/StambhixStats';
import StambhixTestimonials from './components/StambhixTestimonials';
import StambhixContact from './components/StambhixContact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      {/* Sections */}
      <StambhixHero />
      <StambhixServices />
      <StambhixStats />
      <StambhixTestimonials />
      <StambhixContact />

      <Footer />

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-black shadow-lg shadow-[#D4A853]/20 hover:scale-110 transition-transform duration-300"
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}
