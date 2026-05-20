'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  bio: string;
  avatar: string;
  socialLinks: { linkedin: string; twitter: string; github: string; website: string };
  order: number;
  isActive: boolean;
}

interface Achievement {
  _id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  category: string;
  metric: string;
  metricValue: string;
  order: number;
  isActive: boolean;
}

const fallbackMembers: TeamMember[] = [
  {
    _id: '1', name: 'Sai Prasad Dora', position: 'Founder & Developer',
    bio: 'Passionate full-stack developer with expertise in React, Next.js, Node.js, and MongoDB. Building Stambhix from the ground up with dedication.',
    avatar: '', socialLinks: { linkedin: '#', twitter: '#', github: '#', website: '#' },
    order: 0, isActive: true,
  },
  {
    _id: '2', name: 'Your Name Could Be Here', position: 'Looking for Team Members',
    bio: 'We are looking for talented developers, designers, and marketers to join our growing team.',
    avatar: '', socialLinks: { linkedin: '#', twitter: '#', github: '#', website: '#' },
    order: 1, isActive: true,
  },
];

const fallbackAchievements: Achievement[] = [
  { _id: 'a1', title: 'Company Founded', description: 'Stambhix Tech Agency was officially launched.', date: '2025-01-01', icon: '🚀', category: 'milestone', metric: '', metricValue: '', order: 0, isActive: true },
  { _id: 'a2', title: 'First Project Underway', description: 'Building our first client project with love and care.', date: '2025-02-01', icon: '💻', category: 'milestone', metric: '', metricValue: '', order: 1, isActive: true },
  { _id: 'a3', title: 'Learning & Growing', description: 'Continuously learning new technologies to deliver the best solutions.', date: '2025-03-01', icon: '📚', category: 'growth', metric: '', metricValue: '', order: 2, isActive: true },
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

function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <div className="text-center mb-16">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-4"
      >{label}</motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4"
      >{title}</motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-secondary max-w-2xl mx-auto text-lg"
      >{subtitle}</motion.p>
    </div>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(fallbackMembers);
  const [achievements, setAchievements] = useState<Achievement[]>(fallbackAchievements);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const [memberError, setMemberError] = useState('');
  const [achievementError, setAchievementError] = useState('');

  useEffect(() => {
    // Try fetching from API, but fallback to hardcoded data is already set
    fetch(`/api/team`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load team');
        return res.json();
      })
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setMembers(json.data);
        }
        setLoadingMembers(false);
      })
      .catch(() => {
        // Using fallback data
        setLoadingMembers(false);
      });

    fetch(`/api/achievements`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load achievements');
        return res.json();
      })
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setAchievements(json.data);
        }
        setLoadingAchievements(false);
      })
      .catch(() => {
        // Using fallback data
        setLoadingAchievements(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 right-1/3 w-[600px] h-[600px] bg-[#D4A853]/8 rounded-full blur-[120px]" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-6"
          >Our People</motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight"
          >
            Meet the{' '}
            <span className="gold-text-gradient">Team</span> Behind Stambhix
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-secondary text-lg max-w-3xl mx-auto leading-relaxed"
          >
            We&apos;re a small but passionate team ready to help you build your digital presence. Every project is a chance to prove ourselves.
          </motion.p>
        </div>
      </section>

      {/* Team Members */}
      <section className="relative py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Team Members"
            title="Meet Our Founders"
            subtitle="We may be small now, but our ambition is limitless. Get to know the people behind Stambhix."
          />

          {loadingMembers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-primary animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-card-hover mx-auto mb-4" />
                  <div className="w-24 h-5 bg-card-hover rounded mx-auto mb-2" />
                  <div className="w-20 h-4 bg-card-hover rounded mx-auto mb-3" />
                  <div className="w-full h-3 bg-inset rounded mx-auto mb-1" />
                  <div className="w-3/4 h-3 bg-inset rounded mx-auto" />
                </div>
              ))}
            </div>
          ) : memberError ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-secondary text-sm mb-2">Could not load team members.</p>
              <p className="text-tertiary text-xs">Add team members via the admin panel at <span className="text-[#D4A853]">/admin/content</span></p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">👥</div>
              <p className="text-secondary text-lg mb-2">No team members added yet.</p>
              <p className="text-tertiary text-sm">Add team members via the <span className="text-[#D4A853]">/admin/content</span> panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {members.map((member, i) => (
                <FadeIn key={member._id} delay={i * 0.05}>
                  <div className="group p-6 rounded-2xl bg-card border border-primary hover:border-[#D4A853]/20 transition-all duration-500 text-center">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover mx-auto mb-4 group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <h3 className="text-primary font-semibold">{member.name}</h3>
                    <p className="text-[#D4A853] text-sm mb-3">{member.position}</p>
                    {member.bio && (
                      <p className="text-secondary text-xs leading-relaxed mb-4">{member.bio}</p>
                    )}
                    {/* Social links */}
                    {(member.socialLinks?.linkedin || member.socialLinks?.twitter || member.socialLinks?.github) && (
                      <div className="flex justify-center gap-2 pt-2 border-t border-primary">
                        {member.socialLinks.linkedin && (
                          <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 rounded-lg bg-card-hover flex items-center justify-center text-tertiary hover:text-[#D4A853] hover:border-[#D4A853]/30 border border-primary transition-all text-xs"
                            aria-label={`${member.name} LinkedIn`}
                          >in</a>
                        )}
                        {member.socialLinks.twitter && (
                          <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 rounded-lg bg-card-hover flex items-center justify-center text-tertiary hover:text-[#D4A853] hover:border-[#D4A853]/30 border border-primary transition-all text-xs"
                            aria-label={`${member.name} Twitter`}
                          >𝕏</a>
                        )}
                        {member.socialLinks.github && (
                          <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 rounded-lg bg-card-hover flex items-center justify-center text-tertiary hover:text-[#D4A853] hover:border-[#D4A853]/30 border border-primary transition-all text-xs"
                            aria-label={`${member.name} GitHub`}
                          >GH</a>
                        )}
                      </div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Achievements */}
      <section className="relative py-20">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Achievements"
            title="Our Journey So Far"
            subtitle="Every big journey starts small. Here are our milestones on the road to building something great."
          />

          {loadingAchievements ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-primary animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-card-hover mb-4" />
                  <div className="w-32 h-5 bg-card-hover rounded mb-2" />
                  <div className="w-full h-3 bg-inset rounded mb-1" />
                  <div className="w-3/4 h-3 bg-inset rounded" />
                </div>
              ))}
            </div>
          ) : achievementError ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-secondary text-sm mb-2">Could not load achievements.</p>
              <p className="text-tertiary text-xs">Add achievements via the admin panel at <span className="text-[#D4A853]">/admin/content</span></p>
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🏆</div>
              <p className="text-secondary text-lg mb-2">No achievements added yet.</p>
              <p className="text-tertiary text-sm">Add achievements via the <span className="text-[#D4A853]">/admin/content</span> panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((item, i) => (
                <FadeIn key={item._id} delay={i * 0.05}>
                  <div className="group relative p-6 rounded-2xl bg-card border border-primary hover:border-[#D4A853]/20 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4A853]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl group-hover:scale-110 transition-transform">{item.icon || '🏆'}</div>
                        {item.category && (
                          <span className="text-xs font-medium text-[#D4A853] bg-[#D4A853]/10 px-2 py-0.5 rounded-full capitalize">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-[#D4A853]/90 transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-secondary text-sm leading-relaxed mb-3">{item.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs">
                        {item.date && (
                          <span className="text-tertiary">
                            {new Date(item.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                          </span>
                        )}
                        {item.metric && item.metricValue && (
                          <span className="text-[#D4A853] font-semibold">
                            {item.metric}: {item.metricValue}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4A853]/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-primary mb-4">Want to Join Our Team?</h2>
            <p className="text-secondary text-lg mb-8">
              We&apos;re always looking for talented individuals who share our passion for innovation and excellence.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 gold-gradient text-black font-semibold rounded-xl hover:scale-105 transition-transform"
            >
              Get in Touch
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
