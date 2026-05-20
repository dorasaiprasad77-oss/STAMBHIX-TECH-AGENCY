'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const defaultStats = [
  { number: '0→1', label: 'First Client Soon', icon: '🤝' },
  { number: 'In Progress', label: 'Projects Building', icon: '🚀' },
  { number: '2', label: 'Founders', icon: '⭐' },
  { number: 'Starting', label: 'Our Journey', icon: '📍' },
  { number: '100%', label: 'Dedication', icon: '💯' },
  { number: 'Always', label: 'Available to Help', icon: '🔄' },
];

const usps = [
  {
    title: 'Verified Professionals',
    desc: 'Every service provider is thoroughly vetted, background-checked, and rated by real customers.',
    icon: '✅',
  },
  {
    title: 'Tech + Home Services',
    desc: 'The only platform that brings together digital services and home services in one seamless ecosystem.',
    icon: '🔄',
  },
  {
    title: 'Fast & Reliable',
    desc: 'Instant booking, real-time tracking, and on-time service delivery guaranteed.',
    icon: '⚡',
  },
  {
    title: 'Affordable Pricing',
    desc: 'Transparent pricing with no hidden charges. Get the best value for every service.',
    icon: '💰',
  },
  {
    title: 'Secure Platform',
    desc: 'End-to-end encrypted payments, secure data handling, and verified reviews.',
    icon: '🔒',
  },
  {
    title: '24/7 Support',
    desc: 'Our dedicated support team is always available to assist you, day or night.',
    icon: '🎯',
  },
];

export default function StambhixStats() {
  const [stats, setStats] = useState(defaultStats);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-50px' });

  useEffect(() => {
    fetch(`/api/settings`)
      .then((res) => res.ok ? res.json() : null)
      .then((json) => {
        if (json?.map) {
          const m = json.map;
          setStats([
            { number: `${m.trusted_clients || '0→1'}`, label: 'First Client Soon', icon: '🤝' },
            { number: `${m.projects_delivered || 'In Progress'}`, label: 'Projects Building', icon: '🚀' },
            { number: `${m.expert_professionals || '2'}`, label: 'Founders', icon: '⭐' },
            { number: `${m.cities_covered || 'Starting'}`, label: 'Our Journey', icon: '📍' },
            { number: `${m.client_satisfaction || '100%'}`, label: 'Dedication', icon: '💯' },
            { number: `${m.support_hours || 'Always'}`, label: 'Available to Help', icon: '🔄' },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const uspRef = useRef(null);
  const uspInView = useInView(uspRef, { once: true, margin: '-100px' });

  return (
    <>
      {/* Stats Section */}
      <section className="relative py-24 bg-secondary">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#D4A853]/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={statsRef}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold gold-text-gradient mb-1">{stat.number}</div>
                <div className="text-secondary text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="relative py-24 bg-primary">
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={uspRef}>
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={uspInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-4"
            >
              Why Stambhix
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={uspInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4"
            >
              Built Different. <span className="gold-text-gradient">Built Better.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={uspInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-secondary max-w-2xl mx-auto text-lg"
            >
              We&apos;re not just another service platform. Here&apos;s what sets us apart.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usps.map((usp, i) => (
              <motion.div
                key={usp.title}
                initial={{ opacity: 0, y: 30 }}
                animate={uspInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-primary hover:border-[#D4A853]/20 transition-all duration-500"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{usp.icon}</div>
                <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-[#D4A853]/90 transition-colors">{usp.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{usp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
