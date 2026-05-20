'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const footerLinks = {
  company: ['About Us', 'Our Team', 'Careers', 'Blog', 'Press Kit'],
  services: ['Web Development', 'App Development', 'UI/UX Design', 'SEO', 'Home Services'],
  support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Refund Policy'],
  social: [
    { name: 'Twitter', icon: '𝕏' },
    { name: 'LinkedIn', icon: 'in' },
    { name: 'Instagram', icon: '📷' },
    { name: 'YouTube', icon: '▶' },
  ],
};

export default function StambhixContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.errors?.[0]?.message || 'Something went wrong');
      }

      setStatus('success');
      setFormData({ name: '', email: '', service: '', message: '' });

      // Reset success state after 6 seconds
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send message. Please try again.');

      // Reset error state after 6 seconds
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 6000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <>
      {/* CTA / Contact Section */}
      <section id="contact" className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A853]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A853]/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-6">
                Let&apos;s Talk
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                Ready to Build Something{' '}
                <span className="gold-text-gradient">Amazing</span>?
              </h2>
              <p className="text-secondary text-lg mb-8 leading-relaxed max-w-lg">
                Whether you need a stunning website, a mobile app, or home services — our team is here to help. Let&apos;s discuss your project.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: '📧', label: 'Email', value: 'hello@stambhix.com' },
                  { icon: '📞', label: 'Phone', value: '+91 1800-123-STAM' },
                  { icon: '📍', label: 'Office', value: 'Bangalore, Karnataka, India' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-card border border-primary flex items-center justify-center text-xl group-hover:border-[#D4A853]/30 transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-secondary text-sm">{item.label}</div>
                      <div className="text-primary font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold text-primary mb-6">Send Us a Message</h3>

              {/* Status messages */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2"
                >
                  <span>✅</span>
                  <span>Thank you! We&apos;ll get back to you within 24 hours.</span>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                >
                  <span>⚠️</span>
                  <span>{errorMessage || 'Something went wrong. Please try again.'}</span>
                </motion.div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name *"
                      className={`w-full px-4 py-3 rounded-xl bg-card border text-primary placeholder-tertiary focus:outline-none focus:ring-1 transition-all ${
                        errors.name
                          ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20'
                          : 'border-primary focus:border-[#D4A853]/40 focus:ring-[#D4A853]/20'
                      }`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email *"
                      className={`w-full px-4 py-3 rounded-xl bg-card border text-primary placeholder-tertiary focus:outline-none focus:ring-1 transition-all ${
                        errors.email
                          ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20'
                          : 'border-primary focus:border-[#D4A853]/40 focus:ring-[#D4A853]/20'
                      }`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>}
                  </div>
                </div>

                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-primary text-secondary focus:border-[#D4A853]/40 focus:outline-none focus:ring-1 focus:ring-[#D4A853]/20 transition-all"
                >
                  <option value="">Select Service (optional)</option>
                  <option value="web">Web Development</option>
                  <option value="app">App Development</option>
                  <option value="design">UI/UX Design</option>
                  <option value="seo">SEO</option>
                  <option value="home">Home Services</option>
                  <option value="other">Other</option>
                </select>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your project... *"
                    className={`w-full px-4 py-3 rounded-xl bg-card border text-primary placeholder-tertiary focus:outline-none focus:ring-1 transition-all resize-none ${
                      errors.message
                        ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20'
                        : 'border-primary focus:border-[#D4A853]/40 focus:ring-[#D4A853]/20'
                    }`}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-8 py-3.5 gold-gradient text-black font-semibold rounded-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message →'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-secondary border-t border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-black font-bold text-lg">
                  S
                </div>
                <span className="text-2xl font-bold text-primary">Stambhix</span>
              </div>
              <p className="text-secondary text-sm leading-relaxed mb-6 max-w-sm">
                Your trusted marketplace for every service — from cutting-edge digital solutions to reliable home services. One platform, endless possibilities.
              </p>
              <div className="flex gap-3">
                {footerLinks.social.map((s) => (
                  <a
                    key={s.name}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-card border border-primary flex items-center justify-center text-primary text-sm hover:border-[#D4A853]/30 hover:bg-[#D4A853]/5 transition-all duration-300"
                    aria-label={s.name}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {([
              { category: 'company', links: footerLinks.company },
              { category: 'services', links: footerLinks.services },
              { category: 'support', links: footerLinks.support },
            ] as const).map(({ category, links }) => (
              <div key={category}>
                <h4 className="text-primary font-semibold mb-4 capitalize">{category}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-secondary hover:text-[#D4A853] text-sm transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-primary flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-tertiary text-sm">
              © {new Date().getFullYear()} Stambhix Technologies. All rights reserved.
            </p>
            <p className="text-tertiary text-sm">
              Crafted with ✨ in India
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
