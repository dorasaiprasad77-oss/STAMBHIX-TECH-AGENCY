'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const testimonials = [
  {
    name: 'Rajesh Mehta',
    role: 'Founder, TechVentures',
    content: 'Stambhix built our entire e-commerce platform from scratch. The team was professional, delivered on time, and the results exceeded our expectations. Highly recommend!',
    rating: 5,
    initials: 'RM',
  },
  {
    name: 'Priya Sharma',
    role: 'Homeowner, Bangalore',
    content: 'Booked a plumber through Stambhix and was amazed by the quality. Fast response, fair pricing, and the work was done perfectly. This is my go-to platform now.',
    rating: 5,
    initials: 'PS',
  },
  {
    name: 'Amit Patel',
    role: 'CEO, GrowthLabs',
    content: 'Their SEO services transformed our online presence. We went from page 5 to page 1 in just 3 months. The ROI has been incredible. Thank you, Stambhix!',
    rating: 5,
    initials: 'AP',
  },
  {
    name: 'Sneha Reddy',
    role: 'Design Lead, CreativeStudio',
    content: 'The UI/UX design team at Stambhix understood our vision perfectly. They created a beautiful, intuitive interface that our users love. True professionals.',
    rating: 5,
    initials: 'SR',
  },
  {
    name: 'Vikram Singh',
    role: 'Small Business Owner',
    content: 'From web development to office electrical work, Stambhix handled everything. It is so convenient to have one trusted platform for all my business needs.',
    rating: 4,
    initials: 'VS',
  },
];

const steps = [
  { step: '01', title: 'Search Service', desc: 'Browse through our wide range of tech and home services. Use filters to find exactly what you need.', icon: '🔍' },
  { step: '02', title: 'Book Expert', desc: 'Choose from verified professionals, compare ratings, and book instantly at your preferred time.', icon: '📅' },
  { step: '03', title: 'Get Work Done', desc: 'Sit back while our experts deliver quality work. Track progress in real-time and pay only when satisfied.', icon: '✅' },
];

const techStack = [
  { name: 'React', icon: '⚛️', category: 'Frontend' },
  { name: 'Next.js', icon: '▲', category: 'Framework' },
  { name: 'Node.js', icon: '🟢', category: 'Backend' },
  { name: 'MongoDB', icon: '🍃', category: 'Database' },
  { name: 'TypeScript', icon: '📘', category: 'Language' },
  { name: 'Tailwind CSS', icon: '🎨', category: 'Styling' },
  { name: 'AWS', icon: '☁️', category: 'Cloud' },
  { name: 'Docker', icon: '🐳', category: 'DevOps' },
];

export default function StambhixTestimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <>
      {/* How It Works */}
      <section className="relative py-24 bg-secondary">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#D4A853]/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-4"
            >
              How It Works
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4"
            >
              Three Simple Steps
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-secondary max-w-2xl mx-auto text-lg"
            >
              Getting started with Stambhix is as easy as 1-2-3.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center group"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-7xl font-bold text-primary/[0.03] select-none">
                  {step.step}
                </div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gold-gradient flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">{step.title}</h3>
                <p className="text-secondary leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 -right-4 text-2xl text-[#D4A853]/30">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative py-20 bg-primary">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-bold text-primary text-center mb-12"
          >
            Powered by <span className="gold-text-gradient">Modern Technology</span>
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-6">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group px-5 py-3 rounded-xl border border-primary bg-card hover:border-[#D4A853]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{tech.icon}</span>
                  <div className="text-left">
                    <div className="text-primary text-sm font-medium">{tech.name}</div>
                    <div className="text-tertiary text-xs">{tech.category}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 bg-secondary">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4A853]/5 rounded-full blur-[120px]" />
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
              Testimonials
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4"
            >
              What Our <span className="gold-text-gradient">Clients Say</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-secondary max-w-2xl mx-auto text-lg"
            >
              Don&apos;t take our word for it. Here&apos;s what our clients have to say.
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative min-h-[280px]">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  animate={activeTestimonial === i ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute inset-0 ${activeTestimonial === i ? 'relative' : 'absolute pointer-events-none'}`}
                >
                  <div className="glass rounded-2xl p-8 md:p-10">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(t.rating)].map((_, j) => (
                        <svg key={j} className="w-5 h-5 text-[#D4A853]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-primary text-lg leading-relaxed mb-8 italic opacity-80">&ldquo;{t.content}&rdquo;</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-black font-bold">
                        {t.initials}
                      </div>
                      <div>
                        <div className="text-primary font-semibold">{t.name}</div>
                        <div className="text-secondary text-sm">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeTestimonial === i
                      ? 'bg-[#D4A853] w-8'
                      : 'bg-primary hover:opacity-60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
