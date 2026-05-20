'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const services = [
  {
    category: '🚀 Tech Services',
    items: [
      { title: 'Web Development', desc: 'Custom websites & web applications built with cutting-edge tech stacks', icon: '💻' },
      { title: 'App Development', desc: 'Native & cross-platform mobile applications for iOS and Android', icon: '📱' },
      { title: 'UI/UX Design', desc: 'User-centered designs that blend beauty with functionality', icon: '🎨' },
      { title: 'SEO Optimization', desc: 'Data-driven SEO strategies to boost your online visibility', icon: '📈' },
      { title: 'Graphic Design', desc: 'Brand identity, logos, and visual content that stands out', icon: '✨' },
      { title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure and DevOps solutions', icon: '☁️' },
    ],
  },
  {
    category: '🏠 Home Services',
    items: [
      { title: 'Plumbing', desc: 'Expert plumbing services — installation, repair & maintenance', icon: '🔧' },
      { title: 'Electrical', desc: 'Certified electricians for safe and reliable electrical work', icon: '⚡' },
      { title: 'Carpentry', desc: 'Custom furniture, fittings, and woodwork by skilled carpenters', icon: '🪚' },
      { title: 'Painting', desc: 'Professional painting services for homes and offices', icon: '🎭' },
      { title: 'Cleaning', desc: 'Deep cleaning, sanitization & maintenance for spotless spaces', icon: '🧹' },
      { title: 'AC & Appliances', desc: 'Repair and servicing of ACs, refrigerators & home appliances', icon: '❄️' },
    ],
  },
];

function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="text-center mb-16">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-4"
      >
        {label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-secondary max-w-2xl mx-auto text-lg"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

function ServiceCard({ title, desc, icon, index }: { title: string; desc: string; icon: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative p-6 rounded-2xl bg-card border border-primary hover:border-[#D4A853]/20 hover:bg-card-hover transition-all duration-500"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4A853]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-[#D4A853]/90 transition-colors">{title}</h3>
        <p className="text-secondary text-sm leading-relaxed">{desc}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4A853]/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
}

export default function StambhixServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="relative py-24 bg-primary">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-[#D4A853]/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <SectionHeading
          label="Our Services"
          title="Everything You Need Under One Roof"
          subtitle="From digital transformation to home comfort — we bring you verified professionals for every service."
        />

        {services.map((category, ci) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: ci * 0.2 }}
            className="mb-14 last:mb-0"
          >
            <h3 className="text-xl font-semibold text-[#D4A853] mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-[#D4A853]/40" />
              {category.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((service, i) => (
                <ServiceCard
                  key={service.title}
                  {...service}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        ))}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-secondary mb-6">Need a custom solution? We&apos;ve got you covered.</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 gold-gradient text-black font-semibold rounded-xl hover:scale-105 transition-transform duration-300"
          >
            Book a Free Consultation
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
