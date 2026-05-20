'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  coverImage: string;
  readTime: number;
  published: boolean;
  createdAt: string;
}

const fallbackPosts: BlogPost[] = [
  {
    _id: '1', slug: 'future-of-web-development-2025', title: 'The Future of Web Development in 2025: Trends to Watch',
    excerpt: 'From AI-powered development to edge computing — explore the key trends shaping the web development landscape this year.',
    content: '', author: 'Arjun Mehta', category: 'Tech', tags: ['web development', 'trends'],
    coverImage: '💻', readTime: 5, published: true, createdAt: '2025-01-15',
  },
  {
    _id: '2', slug: 'why-ui-ux-matters-for-startups', title: 'Why UI/UX Design Matters More Than Ever for Startups',
    excerpt: 'First impressions matter. Learn how great design can make or break your startup\'s success in the digital age.',
    content: '', author: 'Priya Sharma', category: 'Design', tags: ['UI/UX', 'startups'],
    coverImage: '🎨', readTime: 4, published: true, createdAt: '2025-01-10',
  },
  {
    _id: '3', slug: 'seo-tips-for-small-businesses', title: '10 SEO Tips Every Small Business Owner Should Know',
    excerpt: 'Boost your online visibility with these actionable SEO strategies designed specifically for small businesses.',
    content: '', author: 'Neha Patel', category: 'Marketing', tags: ['SEO', 'small business'],
    coverImage: '📈', readTime: 6, published: true, createdAt: '2025-01-05',
  },
  {
    _id: '4', slug: 'mobile-app-vs-website', title: 'Mobile App vs. Website: Which One Does Your Business Need?',
    excerpt: 'Confused whether to build a mobile app or a responsive website? We break down the pros and cons of each.',
    content: '', author: 'Vikram Singh', category: 'Tech', tags: ['mobile', 'web'],
    coverImage: '📱', readTime: 5, published: true, createdAt: '2024-12-28',
  },
  {
    _id: '5', slug: 'home-maintenance-tips-winter', title: 'Essential Home Maintenance Tips for Winter',
    excerpt: 'Protect your home this winter with these essential maintenance tips from our expert service professionals.',
    content: '', author: 'Rajesh Kumar', category: 'Home Services', tags: ['home maintenance', 'winter'],
    coverImage: '🏠', readTime: 3, published: true, createdAt: '2024-12-20',
  },
  {
    _id: '6', slug: 'digital-transformation-guide', title: 'Your Complete Guide to Digital Transformation in 2025',
    excerpt: 'A step-by-step guide to help your business navigate digital transformation and stay competitive.',
    content: '', author: 'Arjun Mehta', category: 'Business', tags: ['digital transformation', 'guide'],
    coverImage: '🚀', readTime: 8, published: true, createdAt: '2024-12-15',
  },
];

const categories = ['All', 'Tech', 'Design', 'Marketing', 'Home Services', 'Business'];

const categoryColors: Record<string, string> = {
  Tech: 'bg-blue-500/10 text-blue-400',
  Design: 'bg-purple-500/10 text-purple-400',
  Marketing: 'bg-green-500/10 text-green-400',
  'Home Services': 'bg-orange-500/10 text-orange-400',
  Business: 'bg-cyan-500/10 text-cyan-400',
};

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block p-6 rounded-2xl bg-card border border-primary hover:border-[#D4A853]/20 hover:bg-card-hover transition-all duration-500">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{post.coverImage}</span>
          <div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[post.category] || 'bg-gray-500/10 text-gray-400'}`}>
              {post.category}
            </span>
            <span className="text-gray-500 text-xs ml-2">{post.readTime} min read</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-[#D4A853]/90 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-secondary text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between"><span className="text-tertiary text-xs">By {post.author}</span>
                          <span className="text-tertiary text-xs">{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blog`);
        if (res.ok) {
          const data = await res.json();
          if (data.posts && data.posts.length > 0) {
            setPosts(data.posts);
          }
        }
      } catch {
        // Use fallback posts
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filtered = activeCategory === 'All' ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[#D4A853]/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-6"
          >Our Blog</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight"
          >
            Insights, Ideas, and{' '}
            <span className="gold-text-gradient">Expert Advice</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-secondary text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Stay ahead with the latest in tech, design, marketing, and home services. Our experts share their knowledge to help you make informed decisions.
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm rounded-xl transition-all ${
                activeCategory === cat
                  ? 'gold-gradient text-black font-semibold'
                  : 'text-secondary bg-card border border-primary hover:text-primary hover:border-[#D4A853]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-primary">
                  <div className="w-16 h-4 rounded bg-card-hover animate-pulse mb-4" />
                  <div className="w-full h-5 rounded bg-card-hover animate-pulse mb-2" />
                  <div className="w-3/4 h-5 rounded bg-card-hover animate-pulse mb-4" />
                  <div className="w-full h-4 rounded bg-inset animate-pulse mb-2" />
                  <div className="w-2/3 h-4 rounded bg-inset animate-pulse" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-primary mb-2">No posts yet</h3>
              <p className="text-secondary">Check back soon for new articles in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <BlogCard key={post._id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative py-16 bg-secondary">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-3">Stay Updated</h2>
          <p className="text-secondary text-sm mb-6">Get the latest articles and insights delivered to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl bg-card border border-primary text-primary placeholder-tertiary focus:outline-none focus:border-[#D4A853]/40 text-sm" />
            <button type="submit" className="px-6 py-3 gold-gradient text-black font-semibold rounded-xl text-sm hover:scale-[1.02] transition-transform whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
