'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const achievements = [
  {
    title: 'Company Founded',
    description: 'Stambhix Tech Agency was established with a vision to deliver quality digital services.',
    icon: '🚀',
    date: '2025',
    category: 'milestone',
  },
  {
    title: 'First Project Live',
    description: 'Our very first client project — learning, building, and delivering with passion.',
    icon: '💻',
    date: '2025',
    category: 'milestone',
  },
  {
    title: 'Building Our Team',
    description: 'Assembling a dedicated team of passionate developers, designers, and strategists.',
    icon: '👥',
    date: '2025',
    category: 'growth',
  },
  {
    title: 'Learning & Growing',
    description: 'Every day is a school day. We invest in learning the latest tech to serve you better.',
    icon: '📚',
    date: '2025',
    category: 'growth',
  },
  {
    title: 'Open for Business',
    description: 'Ready to take on projects! Web development, apps, design — we do it all.',
    icon: '🎯',
    date: '2025',
    category: 'milestone',
  },
  {
    title: 'Your Project Could Be Next',
    description: 'We\'re looking for our first clients to partner with. Let\'s grow together!',
    icon: '🤝',
    date: '2025',
    category: 'recognition',
  },
];

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function StambhixAchievements() {
  return (
    <section className="relative py-24 bg-secondary overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-[#D4A853]/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 grid-pattern opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-4"
          >
            Our Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4"
          >
            Milestones & <span className="gold-text-gradient">Achievements</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-secondary max-w-2xl mx-auto text-lg"
          >
            Every big journey starts with a single step. Here&apos;s where our story begins.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="group relative p-6 rounded-2xl bg-card border border-primary hover:border-[#D4A853]/20 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4A853]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</div>
                    <span className="text-xs font-medium text-[#D4A853] bg-[#D4A853]/10 px-2 py-0.5 rounded-full capitalize">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-[#D4A853]/90 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed mb-3">{item.description}</p>
                  <div className="flex items-center gap-2 text-xs text-tertiary">
                    <span>📅 {item.date}</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4A853]/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn className="text-center mt-12">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-6 py-3 gold-gradient text-black font-semibold rounded-xl hover:scale-105 transition-transform"
          >
            Meet Our Team
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
