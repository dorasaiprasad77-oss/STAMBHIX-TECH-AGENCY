'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

// ─── Types ───
interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

interface RevenueItem {
  month: string;
  revenue: number;
  projects: number;
}

interface ServiceItem {
  name: string;
  value: number;
  color: string;
}

interface WeeklyItem {
  day: string;
  hours: number;
  tasks: number;
}

interface ProjectItem {
  _id?: string;
  name: string;
  client: string;
  status: string;
  amount: string;
  progress: number;
}

interface DashboardData {
  statCards: StatCard[];
  revenueData: RevenueItem[];
  serviceDistribution: ServiceItem[];
  weeklyActivity: WeeklyItem[];
  recentProjects: ProjectItem[];
}

// ─── API Client ───
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('memorychain_token');
  }
  return null;
};

async function fetchDashboard(): Promise<DashboardData> {
  const token = getToken();
  const res = await fetch(`/api/dashboard`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to load dashboard data');
  }

  const data = await res.json();
  return data;
}

// ─── Custom Tooltip ───
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-elevated border border-primary rounded-xl p-3 shadow-theme-lg">
        <p className="text-secondary text-xs mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-primary text-sm font-medium" style={{ color: entry.color }}>
            {entry.name === 'Revenue' || entry.name === 'revenue'
              ? `Revenue: ₹${Number(entry.value).toLocaleString()}`
              : entry.name === 'hours'
              ? `Hours: ${entry.value}h`
              : entry.name === 'tasks'
              ? `Tasks: ${entry.value}`
              : `${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Loading Skeleton ───
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="w-48 h-7 rounded-lg bg-card-hover animate-pulse" />
            <div className="w-64 h-4 rounded bg-inset animate-pulse" />
          </div>
          <div className="w-24 h-8 rounded-xl bg-card-hover animate-pulse" />
        </div>

        {/* Stat cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-card border border-primary">
              <div className="w-10 h-10 rounded-xl bg-card-hover animate-pulse mb-3" />
              <div className="w-20 h-6 rounded bg-card-hover animate-pulse mb-1" />
              <div className="w-16 h-4 rounded bg-inset animate-pulse" />
            </div>
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-primary">
            <div className="w-40 h-5 rounded bg-card-hover animate-pulse mb-2" />
            <div className="w-56 h-4 rounded bg-inset animate-pulse mb-6" />
            <div className="h-[280px] rounded-xl bg-inset animate-pulse" />
          </div>
          <div className="p-6 rounded-2xl bg-card border border-primary">
            <div className="w-40 h-5 rounded bg-card-hover animate-pulse mb-2" />
            <div className="w-44 h-4 rounded bg-inset animate-pulse mb-6" />
            <div className="h-[220px] rounded-xl bg-inset animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Error State ───
function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-primary pt-24 pb-12 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-semibold text-primary mb-2">Failed to Load Dashboard</h2>
        <p className="text-secondary text-sm mb-6">{message}</p>
        <p className="text-tertiary text-xs mb-6">
          Make sure the backend server is running on port 5000.
        </p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 gold-gradient text-black font-semibold rounded-xl hover:scale-[1.02] transition-all duration-300"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ───
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<'revenue' | 'activity'>('revenue');
  const [teamMembers] = useState([
    { name: 'Arjun Mehta', role: 'Lead Developer', avatar: 'AM', online: true },
    { name: 'Priya Sharma', role: 'UI/UX Designer', avatar: 'PS', online: true },
    { name: 'Rahul Verma', role: 'Project Manager', avatar: 'RV', online: false },
    { name: 'Neha Patel', role: 'Marketing Lead', avatar: 'NP', online: true },
    { name: 'Vikram Singh', role: 'Backend Dev', avatar: 'VS', online: false },
  ]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardData = await fetchDashboard();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error) return <DashboardError message={error} onRetry={loadData} />;
  if (!data) return <DashboardSkeleton />;

  const { statCards, revenueData, serviceDistribution, weeklyActivity, recentProjects } = data;

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-black text-xs font-bold">
                S
              </div>
              <h1 className="text-2xl font-bold text-primary">Agency Dashboard</h1>
            </div>
            <p className="text-secondary text-sm">Real-time overview of your agency performance</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary border border-primary rounded-lg hover:bg-card-hover transition-all inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">API</span>
            </div>
            <Link
              href="/analytics"
              className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary border border-primary rounded-xl hover:bg-card-hover transition-all inline-flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              className="group relative p-5 rounded-2xl bg-card border border-primary hover:border-[#D4A853]/20 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-card-hover flex items-center justify-center text-lg">
                    {card.icon}
                  </div>
                  <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                    {card.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary mb-0.5">{card.value}</p>
                <p className="text-tertiary text-sm">{card.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Revenue Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-primary">
            <div className="flex items-center justify-between mb-6">
              <div>
            <h3 className="text-primary font-semibold">Revenue Overview</h3>
            <p className="text-tertiary text-sm">Monthly revenue & project count</p>
              </div>
              <div className="flex gap-1 bg-card-hover rounded-lg p-1">
                <button
                  onClick={() => setActiveChart('revenue')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeChart === 'revenue' ? 'bg-[#D4A853] text-black' : 'text-secondary hover:text-primary'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setActiveChart('activity')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeChart === 'activity' ? 'bg-[#D4A853] text-black' : 'text-secondary hover:text-primary'
                  }`}
                >
                  Projects
                </button>
              </div>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'revenue' ? (
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4A853" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#D4A853"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                      dot={{ fill: '#D4A853', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#D4A853' }}
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="projects" fill="#D4A853" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Distribution */}
          <div className="p-6 rounded-2xl bg-card border border-primary">
            <h3 className="text-primary font-semibold mb-1">Service Distribution</h3>
            <p className="text-tertiary text-sm mb-6">Breakdown by category</p>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {serviceDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-secondary text-xs">{item.name}</span>
                  <span className="text-primary text-xs font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 p-6 rounded-2xl bg-card border border-primary"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-primary font-semibold">Recent Projects</h3>
                <p className="text-tertiary text-sm">Latest client projects & status</p>
              </div>
              <button className="text-[#D4A853] text-sm font-medium hover:text-[#F5C542] transition-colors">
                View All →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary">
                    <th className="text-left text-tertiary text-xs font-medium pb-3 pr-4">Project</th>
                    <th className="text-left text-tertiary text-xs font-medium pb-3 pr-4">Client</th>
                    <th className="text-left text-tertiary text-xs font-medium pb-3 pr-4">Status</th>
                    <th className="text-left text-tertiary text-xs font-medium pb-3 pr-4">Amount</th>
                    <th className="text-left text-tertiary text-xs font-medium pb-3">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-tertiary text-sm">
                        No projects yet. Seed the database to see data.
                      </td>
                    </tr>
                  ) : (
                    recentProjects.map((project, i) => (
                      <tr key={i} className="border-b border-secondary hover:bg-card-hover transition-colors">
                        <td className="py-3 pr-4">
                          <span className="text-primary text-sm font-medium">{project.name}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-secondary text-sm">{project.client}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            project.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                            project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' :
                            project.status === 'Review' ? 'bg-yellow-500/10 text-yellow-400' :
                            project.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' :
                            'bg-tertiary/10 text-tertiary'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-primary text-sm font-medium">{project.amount}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 rounded-full bg-primary/10 overflow-hidden">
                              <div
                                className="h-full rounded-full gold-gradient"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-secondary text-xs w-8 text-right">{project.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Team & Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="space-y-6"
          >
            {/* Weekly Hours */}
            <div className="p-5 rounded-2xl bg-card border border-primary">
              <h3 className="text-primary font-semibold mb-4">Weekly Hours</h3>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" stroke="#666" fontSize={10} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="hours" fill="#D4A853" radius={[4, 4, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Online */}
            <div className="p-5 rounded-2xl bg-card border border-primary">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-primary font-semibold">Team Online</h3>
                <span className="text-xs text-secondary">
                  <span className="text-green-400 font-medium">{teamMembers.filter(m => m.online).length}</span> / {teamMembers.length}
                </span>
              </div>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.name} className="flex items-center gap-3 group">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-black text-xs font-bold">
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-primary ${
                        member.online ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-primary text-sm font-medium">{member.name}</p>
                      <p className="text-tertiary text-xs">{member.role}</p>
                    </div>
                    <span className={`text-xs ${member.online ? 'text-green-400' : 'text-tertiary'}`}>
                      {member.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
