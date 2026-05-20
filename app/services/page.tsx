'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const techServices = [
  {
    id: 'web',
    icon: '💻',
    title: 'Web Development',
    subtitle: 'Custom websites & web applications',
    desc: 'We build high-performance websites and web applications using cutting-edge technologies like React, Next.js, Node.js, and Python. From simple landing pages to complex SaaS platforms, our team delivers scalable, maintainable solutions.',
    features: ['Custom Web Applications', 'E-Commerce Platforms', 'CMS Development', 'API Development & Integration', 'Progressive Web Apps', 'Performance Optimization'],
    tech: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'AWS', 'Vercel'],
  },
  {
    id: 'app',
    icon: '📱',
    title: 'App Development',
    subtitle: 'Native & cross-platform mobile apps',
    desc: 'Our mobile development team creates stunning iOS and Android applications that users love. We use React Native and Flutter for cross-platform efficiency, and native technologies for performance-critical features.',
    features: ['iOS & Android Apps', 'Cross-Platform Development', 'App UI/UX Design', 'Backend Integration', 'Push Notifications', 'App Store Optimization'],
    tech: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'GraphQL'],
  },
  {
    id: 'design',
    icon: '🎨',
    title: 'UI/UX Design',
    subtitle: 'User-centered design that converts',
    desc: 'Great design is more than aesthetics — it\'s about creating intuitive experiences that drive results. Our design team combines research, creativity, and technology to craft interfaces that delight users and achieve business goals.',
    features: ['User Research & Testing', 'Wireframing & Prototyping', 'Visual Design', 'Design Systems', 'Interaction Design', 'Accessibility Audits'],
    tech: ['Figma', 'Sketch', 'Adobe XD', 'Framer', 'Prototyping', 'Usability Testing'],
  },
  {
    id: 'seo',
    icon: '📈',
    title: 'SEO & Digital Marketing',
    subtitle: 'Data-driven growth strategies',
    desc: 'We help businesses get found online through comprehensive SEO strategies, content marketing, and paid advertising. Our data-driven approach ensures measurable results and sustainable growth.',
    features: ['Technical SEO', 'Content Strategy', 'Link Building', 'Local SEO', 'PPC Advertising', 'Analytics & Reporting'],
    tech: ['Google Analytics', 'SEMrush', 'Ahrefs', 'Search Console', 'Tag Manager', 'Hotjar'],
  },
  {
    id: 'graphic',
    icon: '✨',
    title: 'Graphic Design & Branding',
    subtitle: 'Visual identities that leave a mark',
    desc: 'From logos to complete brand identities, our graphic designers create visual assets that communicate your brand story and captivate your audience.',
    features: ['Logo Design', 'Brand Identity', 'Social Media Graphics', 'Print Design', 'Packaging Design', 'Brand Guidelines'],
    tech: ['Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere Pro'],
  },
  {
    id: 'cloud',
    icon: '☁️',
    title: 'Cloud & DevOps',
    subtitle: 'Scalable infrastructure solutions',
    desc: 'We design, implement, and manage cloud infrastructure that scales with your business. From migration to monitoring, our DevOps engineers ensure your applications run smoothly 24/7.',
    features: ['Cloud Migration', 'CI/CD Pipeline', 'Infrastructure as Code', 'Monitoring & Alerting', 'Container Orchestration', 'Security Compliance'],
    tech: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
  },
];

