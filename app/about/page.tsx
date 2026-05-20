'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const timeline = [
  { year: '2020', title: 'The Beginning', desc: 'Stambhix was founded with a vision to bridge the gap between digital and local services.' },
  { year: '2021', title: 'First 100 Clients', desc: 'Reached our first 100 clients milestone with a focus on web development and UI/UX design.' },
  { year: '2022', title: 'Expanded to Home Services', desc: 'Launched the home services vertical — plumbing, electrical, carpentry — with verified professionals.' },
  { year: '2023', title: 'Pan-India Presence', desc: 'Expanded operations to 15+ cities with 50+ expert professionals on the platform.' },
  { year: '2024', title: 'AI-Powered Platform', desc: 'Integrated AI-driven service recommendations and launched our mobile app ecosystem.' },
  { year: '2025', title: 'The Future', desc: 'Scaling globally with new service categories, enterprise partnerships, and community initiatives.' },
];

const team = [
  { name: 'Arjun Mehta', role: 'CEO & Founder', avatar: 'AM', bio: 'Visionary entrepreneur with 15+ years in tech. Building the future of service marketplaces.' },
  { name: 'Priya Sharma', role: 'CTO', avatar: 'PS', bio: 'Full-stack architect and AI enthusiast. Leads our engineering and product innovation.' },
  { name: 'Rahul Verma', role: 'COO', avatar: 'RV', bio: 'Operations expert ensuring seamless service delivery across all our verticals.' },
  { name: 'Neha Patel', role: 'Head of Design', avatar: 'NP', bio: 'Award-winning designer creating intuitive and beautiful user experiences.' },
  { name: 'Vikram Singh', role: 'VP of Engineering', avatar: 'VS', bio: 'Scales distributed systems and leads our platform engineering team.' },
  { name: 'Ananya Gupta', role: 'Head of Marketing', avatar: 'AG', bio: 'Growth strategist driving brand awareness and customer acquisition.' },
  { name: 'Rajesh Kumar', role: 'VP of Operations', avatar: 'RK', bio: 'Ensures quality and reliability across our home services network.' },
  { name: 'Deepika Reddy', role: 'Head of Customer Success', avatar: 'DR', bio: 'Customer-obsessed leader building world-class support experiences.' },
];

const values = [
  { icon: '🎯', title: 'Excellence', desc: 'We settle for nothing less than the best in every service we deliver.' },
  { icon: '🤝', title: 'Trust', desc: 'Every professional is verified. Every transaction is secure. Every review is authentic.' },
  { icon: '💡', title: 'Innovation', desc: 'We leverage cutting-edge technology to make service booking seamless and smart.' },
  { icon: '🌍', title: 'Community', desc: 'We empower local professionals and build thriving local economies.' },
];

function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <div ref={ref} className="text-center mb-16">
      <motion.span initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
        className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-4"
      >{label}</motion.span>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4"
      >{title}</motion.h2>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
        className="text-secondary max-w-2xl mx-auto text-lg"
      >{subtitle}</motion.p>
    </div>
  );
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-[#D4A853]/8 rounded-full blur-[120px]" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-6"
          >About Us</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight"
          >
            We&apos;re on a Mission to{' '}
            <span className="gold-text-gradient">Transform Services</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-secondary text-lg max-w-3xl mx-auto leading-relaxed"
          >
            Stambhix is India&apos;s first unified platform connecting you with verified professionals for both digital and home services. We believe in making expert service access simple, trustworthy, and affordable for everyone.
          </motion.p>
        </div>
      </section>

      {/* Story / Mission */}
      <section className="relative py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="relative">
                <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#D4A853]/20 to-transparent border border-[#D4A853]/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">✦</div>
                    <div className="text-[#D4A853] text-lg font-medium">Est. 2020</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 gold-gradient rounded-2xl opacity-10" />
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-4">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                From a Bold Idea to a{' '}
                <span className="gold-text-gradient">Nationwide Movement</span>
              </h2>
              <div className="space-y-4 text-secondary leading-relaxed">
                <p>Stambhix was born from a simple observation: finding trusted professionals for services — whether building a website or fixing a leaky pipe — was broken. Fragmented. Untrustworthy.</p>
                <p>We set out to build a platform that brings together the best digital talent and local service professionals under one roof. Every professional is verified, every review is authentic, and every transaction is secure.</p>
                <p>Today, we serve thousands of clients across 15+ cities, with a team of 50+ experts dedicated to delivering excellence in every service we touch.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Values" title="What Drives Us Every Day" subtitle="These core principles guide every decision we make and every service we deliver." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1}>
                <div className="group p-6 rounded-2xl bg-card border border-primary hover:border-[#D4A853]/20 transition-all duration-500 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{v.icon}</div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{v.title}</h3>
                  <p className="text-secondary text-sm">{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-20 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Journey" title="How We Got Here" subtitle="The milestones that shaped Stambhix into what it is today." />
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4A853]/40 via-[#D4A853]/20 to-transparent" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <FadeIn key={item.year} delay={i * 0.1} className="relative pl-20">
                  <div className="absolute left-5 top-1 w-6 h-6 rounded-full border-2 border-[#D4A853] bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#D4A853]" />
                  </div>
                  <span className="text-[#D4A853] text-sm font-bold tracking-wider">{item.year}</span>
                  <h3 className="text-xl font-semibold text-primary mt-1 mb-2">{item.title}</h3>
                  <p className="text-secondary leading-relaxed">{item.desc}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Our Team" title="Meet the People Behind Stambhix" subtitle="A passionate team of innovators, creators, and problem-solvers." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.05}>
                <div className="group p-6 rounded-2xl bg-card border border-primary hover:border-[#D4A853]/20 transition-all duration-500 text-center">
                  <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {member.avatar}
                  </div>
                  <h3 className="text-primary font-semibold">{member.name}</h3>
                  <p className="text-[#D4A853] text-sm mb-3">{member.role}</p>
                  <p className="text-secondary text-xs leading-relaxed">{member.bio}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Ready to Work with Us?
            </h2>
            <p className="text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses and homeowners who trust Stambhix for their service needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services" className="px-8 py-3.5 gold-gradient text-black font-semibold rounded-xl hover:scale-105 transition-transform">
                Explore Services
              </Link>
              <Link href="/#contact" className="px-8 py-3.5 border border-[#D4A853]/30 text-[#D4A853] font-semibold rounded-xl hover:bg-[#D4A853]/10 transition-all">
                Get in Touch
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
