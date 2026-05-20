'use client';

import Link from 'next/link';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Services', href: '/services' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/#contact' },
  ],
  services: [
    { label: 'Web Development', href: '/services#web' },
    { label: 'App Development', href: '/services#app' },
    { label: 'UI/UX Design', href: '/services#design' },
    { label: 'SEO', href: '/services#seo' },
    { label: 'Home Services', href: '/services#home' },
  ],
  support: [
    { label: 'Help Center', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Refund Policy', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
};

const socials = [
  { name: 'Twitter', icon: '𝕏', href: '#' },
  { name: 'LinkedIn', icon: 'in', href: '#' },
  { name: 'Instagram', icon: '📷', href: '#' },
  { name: 'YouTube', icon: '▶', href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative bg-secondary border-t border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img src="/logo-icon.svg" alt="Stambhix" className="w-10 h-10" />
              <span className="text-2xl font-bold text-primary">Stambhix</span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed mb-6 max-w-sm">
              Your trusted marketplace for every service — from cutting-edge digital solutions to reliable home services. One platform, endless possibilities.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="w-10 h-10 rounded-xl bg-card border border-primary flex items-center justify-center text-primary text-sm hover:border-[#D4A853]/30 hover:bg-[#D4A853]/5 transition-all duration-300"
                  aria-label={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {([
            { category: 'company', title: 'Company', links: footerLinks.company },
            { category: 'services', title: 'Services', links: footerLinks.services },
            { category: 'support', title: 'Support', links: footerLinks.support },
          ] as const).map(({ category, title, links }) => (
            <div key={category}>
              <h4 className="text-primary font-semibold mb-4 capitalize">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-secondary hover:text-[#D4A853] text-sm transition-colors">
                      {link.label}
                    </Link>
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
  );
}
