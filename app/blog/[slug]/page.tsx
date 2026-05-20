'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

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

const fallbackPosts: Record<string, BlogPost> = {
  'future-of-web-development-2025': {
    _id: '1', slug: 'future-of-web-development-2025',
    title: 'The Future of Web Development in 2025: Trends to Watch',
    excerpt: 'From AI-powered development to edge computing — explore the key trends shaping the web development landscape this year.',
    content: `The web development landscape is evolving faster than ever. As we move through 2025, several key trends are shaping how we build and interact with websites and web applications.

## 1. AI-Powered Development

Artificial intelligence is no longer a futuristic concept — it's here and it's transforming how developers write code. From AI-powered code completion to automated testing and deployment, developers can now focus on higher-level architecture and user experience while AI handles repetitive tasks.

## 2. Edge Computing

Edge computing is revolutionizing web performance by moving computation closer to the user. This means faster load times, reduced latency, and better user experiences, especially for global audiences.

## 3. WebAssembly (Wasm)

WebAssembly continues to gain traction, allowing developers to run high-performance code written in languages like Rust, C++, and Go directly in the browser. This opens up new possibilities for web applications that were previously only possible with native apps.

## 4. Progressive Web Apps (PWAs)

PWAs have become the standard for mobile web experiences. With offline capabilities, push notifications, and app-like interfaces, they offer the best of both worlds — the reach of the web and the functionality of native apps.

## 5. Sustainability in Web Development

Green coding is becoming a priority. Developers are optimizing code for energy efficiency, choosing sustainable hosting providers, and designing with minimal environmental impact in mind.

## Conclusion

The future of web development is exciting, with new technologies empowering developers to create faster, smarter, and more sustainable web experiences. Staying ahead of these trends will be key to building successful digital products in 2025 and beyond.`,
    author: 'Arjun Mehta', category: 'Tech', tags: ['web development', 'trends', 'AI'],
    coverImage: '💻', readTime: 5, published: true, createdAt: '2025-01-15',
  },
  'why-ui-ux-matters-for-startups': {
    _id: '2', slug: 'why-ui-ux-matters-for-startups',
    title: 'Why UI/UX Design Matters More Than Ever for Startups',
    excerpt: 'First impressions matter. Learn how great design can make or break your startup\'s success in the digital age.',
    content: `In the competitive startup landscape, your product's design can be the deciding factor between success and failure. Here's why UI/UX design deserves your attention from day one.

## First Impressions Are Everything

Users form an opinion about your product within the first 50 milliseconds. If your interface isn't intuitive and visually appealing, you've already lost them. Great UI/UX design ensures that first impression is a lasting positive one.

## Reduced Development Costs

Investing in design early saves money. A well-designed product requires fewer iterations, less customer support, and lower churn rates. Fixing a usability issue during development costs a fraction of what it would cost after launch.

## Competitive Advantage

In a market where features can be replicated, user experience is a key differentiator. A product that's a joy to use will always win over a feature-packed but confusing alternative.

## Higher Conversion Rates

Good design directly impacts your bottom line. Clear calls-to-action, intuitive navigation, and a seamless checkout process can dramatically improve conversion rates and revenue.

## Better User Retention

A great user experience keeps people coming back. When users can accomplish their goals quickly and easily, they're more likely to become loyal, long-term customers.

## Conclusion

UI/UX design isn't just about making things look pretty — it's about creating products that people love to use. For startups, that can make all the difference.`,
    author: 'Priya Sharma', category: 'Design', tags: ['UI/UX', 'startups', 'design'],
    coverImage: '🎨', readTime: 4, published: true, createdAt: '2025-01-10',
  },
  'seo-tips-for-small-businesses': {
    _id: '3', slug: 'seo-tips-for-small-businesses',
    title: '10 SEO Tips Every Small Business Owner Should Know',
    excerpt: 'Boost your online visibility with these actionable SEO strategies designed specifically for small businesses.',
    content: `Search engine optimization doesn't have to be complicated. Here are 10 practical tips to help your small business get found online.

## 1. Claim Your Google Business Profile

This is the single most important thing you can do for local SEO. Ensure your profile is complete, accurate, and regularly updated with photos and posts.

## 2. Optimize for Local Search

Include your city and region in your page titles, meta descriptions, and content. Create location-specific landing pages if you serve multiple areas.

## 3. Focus on Mobile-First Design

With over 60% of searches happening on mobile devices, a mobile-friendly website isn't optional — it's essential.

## 4. Create Quality Content

Regularly publish blog posts, guides, and articles that answer your customers' questions. Google rewards websites that provide value to users.

## 5. Optimize Page Speed

A one-second delay in page load time can reduce conversions by 7%. Use tools like Google PageSpeed Insights to identify and fix speed issues.

## 6. Build Local Citations

Ensure your business name, address, and phone number are consistent across all online directories and platforms.

## 7. Encourage Customer Reviews

Positive reviews on Google and other platforms boost your credibility and improve your local search rankings.

## 8. Use Descriptive URLs

Instead of example.com/p123, use example.com/services/web-design. Descriptive URLs help search engines understand your content.

## 9. Optimize Your Meta Tags

Write compelling title tags (50-60 characters) and meta descriptions (150-160 characters) for every page on your site.

## 10. Track Your Results

Use Google Analytics and Google Search Console to monitor your traffic, identify opportunities, and measure your progress.

## Conclusion

SEO is a long-term investment, but these tips will give you a solid foundation. Start implementing them today and you'll see results in the months ahead.`,
    author: 'Neha Patel', category: 'Marketing', tags: ['SEO', 'small business', 'marketing'],
    coverImage: '📈', readTime: 6, published: true, createdAt: '2025-01-05',
  },
};

