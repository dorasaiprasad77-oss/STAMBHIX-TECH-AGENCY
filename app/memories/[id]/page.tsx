'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Memory, Collection } from '@/types';

export default function MemoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set());
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);

  // Edit form
  const [formData, setFormData] = useState({ title: '', content: '', type: 'text', tags: '' });

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadMemory();
    loadCollections();
  }, [params.id]);

  const loadMemory = async () => {
    try {
      setLoading(true);
      const data = await api.getMemory(params.id as string);
      setMemory(data.memory);
      setFormData({
        title: data.memory.title,
        content: data.memory.content,
        type: data.memory.type,
        tags: (data.memory.tags || []).join(', '),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memory');
    } finally {
      setLoading(false);
    }
  };

  const loadCollections = async () => {
    try {
      const data = await api.getCollections();
      setCollections(data.collections);
    } catch {}
  };

  const clearMessages = () => { setError(''); setSuccessMsg(''); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.updateMemory(params.id as string, {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        tags,
      });
      setSuccessMsg('Memory updated successfully');
      setEditing(false);
      loadMemory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    clearMessages();
    try {
      const result = await api.analyzeMemory(params.id as string);
      setMemory(prev => prev ? {
        ...prev,
        aiSummary: result.analysis.summary,
        aiTags: result.analysis.tags,
      } : null);
      setSuccessMsg('AI analysis complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteMemory(params.id as string);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setDeleting(false);
    }
  };

  const toggleCollection = async (collectionId: string) => {
    try {
      const isIn = selectedCollections.has(collectionId);
      if (isIn) {
        await api.removeMemoryFromCollection(collectionId, params.id as string);
        selectedCollections.delete(collectionId);
      } else {
        await api.addMemoriesToCollection(collectionId, [params.id as string]);
        selectedCollections.add(collectionId);
      }
      setSelectedCollections(new Set(selectedCollections));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update collection');
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

  if (!api.isAuthenticated()) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !memory) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 text-center py-20">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Memory Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!memory) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {successMsg && (
          <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm p-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl mb-6 flex items-center gap-2" onClick={() => setError('')}>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Memory Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header Image */}
          {memory.images && memory.images.length > 0 && (
            <div className="relative h-64 sm:h-80 bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <img
                src={memory.images[0]}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
              {memory.images.length > 1 && (
                <div className="absolute bottom-3 right-3 flex gap-1">
                  {memory.images.slice(0, 5).map((img, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg border-2 border-white dark:border-gray-800 overflow-hidden shadow-sm"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {memory.images.length > 5 && (
                    <div className="w-8 h-8 rounded-lg bg-black/50 text-white text-xs flex items-center justify-center font-medium">
                      +{memory.images.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${typeColors[memory.type] || typeColors.other}`}>
                {memory.type}
              </span>
              {memory.favorite && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 flex items-center gap-1">
                  ⭐ Favorite
                </span>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(memory.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Title & Actions */}
            <div className="flex items-start justify-between gap-4 mb-6">
              {editing ? (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="flex-1 text-2xl font-bold bg-transparent border-b-2 border-indigo-500 text-gray-900 dark:text-white outline-none pb-1"
                  autoFocus
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{memory.title}</h1>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => { setEditing(!editing); }}
                  className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                  title={editing ? 'Cancel editing' : 'Edit'}
                >
                  {editing ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => setShowCollectionPicker(!showCollectionPicker)}
                  className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                  title="Add to collection"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            {editing ? (
              <div className="space-y-4 mb-6">
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="comma, separated"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                  {memory.content}
                </p>
              </div>
            )}

            {/* Additional images gallery */}
            {!editing && memory.images && memory.images.length > 1 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {memory.images.slice(1).map((img, i) => (
                    <img key={i} src={img} alt="" className="w-full h-32 object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {!editing && memory.tags && memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {memory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* AI Analysis */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🤖</span> AI Analysis
                </h3>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {analyzing ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>

              {memory.aiSummary ? (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{memory.aiSummary}</p>
                  {memory.aiTags && memory.aiTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {memory.aiTags.map((tag) => (
                        <span key={tag} className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No AI analysis yet. Click the button above to analyze this memory.
                  </p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Created</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(memory.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Updated</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(memory.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">ID</p>
                  <p className="text-gray-900 dark:text-white font-medium font-mono text-xs truncate">
                    {memory._id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Picker */}
        {showCollectionPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCollectionPicker(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add to Collection</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {collections.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No collections yet. Create one from the dashboard.
                  </p>
                ) : (
                  collections.map((col) => (
                    <label
                      key={col._id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCollections.has(col._id)}
                        onChange={() => toggleCollection(col._id)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: col.color }}
                      >
                        {col.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{col.name}</span>
                    </label>
                  ))
                )}
              </div>
              <button
                onClick={() => setShowCollectionPicker(false)}
                className="w-full mt-4 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDeleteConfirm(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🗑️</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Memory</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete "{memory.title}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-xl transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
