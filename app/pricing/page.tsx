'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const plans = [
  {
    name: 'Starter',
    desc: 'Perfect for small businesses and startups looking to establish their digital presence.',
    price: '29,999',
    period: 'project',
    popular: false,
    features: [
      { text: '5-Page Responsive Website', included: true },
      { text: 'Basic SEO Setup', included: true },
      { text: 'Contact Form Integration', included: true },
      { text: 'Social Media Links', included: true },
      { text: '1 Month Support', included: true },
      { text: 'Custom Animations', included: false },
      { text: 'E-Commerce Integration', included: false },
      { text: 'Priority Support', included: false },
      { text: 'Dedicated Project Manager', included: false },
    ],
  },
  {
    name: 'Growth',
    desc: 'Ideal for growing businesses that need a comprehensive digital strategy.',
    price: '79,999',
    period: 'project',
    popular: true,
    features: [
      { text: '10-Page Custom Website', included: true },
      { text: 'Advanced SEO & Analytics', included: true },
      { text: 'CMS Integration', included: true },
      { text: 'Custom Animations', included: true },
      { text: '3 Months Support', included: true },
      { text: 'E-Commerce Integration', included: true },
      { text: 'API Integrations (up to 3)', included: true },
      { text: 'Priority Support', included: false },
      { text: 'Dedicated Project Manager', included: false },
    ],
  },
  {
    name: 'Enterprise',
    desc: 'For established businesses and enterprises needing end-to-end digital solutions.',
    price: '1,99,999',
    period: 'project',
    popular: false,
    features: [
      { text: 'Unlimited Pages', included: true },
      { text: 'Full SEO Suite', included: true },
      { text: 'Advanced CMS', included: true },
      { text: 'Custom Animations & Interactions', included: true },
      { text: '12 Months Support', included: true },
      { text: 'Full E-Commerce Suite', included: true },
      { text: 'Unlimited API Integrations', included: true },
      { text: '24/7 Priority Support', included: true },
      { text: 'Dedicated Project Manager', included: true },
    ],
  },
];

interface HomeServicePlan {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  popular?: boolean;
}

