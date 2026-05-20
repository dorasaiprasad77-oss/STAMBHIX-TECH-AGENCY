/**
 * Seed script for Stambhix Content Management data.
 * Populates Team Members, Achievements, Project Media, and Site Settings.
 * Run: node src/seed-content.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const TeamMember = require('./models/TeamMember');
const Achievement = require('./models/Achievement');
const ProjectMedia = require('./models/ProjectMedia');
const SiteSetting = require('./models/SiteSetting');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env file');
  process.exit(1);
}

// ─── Team Members ───
const seedTeamMembers = [
  {
    name: 'Arjun Mehta',
    position: 'CEO & Founder',
    bio: 'Visionary entrepreneur with 15+ years in tech and service marketplaces. Founded Stambhix to bridge the gap between digital and local services.',
    avatar: 'https://picsum.photos/seed/arjun/200/200',
    socialLinks: { linkedin: 'https://linkedin.com/in/arjun-mehta', twitter: 'https://twitter.com/arjunmehta', github: '', website: '' },
    order: 1,
  },
  {
    name: 'Priya Sharma',
    position: 'Chief Technology Officer',
    bio: 'Full-stack architect and AI enthusiast. Leads engineering, product innovation, and the AI-powered service recommendation engine.',
    avatar: 'https://picsum.photos/seed/priya/200/200',
    socialLinks: { linkedin: 'https://linkedin.com/in/priya-sharma', twitter: '', github: 'https://github.com/priyasharma', website: '' },
    order: 2,
  },
  {
    name: 'Rahul Verma',
    position: 'Chief Operating Officer',
    bio: 'Operations expert with a decade of experience in scaling service delivery. Ensures seamless quality across all verticals.',
    avatar: 'https://picsum.photos/seed/rahul/200/200',
    socialLinks: { linkedin: 'https://linkedin.com/in/rahul-verma', twitter: '', github: '', website: '' },
    order: 3,
  },
  {
    name: 'Neha Patel',
    position: 'Head of Design',
    bio: 'Award-winning designer creating intuitive and beautiful user experiences. Previously led design teams at top product companies.',
    avatar: 'https://picsum.photos/seed/neha/200/200',
    socialLinks: { linkedin: 'https://linkedin.com/in/neha-patel', twitter: 'https://twitter.com/nehadesigns', github: '', website: 'https://nehapatel.design' },
    order: 4,
  },
  {
    name: 'Vikram Singh',
    position: 'VP of Engineering',
    bio: 'Scales distributed systems and leads our platform engineering team. Expert in cloud infrastructure and microservices architecture.',
    avatar: 'https://picsum.photos/seed/vikram/200/200',
    socialLinks: { linkedin: 'https://linkedin.com/in/vikram-singh', twitter: '', github: 'https://github.com/vikramsingh', website: '' },
    order: 5,
  },
  {
    name: 'Ananya Gupta',
    position: 'Head of Marketing',
    bio: 'Growth strategist driving brand awareness and customer acquisition. Built our marketing engine from the ground up.',
    avatar: 'https://picsum.photos/seed/ananya/200/200',
    socialLinks: { linkedin: 'https://linkedin.com/in/ananya-gupta', twitter: 'https://twitter.com/ananyagrowth', github: '', website: '' },
    order: 6,
  },
  {
    name: 'Rajesh Kumar',
    position: 'VP of Operations — Home Services',
    bio: 'Ensures quality and reliability across our home services network. Manages 50+ verified professionals across 15 cities.',
    avatar: 'https://picsum.photos/seed/rajesh/200/200',
    socialLinks: { linkedin: 'https://linkedin.com/in/rajesh-kumar', twitter: '', github: '', website: '' },
    order: 7,
  },
  {
    name: 'Deepika Reddy',
    position: 'Head of Customer Success',
    bio: 'Customer-obsessed leader building world-class support experiences. Maintains our 98% client satisfaction rating.',
    avatar: 'https://picsum.photos/seed/deepika/200/200',
    socialLinks: { linkedin: 'https://linkedin.com/in/deepika-reddy', twitter: '', github: '', website: '' },
    order: 8,
  },
  {
    name: 'Siddharth Joshi',
    position: 'Lead Full-Stack Developer',
    bio: 'Full-stack wizard specializing in React, Node.js, and cloud-native applications. Builds the core platform features.',
    avatar: 'https://picsum.photos/seed/siddharth/200/200',
    socialLinks: { linkedin: 'https://linkedin.com/in/siddharth-joshi', twitter: '', github: 'https://github.com/sidjoshi', website: '' },
    order: 9,
  },
  {
    name: 'Kavita Nair',
    position: 'UI/UX Designer',
    bio: 'Crafting pixel-perfect interfaces with a focus on accessibility and user delight. Brings designs to life with thoughtful micro-interactions.',
    avatar: 'https://picsum.photos/seed/kavita/200/200',
    socialLinks: { linkedin: 'https://linkedin.com/in/kavita-nair', twitter: 'https://twitter.com/kavitaui', github: '', website: '' },
    order: 10,
  },
];

// ─── Achievements ───
const seedAchievements = [
  {
    title: 'Company Founded',
    description: 'Stambhix Tech Agency was founded with a vision to unify digital and home services under one trusted platform.',
    date: new Date('2020-06-15'),
    icon: '🚀',
    category: 'milestone',
    metric: '',
    metricValue: '',
    order: 1,
  },
  {
    title: 'First 100 Clients',
    description: 'Reached the milestone of 100 happy clients, validating our platform model and service quality.',
    date: new Date('2021-03-20'),
    icon: '🎯',
    category: 'growth',
    metric: 'Clients Served',
    metricValue: '100+',
    order: 2,
  },
  {
    title: 'Best Tech Startup Award',
    description: 'Recognized as the "Best Emerging Tech Startup" at the India Innovation Summit 2021 for our unified service platform.',
    date: new Date('2021-11-10'),
    icon: '🏆',
    category: 'award',
    metric: '',
    metricValue: '',
    order: 3,
  },
  {
    title: 'Launched Home Services',
    description: 'Expanded into home services vertical — plumbing, electrical, carpentry, painting, and cleaning — with verified professionals.',
    date: new Date('2022-04-01'),
    icon: '🏠',
    category: 'milestone',
    metric: 'Cities Launched',
    metricValue: '5',
    order: 4,
  },
  {
    title: '500 Clients Milestone',
    description: 'Crossed 500 active clients across both digital and home service verticals with a 95% satisfaction rate.',
    date: new Date('2022-09-15'),
    icon: '📈',
    category: 'growth',
    metric: 'Clients Served',
    metricValue: '500+',
    order: 5,
  },
  {
    title: 'Pan-India Expansion',
    description: 'Expanded operations to 15+ cities with 50+ verified expert professionals on the platform.',
    date: new Date('2023-02-01'),
    icon: '📍',
    category: 'growth',
    metric: 'Cities Covered',
    metricValue: '15+',
    order: 6,
  },
  {
    title: 'Excellence in Service Design',
    description: 'Awarded "Excellence in Service Design" at the National Customer Experience Awards for our seamless booking and tracking experience.',
    date: new Date('2023-06-22'),
    icon: '⭐',
    category: 'award',
    metric: '',
    metricValue: '',
    order: 7,
  },
  {
    title: 'AI-Powered Recommendations',
    description: 'Launched AI-driven service recommendation engine, matching clients with the perfect professionals based on their requirements.',
    date: new Date('2024-01-15'),
    icon: '🤖',
    category: 'milestone',
    metric: 'Accuracy Rate',
    metricValue: '94%',
    order: 8,
  },
  {
    title: '1,000+ Projects Delivered',
    description: 'Successfully delivered over 1,000 projects spanning web development, mobile apps, design, SEO, and home services.',
    date: new Date('2024-05-10'),
    icon: '🎉',
    category: 'growth',
    metric: 'Projects Delivered',
    metricValue: '1,000+',
    order: 9,
  },
  {
    title: 'Enterprise Partnerships',
    description: 'Secured enterprise partnerships with 10+ major corporations for ongoing digital transformation and service management.',
    date: new Date('2024-08-01'),
    icon: '🤝',
    category: 'recognition',
    metric: 'Enterprise Clients',
    metricValue: '10+',
    order: 10,
  },
];

// ─── Project Media ───
const seedProjectMedia = [
  {
    projectName: 'E-Commerce Fashion Platform',
    description: 'A full-featured e-commerce platform for a growing fashion brand. Built with Next.js, featuring real-time inventory management, secure payment gateway integration, and an AI-powered recommendation engine.',
    mediaType: 'image',
    imageUrl: 'https://picsum.photos/seed/ecommerce/800/500',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'web',
    client: 'StyleVault',
    completionDate: new Date('2024-01-20'),
    tags: ['next.js', 'stripe', 'mongodb', 'tailwind', 'redis'],
    order: 1,
  },
  {
    projectName: 'Mobile Banking Application',
    description: 'A secure, cross-platform mobile banking app with biometric authentication, real-time transaction tracking, UPI integration, and budget management features.',
    mediaType: 'both',
    imageUrl: 'https://picsum.photos/seed/banking/800/500',
    videoUrl: '',
    thumbnailUrl: 'https://picsum.photos/seed/banking-thumb/800/500',
    category: 'app',
    client: 'FinCorp Solutions',
    completionDate: new Date('2024-06-15'),
    tags: ['react-native', 'node.js', 'postgresql', 'firebase', 'upi'],
    order: 2,
  },
  {
    projectName: 'SaaS Analytics Dashboard',
    description: 'A comprehensive analytics dashboard for business intelligence. Features customizable widgets, real-time data streaming, interactive charts, and exportable reports.',
    mediaType: 'image',
    imageUrl: 'https://picsum.photos/seed/analytics/800/500',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'web',
    client: 'DataViz Inc.',
    completionDate: new Date('2024-03-10'),
    tags: ['react', 'd3.js', 'websocket', 'timescale-db', 'docker'],
    order: 3,
  },
  {
    projectName: 'Fitness Tracker Mobile App',
    description: 'A cross-platform fitness tracking app with workout logging, progress tracking, social features, and AI-powered form correction using computer vision.',
    mediaType: 'video',
    imageUrl: '',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/fitness/800/500',
    category: 'app',
    client: 'HealthFirst',
    completionDate: new Date('2024-02-28'),
    tags: ['flutter', 'tensorflow', 'firebase', 'bluetooth'],
    order: 4,
  },
  {
    projectName: 'UI/UX Redesign — SaaS Platform',
    description: 'Complete UI/UX redesign for a B2B SaaS platform. Improved conversion rates by 40% through streamlined workflows, modern design system, and accessibility improvements.',
    mediaType: 'image',
    imageUrl: 'https://picsum.photos/seed/ux-redesign/800/500',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'design',
    client: 'CloudStack Technologies',
    completionDate: new Date('2024-05-05'),
    tags: ['figma', 'design-system', 'accessibility', 'user-research'],
    order: 5,
  },
  {
    projectName: 'Restaurant Online Ordering System',
    description: 'A complete online ordering and delivery management system for a restaurant chain. Includes menu management, real-time order tracking, and delivery route optimization.',
    mediaType: 'image',
    imageUrl: 'https://picsum.photos/seed/restaurant/800/500',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'web',
    client: 'FoodieHub Chain',
    completionDate: new Date('2024-04-18'),
    tags: ['next.js', 'google-maps', 'socket.io', 'postgresql'],
    order: 6,
  },
  {
    projectName: 'E-Learning Platform',
    description: 'An interactive e-learning platform with live classes, recorded lectures, assessment engine, and AI-powered personalized learning paths.',
    mediaType: 'both',
    imageUrl: 'https://picsum.photos/seed/elearning/800/500',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/elearning-thumb/800/500',
    category: 'web',
    client: 'EduSmart',
    completionDate: new Date('2024-08-20'),
    tags: ['react', 'webrtc', 'python', 'tensorflow', 'aws'],
    order: 7,
  },
  {
    projectName: 'Corporate Brand Identity',
    description: 'Complete brand identity design including logo, color palette, typography, business stationery, brand guidelines, and marketing collateral.',
    mediaType: 'image',
    imageUrl: 'https://picsum.photos/seed/branding/800/500',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'design',
    client: 'ElegantCorp Group',
    completionDate: new Date('2024-01-25'),
    tags: ['branding', 'logo-design', 'typography', 'illustration'],
    order: 8,
  },
  {
    projectName: 'Smart Home IoT Dashboard',
    description: 'A mobile app and web dashboard for controlling smart home devices. Features voice control, scene automation, energy monitoring, and family access management.',
    mediaType: 'video',
    imageUrl: '',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/smarthome/800/500',
    category: 'app',
    client: 'HomeAuto Solutions',
    completionDate: new Date('2024-07-12'),
    tags: ['flutter', 'iot', 'mqtt', 'aws-iot', 'voice-control'],
    order: 9,
  },
  {
    projectName: 'SEO & Content Strategy',
    description: 'Comprehensive SEO overhaul including technical audit, content strategy, link building, and local SEO optimization. Achieved 300% increase in organic traffic.',
    mediaType: 'image',
    imageUrl: 'https://picsum.photos/seed/seo/800/500',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'seo',
    client: 'GrowthLabs Media',
    completionDate: new Date('2024-02-15'),
    tags: ['seo', 'content-strategy', 'analytics', 'keyword-research'],
    order: 10,
  },
  {
    projectName: 'Real Estate Portal',
    description: 'A feature-rich real estate portal with property listings, virtual tours, mortgage calculator, agent matching, and AI-powered property recommendations.',
    mediaType: 'both',
    imageUrl: 'https://picsum.photos/seed/realestate/800/500',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/realestate-thumb/800/500',
    category: 'web',
    client: 'HomeFind Realty',
    completionDate: new Date('2024-09-01'),
    tags: ['next.js', 'elasticsearch', 'google-maps', 'ai', 'stripe'],
    order: 11,
  },
  {
    projectName: 'AC Installation & Service Platform',
    description: 'A booking and management platform for AC installation and maintenance services with technician scheduling, inventory tracking, and customer feedback system.',
    mediaType: 'image',
    imageUrl: 'https://picsum.photos/seed/ac-service/800/500',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'home',
    client: 'CoolZone Services',
    completionDate: new Date('2024-03-20'),
    tags: ['react', 'node.js', 'mongodb', 'twilio'],
    order: 12,
  },
];

// ─── Site Settings ───
const seedSettings = [
  {
    key: 'trusted_clients',
    label: 'Trusted Clients',
    value: 500,
    type: 'number',
    description: 'Number shown in hero/stats section — total clients served',
  },
  {
    key: 'projects_delivered',
    label: 'Projects Delivered',
    value: 1200,
    type: 'number',
    description: 'Total projects delivered across all service categories',
  },
  {
    key: 'expert_professionals',
    label: 'Expert Professionals',
    value: 50,
    type: 'number',
    description: 'Number of verified professionals on the platform',
  },
  {
    key: 'cities_covered',
    label: 'Cities Covered',
    value: 15,
    type: 'number',
    description: 'Number of cities with active service coverage',
  },
  {
    key: 'client_satisfaction',
    label: 'Client Satisfaction',
    value: '98%',
    type: 'string',
    description: 'Satisfaction percentage displayed on landing page',
  },
  {
    key: 'support_hours',
    label: 'Support Hours',
    value: '24/7',
    type: 'string',
    description: 'Support availability text shown in stats section',
  },
  {
    key: 'year_founded',
    label: 'Year Founded',
    value: 2020,
    type: 'number',
    description: 'Company founding year displayed in about/hero sections',
  },
  {
    key: 'total_team_members',
    label: 'Total Team Members',
    value: 45,
    type: 'number',
    description: 'Total headcount across all departments',
  },
];

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // ── Team Members ──
    console.log('🗑️  Clearing existing team members...');
    await TeamMember.deleteMany({});
    console.log(`👥 Seeding ${seedTeamMembers.length} team members...`);
    const members = await TeamMember.insertMany(seedTeamMembers);
    console.log(`✅ ${members.length} team members created`);

    // ── Achievements ──
    console.log('🗑️  Clearing existing achievements...');
    await Achievement.deleteMany({});
    console.log(`🏆 Seeding ${seedAchievements.length} achievements...`);
    const achievements = await Achievement.insertMany(seedAchievements);
    console.log(`✅ ${achievements.length} achievements created`);

    // ── Project Media ──
    console.log('🗑️  Clearing existing project media...');
    await ProjectMedia.deleteMany({});
    console.log(`📁 Seeding ${seedProjectMedia.length} project media entries...`);
    const projects = await ProjectMedia.insertMany(seedProjectMedia);
    console.log(`✅ ${projects.length} project media entries created`);

    // ── Site Settings ──
    console.log('🗑️  Clearing existing site settings...');
    await SiteSetting.deleteMany({});
    console.log(`⚙️  Seeding ${seedSettings.length} site settings...`);
    const settings = await SiteSetting.insertMany(seedSettings);
    console.log(`✅ ${settings.length} site settings created`);

    // ── Summary ──
    console.log('\n📊 Seed Summary:');
    console.log(`   Team Members:    ${await TeamMember.countDocuments()}`);
    console.log(`   Achievements:    ${await Achievement.countDocuments()}`);
    console.log(`   Project Media:   ${await ProjectMedia.countDocuments()}`);
    console.log(`   Site Settings:   ${await SiteSetting.countDocuments()}`);

    console.log('\n✨ Content seed complete!');
    console.log('   Visit /team to see team members & achievements');
    console.log('   Visit /portfolio to see project media');
    console.log('   Visit /admin/content to manage all content');
    console.log('   Landing page stats will now reflect the seeded settings');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
