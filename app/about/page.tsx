'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const timeline = [
  { year: '2025', title: 'The Beginning', desc: 'Stambhix Tech Agency was founded with a vision to deliver quality digital services to businesses of all sizes.' },
  { year: '2025', title: 'First Project', desc: 'Building and launching our very first client project — learning and growing with every line of code.' },
  { year: '2025', title: 'Team Formation', desc: 'Assembling a passionate team of developers, designers, and strategists who share our vision.' },
  { year: '2025', title: 'Looking Ahead', desc: 'Eager to take on new challenges, serve our first clients, and build a reputation for excellence.' },
];

const team = [
  { name: 'Sai Prasad Dora', role: 'Founder & Developer', avatar: 'SP', bio: 'Passionate about building beautiful, functional web experiences. Full-stack developer and founder of Stambhix.' },
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
                    <div className="text-[#D4A853] text-lg font-medium">Est. 2025</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 gold-gradient rounded-2xl opacity-10" />
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-4">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                From a Bold Idea to a{' '}
                <span className="gold-text-gradient">Growing Agency</span>
              </h2>
              <div className="space-y-4 text-secondary leading-relaxed">
                <p>Stambhix Tech Agency was born from a simple observation: finding a reliable digital partner should be easy. Whether you need a website, an app, or a complete digital presence — you deserve a team that cares.</p>
                <p>We may be a small team starting out, but we bring big energy, fresh ideas, and a commitment to quality that rivals the best in the industry. Every project we take on gets our full attention and dedication.</p>
                <p>We believe in honest work, transparent communication, and building long-term relationships with our clients. Your success is our success — and we can&apos;t wait to grow together.</p>
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
              We're a small but passionate team ready to help you build your digital presence. Let's grow together.
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