const homeServices = [
  {
    id: 'plumbing',
    icon: '🔧',
    title: 'Plumbing',
    subtitle: 'Expert plumbing solutions',
    desc: 'From fixing a leaky tap to complete bathroom installations, our certified plumbers handle it all with precision and professionalism.',
    features: ['Pipe Repair & Replacement', 'Fixture Installation', 'Drain Cleaning', 'Water Heater Service', 'Bathroom Renovation', 'Emergency Repairs'],
  },
  {
    id: 'electrical',
    icon: '⚡',
    title: 'Electrical',
    subtitle: 'Safe & reliable electrical work',
    desc: 'Our licensed electricians ensure your electrical systems are safe, up to code, and functioning perfectly.',
    features: ['Wiring & Rewiring', 'Lighting Installation', 'Switchboard Upgrades', 'Safety Inspections', 'Smart Home Setup', 'Emergency Service'],
  },
  {
    id: 'carpentry',
    icon: '🪚',
    title: 'Carpentry',
    subtitle: 'Custom woodwork & furniture',
    desc: 'Transform your space with custom furniture, fittings, and woodwork crafted by our skilled carpenters.',
    features: ['Custom Furniture', 'Kitchen Cabinets', 'Wardrobe Design', 'Door & Window Fitting', 'Flooring Installation', 'Repairs & Restoration'],
  },
  {
    id: 'painting',
    icon: '🎭',
    title: 'Painting',
    subtitle: 'Professional painting services',
    desc: 'Give your space a fresh look with our professional painting services. We use premium materials and ensure a flawless finish.',
    features: ['Interior Painting', 'Exterior Painting', 'Texture Finishes', 'Waterproofing', 'Wallpaper Installation', 'Color Consultation'],
  },
  {
    id: 'cleaning',
    icon: '🧹',
    title: 'Cleaning & Sanitization',
    subtitle: 'Spotless spaces, guaranteed',
    desc: 'Deep cleaning, sanitization, and maintenance services for homes and offices. We use eco-friendly products and advanced equipment.',
    features: ['Deep Cleaning', 'Office Cleaning', 'Sofa & Carpet Cleaning', 'Sanitization', 'Move-in/Move-out Cleaning', 'Regular Maintenance'],
  },
  {
    id: 'ac',
    icon: '❄️',
    title: 'AC & Appliance Repair',
    subtitle: 'Keep your appliances running',
    desc: 'Expert repair and servicing for all major home appliances. Fast response, transparent pricing, and guaranteed work.',
    features: ['AC Installation & Repair', 'Refrigerator Service', 'Washing Machine Repair', 'Microwave & Oven Repair', 'Annual Maintenance Contracts', 'Appliance Installation'],
  },
];

interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  features: string[];
  tech?: string[];
}

function ServiceCard({ service, index, isTech }: { service: ServiceItem; index: number; isTech: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      id={service.id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="scroll-mt-24"
    >
      <div className={`p-8 rounded-2xl bg-card border border-primary hover:border-[#D4A853]/20 transition-all duration-500`}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left - Info */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{service.icon}</span>
              <div>
                <h3 className="text-2xl font-bold text-primary">{service.title}</h3>
                <p className="text-[#D4A853] text-sm">{service.subtitle}</p>
              </div>
            </div>
            <p className="text-secondary leading-relaxed mb-6">{service.desc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-secondary text-sm">
                  <span className="text-[#D4A853]">✦</span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Tech Stack */}
          <div className="lg:col-span-2">
            {isTech && 'tech' in service && (
              <>
                <h4 className="text-white text-sm font-semibold mb-3">Technologies We Use</h4>
                <div className="flex flex-wrap gap-2">
                  {service.tech?.map((t) => (
                    <span key={t} className="px-3 py-1.5 text-xs rounded-lg bg-card border border-primary text-primary opacity-80">
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}
            <div className="mt-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 text-[#D4A853] text-sm font-medium hover:text-[#F5C542] transition-colors"
              >
                Inquire About This Service →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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
        className="text-secondary max-w-3xl mx-auto text-lg"
      >{subtitle}</motion.p>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-[#D4A853]/6 rounded-full blur-[100px]" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-6"
          >Our Services</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight"
          >
            Everything You Need,{' '}
            <span className="gold-text-gradient">All in One Place</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-secondary text-lg max-w-3xl mx-auto leading-relaxed"
          >
            From digital transformation to home comfort — explore our comprehensive range of services designed to meet every need.
          </motion.p>
        </div>
      </section>

      {/* Tech Services */}
      <section className="relative py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Tech Services"
            title="🚀 Digital Solutions That Drive Growth"
            subtitle="Cutting-edge technology services to transform your digital presence and accelerate your business."
          />
          <div className="space-y-6">
            {techServices.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} isTech />
            ))}
          </div>
        </div>
      </section>

      {/* Home Services */}
      <section className="relative py-20">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Home Services"
            title="🏠 Professional Home Services, Delivered"
            subtitle="Verified professionals for all your home maintenance, repair, and improvement needs."
          />
          <div className="space-y-6">
            {homeServices.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} isTech={false} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-secondary text-lg mb-8">
            Talk to our experts. We&apos;ll help you find the perfect solution for your needs.
          </p>
          <Link href="/#contact" className="px-8 py-3.5 gold-gradient text-black font-semibold rounded-xl hover:scale-105 transition-transform inline-block">
            Book a Free Consultation
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