const categoryColors: Record<string, string> = {
  Tech: 'bg-blue-500/10 text-blue-400',
  Design: 'bg-purple-500/10 text-purple-400',
  Marketing: 'bg-green-500/10 text-green-400',
  'Home Services': 'bg-orange-500/10 text-orange-400',
  Business: 'bg-cyan-500/10 text-cyan-400',
};

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-24 h-6 rounded-full bg-white/[0.05] animate-pulse mb-6" />
          <div className="w-full h-10 rounded bg-white/[0.05] animate-pulse mb-3" />
          <div className="w-3/4 h-10 rounded bg-white/[0.05] animate-pulse mb-6" />
          <div className="w-48 h-4 rounded bg-white/[0.03] animate-pulse mb-12" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="w-full h-4 rounded bg-white/[0.03] animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.post) {
            setPost(data.post);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fall through to fallback
      }
      // Use fallback
      const fallback = fallbackPosts[slug as string];
      if (fallback) {
        setPost(fallback);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) return <LoadingSkeleton />;

  if (!post) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="pt-40 pb-20 text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold text-primary mb-3">Post Not Found</h1>
          <p className="text-secondary mb-8">The blog post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/blog" className="px-6 py-3 gold-gradient text-black font-semibold rounded-xl hover:scale-105 transition-transform inline-block">
            ← Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <article className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link href="/blog" className="inline-flex items-center gap-1 text-gray-400 hover:text-[#D4A853] text-sm transition-colors mb-8">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{post.coverImage}</span>
              <div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-500/10 text-gray-400'}`}>
                  {post.category}
                </span>
                <span className="text-gray-500 text-xs ml-3">{post.readTime} min read</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-secondary text-lg mb-6">{post.excerpt}</p>

            <div className="flex items-center gap-4 pb-8 mb-8 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-black text-xs font-bold">
                {post.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{post.author}</p>
                <p className="text-gray-500 text-xs">{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-invert max-w-none"
          >
            {post.content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-xl font-semibold text-white mt-8 mb-3">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="text-gray-300 ml-4 mb-1">{line.replace('- ', '')}</li>;
              }
              if (line.trim() === '') return <div key={i} className="h-4" />;
              if (line.match(/^\d+\.\s/)) {
                return <li key={i} className="text-gray-300 ml-4 mb-1 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
              }
              return <p key={i} className="text-gray-300 leading-relaxed mb-4">{line}</p>;
            })}
          </motion.div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/[0.06]">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 text-xs rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-gray-500 text-sm">Share this post:</span>
            {['𝕏', 'in', '🔗'].map((icon) => (
              <button key={icon} className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white text-xs hover:border-[#D4A853]/30 transition-all">
                {icon}
              </button>
            ))}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
