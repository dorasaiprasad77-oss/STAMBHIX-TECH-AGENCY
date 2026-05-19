'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts';
import { api } from '@/lib/api';
import type { MemoryStats, TimelineResponse, Memory, WeeklyActivity, TypeDistribution } from '@/types';

const TYPE_COLORS: Record<string, string> = {
  text: '#3B82F6',
  note: '#22C55E',
  journal: '#A855F7',
  idea: '#EAB308',
  reminder: '#EF4444',
  other: '#6B7280',
};

const TYPE_LABELS: Record<string, string> = {
  text: 'Text',
  note: 'Note',
  journal: 'Journal',
  idea: 'Idea',
  reminder: 'Reminder',
  other: 'Other',
};

interface WeeklyDataPoint {
  date: string;
  count: number;
  fullDate: string;
  day: string;
}

interface MonthlyDataPoint {
  month: string;
  count: number;
  label: string;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<MemoryStats['stats'] | null>(null);
  const [timeline, setTimeline] = useState<TimelineResponse['timeline']>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState<'overview' | 'types' | 'weekly' | 'monthly'>('overview');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsData, timelineData, memoriesData] = await Promise.all([
        api.getMemoryStats(),
        api.getMemoryTimeline(),
        api.getMemories({ limit: 1000 }),
      ]);
      setStats(statsData.stats);
      setTimeline(timelineData.timeline);
      setMemories(memoriesData.memories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (!api.isAuthenticated()) return null;

  // Compute chart data
  const typeData = stats
    ? Object.entries(stats.byType).map(([name, value]) => ({
        name: TYPE_LABELS[name] || name,
        value,
        color: TYPE_COLORS[name] || '#6B7280',
      })).sort((a, b) => b.value - a.value)
    : [];

  // Weekly activity (last 7 days)
  const weeklyData: WeeklyDataPoint[] = (() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days: WeeklyDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = dayNames[d.getDay()];
      const count = memories.filter(m =>
        m.createdAt.slice(0, 10) === dateStr
      ).length;
      days.push({
        date: dateStr,
        count,
        fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        day: dayName,
      });
    }
    return days;
  })();

  // Monthly distribution
  const monthlyData: MonthlyDataPoint[] = timeline.map(entry => {
    const [year, month] = entry.month.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: entry.month,
      count: entry.count,
      label: `${monthNames[parseInt(month) - 1]} ${year}`,
    };
  });

  const totalMemories = stats?.total || 0;
  const favoriteCount = stats?.favorites || 0;
  const recentWeek = stats?.recentWeek || 0;
  const typeCount = typeData.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label || payload[0].name}</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
            {payload[0].value} {payload[0].value === 1 ? 'memory' : 'memories'}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChartView = () => {
    switch (chartView) {
      case 'types':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Memory Types Distribution</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Horizontal Bar Chart */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#9CA3AF' }}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {typeData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'weekly':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">This Week's Activity</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    fill="url(#weeklyGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'monthly':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Monthly Memory Count</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {monthlyData.map((_, index) => (
                      <Cell key={index} fill={index % 2 === 0 ? '#4F46E5' : '#818CF8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              ))}
            </div>
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Visual insights into your memories</p>
          </div>
          <button
            onClick={loadData}
            className="ml-auto px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Memories', value: totalMemories, icon: '📝', color: 'bg-indigo-500', change: '' },
            { label: 'Favorites', value: favoriteCount, icon: '⭐', color: 'bg-yellow-500', change: `${totalMemories > 0 ? Math.round((favoriteCount / totalMemories) * 100) : 0}%` },
            { label: 'This Week', value: recentWeek, icon: '📅', color: 'bg-green-500', change: `${weeklyData.reduce((s, d) => s + d.count, 0) > 0 ? 'active' : 'inactive'}` },
            { label: 'Types Used', value: typeCount, icon: '🏷️', color: 'bg-purple-500', change: `${typeCount} types` },
          ].map((card) => (
            <div key={card.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center text-lg shadow-sm`}>
                  {card.icon}
                </div>
                {card.change && (
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {card.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Chart Type Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {([
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'types', label: 'Types', icon: '🏷️' },
            { key: 'weekly', label: 'Weekly', icon: '📈' },
            { key: 'monthly', label: 'Monthly', icon: '📅' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setChartView(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                chartView === tab.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chart Content */}
        {chartView === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Week</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="overviewWeekly" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} fill="url(#overviewWeekly)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Type distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Memory Types</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly bar chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: '#9CA3AF' }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {monthlyData.map((_, index) => (
                        <Cell key={index} fill={index % 2 === 0 ? '#4F46E5' : '#818CF8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Insights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">Most Used Type</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                    {typeData.length > 0 ? typeData[0].name : 'N/A'}
                  </p>
                  <p className="text-sm text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                    {typeData.length > 0 ? `${typeData[0].value} memories` : ''}
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wide">Daily Average</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300 mt-1">
                    {totalMemories > 0 && memories.length > 0
                      ? Math.max(1, Math.round(totalMemories / Math.ceil((Date.now() - new Date(memories[memories.length - 1]?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))))
                      : '-'}
                  </p>
                  <p className="text-sm text-green-600/70 dark:text-green-400/70 mt-0.5">memories per day</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wide">Busiest Month</p>
                  <p className="text-xl font-bold text-purple-700 dark:text-purple-300 mt-1">
                    {monthlyData.length > 0
                      ? monthlyData.reduce((max, m) => m.count > max.count ? m : max, monthlyData[0]).label
                      : 'N/A'}
                  </p>
                  <p className="text-sm text-purple-600/70 dark:text-purple-400/70 mt-0.5">
                    {monthlyData.length > 0
                      ? `${monthlyData.reduce((max, m) => m.count > max.count ? m : max, monthlyData[0]).count} memories`
                      : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : renderChartView()}
      </div>
    </div>
  );
}
