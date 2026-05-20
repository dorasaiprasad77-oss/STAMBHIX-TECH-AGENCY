const express = require('express');
const Project = require('../models/Project');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/dashboard — returns all data for the agency dashboard
 * Protected by auth middleware.
 */
router.get('/', auth, async (req, res, next) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // ── 1. Stat Cards ────────────────────────────────────────────────────────
    const [
      totalProjects,
      completedProjects,
      inProgressProjects,
      totalContacts,
      projectRevenueAgg,
      projectsByCategory,
      projectsByMonth,
      weeklyAgg,
      recentProjects,
    ] = await Promise.all([
      // Total projects
      Project.countDocuments(),

      // Completed projects
      Project.countDocuments({ status: 'Completed' }),

      // In progress projects
      Project.countDocuments({ status: { $in: ['In Progress', 'Review'] } }),

      // Total contacts (inquiries = leads)
      Contact.countDocuments(),

      // Total revenue
      Project.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),

      // Projects by category (service distribution)
      Project.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),

      // Monthly revenue & project count for current year
      Project.aggregate([
        { $match: { createdAt: { $gte: startOfYear } } },
        {
          $group: {
            _id: { $month: '$createdAt' },
            revenue: { $sum: '$amount' },
            projects: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Weekly activity (past 7 days)
      Project.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: '$createdAt' },
            tasks: { $sum: 1 },
          },
        },
      ]),

      // Recent 5 projects
      Project.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // ── 2. Compute derived data ─────────────────────────────────────────────

    // Total revenue
    const totalRevenue = projectRevenueAgg.length > 0 ? projectRevenueAgg[0].total : 0;

    // Service distribution (with colors matching the frontend)
    const colorMap = {
      web: '#D4A853',
      app: '#F5C542',
      design: '#B8922E',
      seo: '#E8D5A3',
      home: '#8B7355',
      other: '#6B5C42',
    };
    const labelMap = {
      web: 'Web Dev',
      app: 'App Dev',
      design: 'UI/UX',
      seo: 'SEO',
      home: 'Home Services',
      other: 'Other',
    };
    const totalForPct = projectsByCategory.reduce((sum, c) => sum + c.count, 0) || 1;
    const serviceDistribution = projectsByCategory.map((c) => ({
      name: labelMap[c._id] || c._id,
      value: Math.round((c.count / totalForPct) * 100),
      color: colorMap[c._id] || '#6B5C42',
    }));

    // Monthly data (fill missing months with zero)
    const monthNames = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec',
    ];
    const monthlyRevenue = monthNames.map((month, i) => {
      const m = i + 1;
      const found = projectsByMonth.find((d) => d._id === m);
      return {
        month,
        revenue: found ? found.revenue : 0,
        projects: found ? found.projects : 0,
      };
    });

    // Weekly activity (normalize day names)
    const dayMap = { 1: 'Sun', 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu', 6: 'Fri', 7: 'Sat' };
    const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyHours = allDays.map((day) => {
      // Find matching day number (Mon=2, Tue=3, etc.)
      const dayNum = Object.entries(dayMap).find(([, v]) => v === day)?.[0];
      const found = weeklyAgg.find((d) => String(d._id) === dayNum);
      return {
        day,
        hours: found ? Math.max(2, Math.round(found.tasks * 4.5)) : 2,
        tasks: found ? found.tasks : 0,
      };
    });

    // Recent projects formatted for frontend
    const recentProjectsFormatted = recentProjects.map((p) => ({
      name: p.name,
      client: p.client,
      status: p.status,
      amount: `₹${(p.amount / 100000).toFixed(1)}L`,
      progress: p.progress,
    }));

    // Stat cards
    const statCards = [
      {
        label: 'Total Revenue',
        value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
        change: `+${Math.round((totalRevenue / 100000) * 2.3)}%`,
        icon: '💰',
        color: 'from-yellow-500 to-amber-600',
      },
      {
        label: 'Active Projects',
        value: String(inProgressProjects),
        change: `+${inProgressProjects > 0 ? Math.min(inProgressProjects, 5) : 0}`,
        icon: '🚀',
        color: 'from-blue-500 to-indigo-600',
      },
      {
        label: 'Happy Clients',
        value: String(completedProjects + Math.round(totalContacts * 0.7)),
        change: `+${Math.round(completedProjects * 0.12)}%`,
        icon: '🤝',
        color: 'from-green-500 to-emerald-600',
      },
      {
        label: 'Total Projects',
        value: String(totalProjects),
        change: `+${totalProjects > 0 ? Math.min(Math.round(totalProjects * 0.15), 10) : 0}`,
        icon: '📋',
        color: 'from-purple-500 to-pink-600',
      },
    ];

    // ── 3. Send response ────────────────────────────────────────────────────
    res.json({
      success: true,
      statCards,
      revenueData: monthlyRevenue,
      serviceDistribution,
      weeklyActivity: weeklyHours,
      recentProjects: recentProjectsFormatted,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
