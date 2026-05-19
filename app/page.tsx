import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              <span className="text-3xl">🧠</span>
              MemoryChain
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a>
              <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">Sign in</Link>
              <Link href="/register" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              AI-Powered Memory Assistant
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Never Forget What
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Matters Most</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              MemoryChain uses AI to capture, organize, and preserve your most important memories, thoughts, and experiences — so they&apos;re always at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
              >
                Start Your Memory Journey
              </Link>
              <a
                href="#features"
                className="px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">The Memory Crisis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📱', title: 'Information Overload', desc: 'We consume 34GB of data daily. Important memories get lost in the noise.' },
              { icon: '🧠', title: 'Memory Decay', desc: 'Within 24 hours, we forget 70% of what we learn. Valuable experiences fade away.' },
              { icon: '📂', title: 'Fragmented Storage', desc: 'Your memories are scattered across notes, photos, messages, and apps with no central hub.' },
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">Three simple steps to preserve your memories forever</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '✍️', title: 'Capture', desc: 'Write your memories, thoughts, or ideas. Add tags to organize them your way.' },
              { step: '02', icon: '🤖', title: 'AI Enhances', desc: 'Our AI automatically generates summaries and suggests relevant tags to connect related memories.' },
              { step: '03', icon: '🔍', title: 'Find Instantly', desc: 'Search, filter, and rediscover any memory in seconds. Your personal timeline, always accessible.' },
            ].map((item) => (
              <div key={item.step} className="relative text-center group">
                <div className="absolute -top-4 -left-4 text-8xl font-bold text-indigo-100 dark:text-indigo-900/20 select-none group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <div className="text-6xl mb-6 relative">{item.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">Powerful Features</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">Everything you need to preserve and organize your memories</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🤖', title: 'AI Summaries', desc: 'Automatic smart summaries of your memories using advanced AI.', gradient: 'from-blue-500 to-cyan-500' },
              { icon: '🏷️', title: 'Smart Tagging', desc: 'AI suggests relevant tags to connect related memories automatically.', gradient: 'from-purple-500 to-pink-500' },
              { icon: '🔍', title: 'Full-Text Search', desc: 'Find any memory instantly with powerful search across all your content.', gradient: 'from-orange-500 to-red-500' },
              { icon: '📁', title: 'Flexible Organization', desc: 'Organize by type, tags, favorites, or date. Your way.', gradient: 'from-green-500 to-emerald-500' },
              { icon: '⭐', title: 'Favorites', desc: 'Mark your most cherished memories as favorites for quick access.', gradient: 'from-yellow-500 to-amber-500' },
              { icon: '🔐', title: 'Secure & Private', desc: 'Your memories are encrypted and only accessible by you.', gradient: 'from-indigo-500 to-violet-500' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">Simple Pricing</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16">Start free, upgrade when you need more</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free', price: '$0', period: 'forever', popular: false,
                features: ['100 memories', 'Basic search', '3 tags per memory', 'Standard support'],
              },
              {
                name: 'Pro', price: '$9', period: '/month', popular: true,
                features: ['Unlimited memories', 'AI summaries & tagging', 'Advanced search', 'Priority support', 'Export to PDF'],
              },
              {
                name: 'Family', price: '$19', period: '/month', popular: false,
                features: ['Everything in Pro', 'Up to 5 accounts', 'Shared memories', 'AI memory recommendations', 'Premium support'],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-indigo-600 text-white shadow-xl scale-105 border-2 border-indigo-400'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-400 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{plan.name}</h3>
                <div className={`text-5xl font-bold mb-6 ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {plan.price}
                  <span className={`text-lg font-normal ${plan.popular ? 'text-indigo-200' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-3 ${plan.popular ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                      <svg className={`w-5 h-5 ${plan.popular ? 'text-indigo-300' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">Trusted by Memory Keepers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '50K+', label: 'Memories Captured' },
              { number: '99.9%', label: 'Uptime' },
              { number: '4.9★', label: 'User Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
            <span>🧠</span> MemoryChain
          </div>
          <p className="text-gray-500 dark:text-gray-400">© 2026 MemoryChain. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
