'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function StambhixHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 83, ${p.alpha})`;
        ctx.fill();

        // Draw connections
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 168, 83, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-primary">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#D4A853]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#D4A853]/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4A853]/3 rounded-full blur-[150px]" />
      </div>

      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#D4A853] animate-pulse" />
            <span className="text-[#D4A853] text-sm font-medium tracking-wide">Technology & Services Agency</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary leading-[1.1] mb-6">
            Building Digital
            <br />
            <span className="gold-text-gradient">Futures</span>
            <br />
            Delivering{' '}
            <span className="gold-text-gradient">Excellence</span>
          </motion.h1>

          {/* Description */}
          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-secondary max-w-2xl mb-10 leading-relaxed">
            From cutting-edge digital solutions to trusted home services — Stambhix connects you with verified professionals for every need. One platform, endless possibilities.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#services"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl text-black overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 gold-gradient" />
              <span className="relative flex items-center gap-2">
                Explore Our Services
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            <Link
              href="#contact"
              className="group inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl text-[#D4A853] border border-[#D4A853]/30 hover:bg-[#D4A853]/10 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Get in Touch
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div variants={itemVariants} className="mt-16 flex flex-wrap items-center gap-8">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-primary gold-gradient flex items-center justify-center text-black text-xs font-bold">
                S
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary gold-gradient flex items-center justify-center text-black text-xs font-bold">
                T
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary gold-gradient flex items-center justify-center text-black text-xs font-bold">
                A
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary flex items-center justify-center text-primary text-xs font-bold border-dashed border-[#D4A853]/40">
                ?
              </div>
            </div>
            <div>
              <p className="text-primary font-semibold">Building From Day One</p>
              <p className="text-tertiary text-sm">Small team, big dreams — starting our journey</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Side decorative element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="w-64 h-64 border border-[#D4A853]/20 rounded-full animate-float" />
            <div className="absolute inset-4 w-56 h-56 border border-[#D4A853]/10 rounded-full animate-float-delayed" />
            <div className="absolute inset-8 w-48 h-48 border border-[#D4A853]/5 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-2">✦</div>
                <div className="text-[#D4A853] text-sm font-medium tracking-widest">EST. 2025</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent" />
    </section>
  );
}
