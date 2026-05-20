/**
 * Seed script for Stambhix Tech Agency dashboard data.
 * Run: node src/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');
const Contact = require('./models/Contact');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env file');
  process.exit(1);
}

const seedProjects = [
  { name: 'E-Commerce Platform', client: 'TechVentures', category: 'web', status: 'Completed', amount: 450000, progress: 100, startDate: new Date('2024-01-15') },
  { name: 'Mobile Banking App', client: 'FinCorp', category: 'app', status: 'In Progress', amount: 820000, progress: 65, startDate: new Date('2024-03-01') },
  { name: 'Restaurant Website', client: 'FoodieHub', category: 'web', status: 'In Progress', amount: 180000, progress: 40, startDate: new Date('2024-06-10') },
  { name: 'SEO Optimization', client: 'GrowthLabs', category: 'seo', status: 'Completed', amount: 95000, progress: 100, startDate: new Date('2024-02-20') },
  { name: 'UI/UX Redesign', client: 'CreativeStudio', category: 'design', status: 'Review', amount: 240000, progress: 85, startDate: new Date('2024-05-05') },
  { name: 'Hotel Booking System', client: 'StayEasy', category: 'web', status: 'Completed', amount: 380000, progress: 100, startDate: new Date('2024-01-10') },
  { name: 'Fitness Tracker App', client: 'HealthFirst', category: 'app', status: 'Completed', amount: 560000, progress: 100, startDate: new Date('2024-02-01') },
  { name: 'Social Media Dashboard', client: 'BuzzMetrics', category: 'web', status: 'Completed', amount: 290000, progress: 100, startDate: new Date('2024-03-15') },
  { name: 'Smart Home IoT App', client: 'HomeAuto', category: 'app', status: 'In Progress', amount: 720000, progress: 55, startDate: new Date('2024-04-20') },
  { name: 'Corporate Branding', client: 'ElegantCorp', category: 'design', status: 'Completed', amount: 150000, progress: 100, startDate: new Date('2024-01-25') },
  { name: 'Content Marketing Strategy', client: 'BrandVoice', category: 'seo', status: 'Completed', amount: 110000, progress: 100, startDate: new Date('2024-02-10') },
  { name: 'AC Installation Service', client: 'CoolZone', category: 'home', status: 'Completed', amount: 45000, progress: 100, startDate: new Date('2024-03-05') },
  { name: 'Portfolio Website', client: 'DesignPro', category: 'web', status: 'Completed', amount: 85000, progress: 100, startDate: new Date('2024-04-01') },
  { name: 'Food Delivery App', client: 'QuickBite', category: 'app', status: 'Review', amount: 640000, progress: 90, startDate: new Date('2024-05-20') },
  { name: 'SaaS Landing Page', client: 'CloudStack', category: 'web', status: 'Completed', amount: 120000, progress: 100, startDate: new Date('2024-06-01') },
  { name: 'E-Learning Platform', client: 'EduSmart', category: 'web', status: 'In Progress', amount: 510000, progress: 35, startDate: new Date('2024-07-10') },
  { name: 'Plumbing Services App', client: 'PipePro', category: 'home', status: 'In Progress', amount: 95000, progress: 60, startDate: new Date('2024-08-01') },
  { name: 'Analytics Dashboard', client: 'DataViz', category: 'web', status: 'Completed', amount: 340000, progress: 100, startDate: new Date('2024-03-20') },
  { name: 'Video Editing Suite', client: 'CutMaster', category: 'design', status: 'Completed', amount: 210000, progress: 100, startDate: new Date('2024-04-15') },
  { name: 'Inventory Management', client: 'StockWise', category: 'web', status: 'In Progress', amount: 420000, progress: 45, startDate: new Date('2024-06-20') },
  { name: 'Real Estate Portal', client: 'HomeFind', category: 'web', status: 'Review', amount: 380000, progress: 80, startDate: new Date('2024-07-05') },
  { name: 'Payment Gateway Integration', client: 'PayFlow', category: 'app', status: 'Completed', amount: 175000, progress: 100, startDate: new Date('2024-02-25') },
  { name: 'Electrical Wiring Service', client: 'BrightHome', category: 'home', status: 'Completed', amount: 35000, progress: 100, startDate: new Date('2024-05-10') },
  { name: 'Chatbot Development', client: 'TalkBot', category: 'app', status: 'In Progress', amount: 280000, progress: 30, startDate: new Date('2024-08-15') },
];

const seedContacts = [
  { name: 'Rajesh Kumar', email: 'rajesh@example.com', service: 'web', message: 'We need a complete e-commerce website for our clothing brand with payment integration and inventory management.', status: 'replied' },
  { name: 'Anita Desai', email: 'anita@example.com', service: 'app', message: 'Looking for a team to build a cross-platform mobile app for our food delivery service.', status: 'read' },
  { name: 'Vikram Patel', email: 'vikram@example.com', service: 'design', message: 'Need UI/UX redesign for our SaaS platform. The current design is outdated and not converting well.', status: 'new' },
  { name: 'Priya Singh', email: 'priya@example.com', service: 'seo', message: 'Our website traffic has dropped significantly. Need a comprehensive SEO audit and strategy.', status: 'new' },
  { name: 'Amit Sharma', email: 'amit@example.com', service: 'home', message: 'Need electrical rewiring for our new office space in Bangalore. Approx 2000 sq ft.', status: 'replied' },
  { name: 'Sunita Reddy', email: 'sunita@example.com', service: 'web', message: 'Want to build a membership portal for our fitness center with payment and scheduling features.', status: 'new' },
  { name: 'Deepak Joshi', email: 'deepak@example.com', service: 'app', message: 'Looking for a team to maintain and add features to our existing logistics app.', status: 'read' },
  { name: 'Kavita Nair', email: 'kavita@example.com', service: 'other', message: 'Interested in a consultation for our digital transformation roadmap. Please reach out.', status: 'new' },
];

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing projects and contacts...');
    await Project.deleteMany({});
    await Contact.deleteMany({});

    // Insert projects
    console.log(`📦 Seeding ${seedProjects.length} projects...`);
    const projects = await Project.insertMany(seedProjects);
    console.log(`✅ ${projects.length} projects created`);

    // Insert contacts
    console.log(`📦 Seeding ${seedContacts.length} contacts...`);
    const contacts = await Contact.insertMany(seedContacts);
    console.log(`✅ ${contacts.length} contacts created`);

    // Verify
    const projectCount = await Project.countDocuments();
    const contactCount = await Contact.countDocuments();
    const totalRevenue = await Project.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    console.log('\n📊 Dashboard Summary:');
    console.log(`   Projects: ${projectCount}`);
    console.log(`   Contacts: ${contactCount}`);
    console.log(`   Revenue: ₹${(totalRevenue[0]?.total || 0).toLocaleString()}`);

    console.log('\n✨ Seed complete!');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