const homeServicePlans: HomeServicePlan[] = [
  {
    name: 'Basic',
    price: '299',
    period: 'visit',
    desc: 'One-time service visits for minor repairs and maintenance.',
    features: ['Inspection & Diagnosis', 'Minor Repairs', 'Basic Installation', '30-Day Warranty', 'Standard Time Slot'],
  },
  {
    name: 'Premium',
    price: '999',
    period: 'visit',
    desc: 'Comprehensive service with priority scheduling and extended warranty.',
    features: ['Full Service Package', 'Premium Parts Included', 'Priority Scheduling', '90-Day Warranty', 'Flexible Time Slots', 'Follow-up Visit'],
    popular: true,
  },
  {
    name: 'Annual',
    price: '5,999',
    period: 'year',
    desc: 'Year-round peace of mind with unlimited service calls and maintenance.',
    features: ['Unlimited Service Calls', 'Preventive Maintenance', 'Priority Scheduling', '365-Day Warranty', 'Same-Day Service', '10% Off Parts', 'Dedicated Support'],
  },
];

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4A853]/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-6"
          >Pricing</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight"
          >
            Transparent Pricing,{' '}
            <span className="gold-text-gradient">No Surprises</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-secondary text-lg max-w-3xl mx-auto leading-relaxed"
          >
            Choose the plan that fits your needs. Every plan includes our quality guarantee and dedicated support.
          </motion.p>
        </div>
      </section>

      {/* Digital Service Plans */}
      <section className="relative py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-4">Digital Services</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Web & App Development Plans</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Fixed-price project packages with clear deliverables. Custom quotes also available for complex requirements.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div className={`relative p-8 rounded-2xl border transition-all duration-500 ${
                  plan.popular
                    ? 'bg-[#D4A853]/5 border-[#D4A853]/30 shadow-lg shadow-[#D4A853]/5'
                    : 'bg-white/[0.03] border-white/[0.06] hover:border-[#D4A853]/20'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gold-gradient text-black text-xs font-bold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-gray-400 text-sm">{plan.desc}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                    <span className="text-gray-400 text-sm ml-1">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-3 text-sm">
                        <span className={f.included ? 'text-green-400 mt-0.5' : 'text-gray-600 mt-0.5'}>
                          {f.included ? '✓' : '✗'}
                        </span>
                        <span className={f.included ? 'text-gray-300' : 'text-gray-600'}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/#contact"
                    className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                      plan.popular
                        ? 'gold-gradient text-black hover:scale-[1.02]'
                        : 'border border-[#D4A853]/30 text-[#D4A853] hover:bg-[#D4A853]/10'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Note */}
          <p className="text-center text-gray-500 text-sm mt-8">
            * Prices are indicative. Final pricing depends on project scope and requirements. Contact us for a detailed quote.
          </p>
        </div>
      </section>

      {/* Home Service Plans */}
      <section className="relative py-20">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-4">Home Services</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Home Service Pricing</h2>
            <p className="text-secondary max-w-2xl mx-auto">Affordable pricing for all your home maintenance and repair needs. No hidden charges, ever.</p>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-gray-500'}`}>Per Visit</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${annual ? 'bg-[#D4A853]' : 'bg-white/[0.1]'}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${annual ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-gray-500'}`}>
              Annual{' '}
              <span className="text-[#D4A853] text-xs font-medium">Save 20%</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {homeServicePlans.map((plan, i) => {
              const isVisible = annual ? plan.name === 'Annual' : plan.name !== 'Annual';
              if (!isVisible) return null;
              return (
                <FadeIn key={plan.name} delay={i * 0.1}>
                  <div className={`relative p-8 rounded-2xl border transition-all duration-500 ${
                    plan.popular
                      ? 'bg-[#D4A853]/5 border-[#D4A853]/30 shadow-lg shadow-[#D4A853]/5'
                      : 'bg-white/[0.03] border-white/[0.06] hover:border-[#D4A853]/20'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gold-gradient text-black text-xs font-bold rounded-full whitespace-nowrap">
                        Best Value
                      </div>
                    )}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                      <p className="text-gray-400 text-sm">{plan.desc}</p>
                    </div>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                      <span className="text-gray-400 text-sm ml-1">/{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span className="text-primary/80">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/#contact"
                      className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                        plan.popular
                          ? 'gold-gradient text-black hover:scale-[1.02]'
                          : 'border border-[#D4A853]/30 text-[#D4A853] hover:bg-[#D4A853]/10'
                      }`}
                    >
                      Book Now
                    </Link>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-secondary">Everything you need to know about our pricing and process.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: 'What is included in the project price?', a: 'Each plan includes all services listed in its feature set. Additional requirements can be scoped separately and quoted accordingly.' },
              { q: 'How long does a typical project take?', a: 'Timelines vary by project scope. A standard website takes 2-4 weeks, while complex applications may take 8-12 weeks. We provide a detailed timeline in our proposal.' },
              { q: 'Do you offer custom pricing for unique requirements?', a: 'Absolutely! If our predefined plans don\'t fit your needs, we\'ll create a custom proposal tailored to your specific requirements.' },
              { q: 'What payment terms do you offer?', a: 'We typically work with a 50% upfront, 50% on completion model. For larger enterprise projects, we offer milestone-based payments.' },
              { q: 'Is there a warranty on your work?', a: 'Yes! We offer 30 days of bug fixes and support post-delivery for all our digital projects. Home services come with a minimum 30-day warranty on workmanship.' },
            ].map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <details className="group p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer">
                  <summary className="flex items-center justify-between text-primary font-medium list-none">
                    {faq.q}
                    <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-secondary text-sm leading-relaxed">{faq.a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-secondary text-lg mb-8">
            We&apos;re here to help you find the perfect plan. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <Link href="/#contact" className="px-8 py-3.5 gold-gradient text-black font-semibold rounded-xl hover:scale-105 transition-transform inline-block">
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
