'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Memory, Collection, MemoryStats, TimelineEntry } from '@/types';

type Tab = 'memories' | 'collections' | 'timeline';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('memories');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Auth check
  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  if (!api.isAuthenticated()) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your memories and collections</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/analytics"
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all inline-flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </Link>
            <Link
              href="/settings"
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all inline-flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
          {([
            { key: 'memories', label: 'Memories', icon: '📝' },
            { key: 'collections', label: 'Collections', icon: '📁' },
            { key: 'timeline', label: 'Timeline', icon: '📅' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'memories' && <MemoriesTab setError={setError} />}
        {activeTab === 'collections' && <CollectionsTab setError={setError} />}
        {activeTab === 'timeline' && <TimelineTab />}
      </div>
    </div>
  );
}

/* ─── Stats Cards ─── */
function StatsCards() {
  const [stats, setStats] = useState<MemoryStats['stats'] | null>(null);

  useEffect(() => {
    api.getMemoryStats()
      .then((data) => setStats(data.stats))
      .catch(() => {});
  }, []);

  if (!stats) return null;

  const cards = [
    { label: 'Total Memories', value: stats.total, icon: '📝', color: 'bg-blue-500' },
    { label: 'Favorites', value: stats.favorites, icon: '⭐', color: 'bg-yellow-500' },
    { label: 'This Week', value: stats.recentWeek, icon: '📅', color: 'bg-green-500' },
    { label: 'Types Used', value: Object.keys(stats.byType).length, icon: '🏷️', color: 'bg-purple-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center text-lg`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Memories Tab ─── */
function MemoriesTab({ setError }: { setError: (e: string) => void }) {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchField, setSearchField] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [favoriteFilter, setFavoriteFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', type: 'text', tags: '' });
  const [creating, setCreating] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // Collection association
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedMemories, setSelectedMemories] = useState<Set<string>>(new Set());
  const [selectedCollectionId, setSelectedCollectionId] = useState('');

  // Image upload
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchField);
      setPage(1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchField]);

  // Fetch memories
  const fetchMemories = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getMemories({
        page,
        limit: 12,
        search: debouncedSearch || undefined,
        type: typeFilter || undefined,
        favorite: favoriteFilter === 'true' ? true : favoriteFilter === 'false' ? false : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setMemories(data.memories);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      if (err instanceof Error && err.message === 'Authentication required') {
        router.push('/login');
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load memories');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, typeFilter, favoriteFilter, startDate, endDate, router, setError]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  // Load collections for add-to-collection feature
  useEffect(() => {
    api.getCollections().then(d => setCollections(d.collections)).catch(() => {});
  }, []);

  // Reset filters
  const resetFilters = () => {
    setSearchField('');
    setTypeFilter('');
    setFavoriteFilter('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  // Create/Update memory
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      const data: any = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        tags,
      };
      if (uploadedImages.length > 0) data.images = uploadedImages;

      if (editingMemory) {
        await api.updateMemory(editingMemory._id, data);
      } else {
        await api.createMemory(data);
      }

      setShowCreateModal(false);
      setEditingMemory(null);
      setFormData({ title: '', content: '', type: 'text', tags: '' });
      setUploadedImages([]);
      fetchMemories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save memory');
    } finally {
      setCreating(false);
    }
  };

  // Delete memory
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this memory?')) return;
    try {
      await api.deleteMemory(id);
      fetchMemories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  // Edit memory
  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
    setFormData({
      title: memory.title,
      content: memory.content,
      type: memory.type,
      tags: (memory.tags || []).join(', '),
    });
    setUploadedImages(memory.images || []);
    setShowCreateModal(true);
  };

  // Analyze memory
  const handleAnalyze = async (memory: Memory) => {
    setAnalyzingId(memory._id);
    try {
      const result = await api.analyzeMemory(memory._id);
      setMemories(prev => prev.map(m =>
        m._id === memory._id ? { ...m, aiSummary: result.analysis.summary, aiTags: result.analysis.tags } : m
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzingId(null);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (memory: Memory) => {
    try {
      await api.updateMemory(memory._id, { favorite: !memory.favorite });
      fetchMemories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const result = await api.uploadImage(files[i]);
        setUploadedImages(prev => [...prev, result.image.url]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Export
  const handleExport = (format: 'json' | 'csv') => {
    api.exportMemories(format).catch((err) => setError(err instanceof Error ? err.message : 'Export failed'));
  };

  // Add to collection
  const toggleMemorySelection = (id: string) => {
    setSelectedMemories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddToCollection = async () => {
    if (!selectedCollectionId || selectedMemories.size === 0) return;
    try {
      await api.addMemoriesToCollection(selectedCollectionId, Array.from(selectedMemories));
      setShowCollectionModal(false);
      setSelectedMemories(new Set());
      setSelectedCollectionId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to collection');
    }
  };

  const typeColors: Record<string, string> = {
    text: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    note: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    journal: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    idea: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    reminder: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  };

  return (
    <div>
      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchField}
              onChange={(e) => { setSearchField(e.target.value); }}
              placeholder="Search memories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="text">Text</option>
            <option value="note">Note</option>
            <option value="journal">Journal</option>
            <option value="idea">Idea</option>
            <option value="reminder">Reminder</option>
            <option value="other">Other</option>
          </select>

          <select
            value={favoriteFilter}
            onChange={(e) => { setFavoriteFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="true">Favorites</option>
            <option value="false">Non-Favorites</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            title="Start date"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            title="End date"
          />

          {(searchField || typeFilter || favoriteFilter || startDate || endDate) && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => { setEditingMemory(null); setFormData({ title: '', content: '', type: 'text', tags: '' }); setUploadedImages([]); setShowCreateModal(true); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Memory
          </button>

          {selectedMemories.size > 0 && (
            <button
              onClick={() => setShowCollectionModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm transition-colors inline-flex items-center gap-1.5"
            >
              Add to Collection ({selectedMemories.size})
            </button>
          )}

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => handleExport('json')}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Memories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No memories found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchField || typeFilter || favoriteFilter || startDate || endDate
              ? 'Try adjusting your filters'
              : 'Start capturing your thoughts and experiences'}
          </p>
          {!searchField && !typeFilter && !favoriteFilter && !startDate && !endDate && (
            <button
              onClick={() => { setEditingMemory(null); setFormData({ title: '', content: '', type: 'text', tags: '' }); setShowCreateModal(true); }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Create your first memory
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => (
              <div
                key={memory._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow p-6 group"
              >
                {/* Selection checkbox */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedMemories.has(memory._id)}
                      onChange={() => toggleMemorySelection(memory._id)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[memory.type] || typeColors.other}`}>
                      {memory.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFavorite(memory)}
                      className={`transition-colors ${memory.favorite ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'}`}
                    >
                      <svg className="w-5 h-5" fill={memory.favorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Images */}
                {memory.images && memory.images.length > 0 && (
                  <div className="flex gap-1 mb-3 overflow-x-auto">
                    {memory.images.slice(0, 3).map((img, i) => (
                      <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    ))}
                    {memory.images.length > 3 && (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                        +{memory.images.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{memory.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">{memory.content}</p>

                {memory.tags && memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {memory.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                    {memory.tags.length > 4 && (
                      <span className="text-xs text-gray-400">+{memory.tags.length - 4}</span>
                    )}
                  </div>
                )}

                {memory.aiSummary && (
                  <div className="mb-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                      <span>🤖</span> AI Summary
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{memory.aiSummary}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(memory)}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAnalyze(memory)}
                      disabled={analyzingId === memory._id}
                      className="text-indigo-500 hover:text-indigo-700 disabled:opacity-50 font-medium"
                    >
                      {analyzingId === memory._id ? '...' : 'AI'}
                    </button>
                    <button
                      onClick={() => handleDelete(memory._id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Memory Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingMemory ? 'Edit Memory' : 'New Memory'}
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Memory title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Write your memory..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="text">Text</option>
                    <option value="note">Note</option>
                    <option value="journal">Journal</option>
                    <option value="idea">Idea</option>
                    <option value="reminder">Reminder</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="comma, separated"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {uploadedImages.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors"
                >
                  {creating ? 'Saving...' : editingMemory ? 'Update Memory' : 'Create Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add to Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCollectionModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add to Collection</h2>
            <select
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
            >
              <option value="">Select a collection...</option>
              {collections.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCollectionModal(false)}
                className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCollection}
                disabled={!selectedCollectionId}
                className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Collections Tab ─── */
function CollectionsTab({ setError }: { setError: (e: string) => void }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', color: '#4F46E5' });
  const [creating, setCreating] = useState(false);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getCollections();
      setCollections(data.collections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, [setError]);

  useEffect(() => { fetchCollections(); }, [fetchCollections]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createCollection(formData);
      setShowCreate(false);
      setFormData({ name: '', description: '', color: '#4F46E5' });
      fetchCollections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create collection');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this collection? (Memories will not be deleted)')) return;
    try {
      await api.deleteCollection(id);
      fetchCollections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const presetColors = ['#4F46E5', '#7C3AED', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#6366F1'];

  if (showDetail) {
    return (
      <CollectionDetail
        collection={showDetail}
        onBack={() => setShowDetail(null)}
        onDelete={async () => {
          await handleDelete(showDetail._id);
          setShowDetail(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Collections</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors inline-flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Collection
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No collections yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Group your memories into themed collections</p>
          <button
            onClick={() => setShowCreate(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Create your first collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <div
              key={col._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all p-5 cursor-pointer group"
              onClick={() => setShowDetail(col)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: col.color }}>
                  {col.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(col._id); }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{col.name}</h3>
              {col.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{col.description}</p>
              )}
              <p className="text-xs text-gray-400">
                {Array.isArray(col.memories) ? col.memories.length : 0} memories • Updated {new Date(col.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">New Collection</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Collection name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Optional description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
                <div className="flex gap-2">
                  {presetColors.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-8 h-8 rounded-full transition-all ${formData.color === c ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Collection Detail ─── */
function CollectionDetail({ collection, onBack, onDelete }: { collection: Collection; onBack: () => void; onDelete: () => void }) {
  const [col, setCol] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getCollection(collection._id)
      .then(d => setCol(d.collection))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [collection._id]);

  const removeMemory = async (memoryId: string) => {
    try {
      await api.removeMemoryFromCollection(collection._id, memoryId);
      setCol(prev => prev ? {
        ...prev,
        memories: (prev.memories as Memory[]).filter(m => m._id !== memoryId),
      } : null);
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: collection.color }}>
              {collection.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{collection.name}</h2>
              {collection.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{collection.description}</p>
              )}
            </div>
          </div>
        </div>
        <button onClick={onDelete} className="text-red-400 hover:text-red-600 text-sm font-medium">
          Delete Collection
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : !col || !col.memories || (col.memories as Memory[]).length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No memories in this collection</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Select memories from the Memories tab and add them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(col.memories as Memory[]).map(m => (
            <div key={m._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {m.type}
                </span>
                <button onClick={() => removeMemory(m._id)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{m.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{m.content}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(m.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Timeline Tab ─── */
function TimelineTab() {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMemoryTimeline()
      .then(d => setTimeline(d.timeline))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">Loading timeline...</p>
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No memories yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Create memories to see them on your timeline</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-8">
        {timeline.map((entry) => {
          const [year, month] = entry.month.split('-');
          const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;

          return (
            <div key={entry.month} className="relative pl-10 md:pl-16">
              {/* Timeline dot */}
              <div className="absolute left-2.5 md:left-6.5 top-1.5 w-3 h-3 bg-indigo-500 rounded-full ring-4 ring-white dark:ring-gray-900" />

              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{monthLabel}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{entry.count} memories</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {entry.items.map((item) => {
                  const typeEmoji: Record<string, string> = {
                    text: '📝', note: '📋', journal: '📖', idea: '💡', reminder: '⏰', other: '📌',
                  };
                  return (
                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{typeEmoji[item.type] || '📌'}</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
