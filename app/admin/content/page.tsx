'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('memorychain_token');
  }
  return null;
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();    const res = await fetch(`${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  return data;
}

async function uploadImage(file: File): Promise<string> {
  const token = getToken();
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`/api/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data.image.url;
}

async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const token = getToken();
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  const res = await fetch(`/api/upload/multiple`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data.images.map((img: { url: string }) => img.url);
}

// ─── Multi Image Uploader ───
function MultiImageUploader({
  value,
  onChange,
  label,
  onToast,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  label: string;
  onToast?: (msg: string, type: 'success' | 'error') => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Validate files
    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        onToast?.(`"${file.name}" is not an image file.`, 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        onToast?.(`"${file.name}" is too large. Maximum size is 5MB.`, 'error');
        return;
      }
    }

    // Check total limit (backend allows max 5)
    const totalAfterAdd = (value?.length || 0) + fileArray.length;
    if (totalAfterAdd > 5) {
      onToast?.(`You can have at most 5 images total (currently ${value?.length || 0}).`, 'error');
      return;
    }

    cancelledRef.current = false;

    // Upload to server
    setUploading(true);
    try {
      const urls = await uploadMultipleImages(fileArray);
      if (cancelledRef.current) return;
      const updated = [...(value || []), ...urls];
      onChange(updated);
      onToast?.(`${urls.length} image(s) uploaded successfully`, 'success');
    } catch (err: any) {
      if (cancelledRef.current) return;
      onToast?.(err.message || 'Upload failed', 'error');
    } finally {
      if (!cancelledRef.current) {
        setUploading(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleRemove = (idx: number) => {
    cancelledRef.current = true;
    setUploading(false);
    const currentUrls = [...(value || [])];
    currentUrls.splice(idx, 1);
    onChange(currentUrls);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const showDropzone = !uploading && (value?.length || 0) < 5;

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {(value || []).map((url, idx) => (
          <div key={`img-${idx}`} className="relative group w-[calc(33.333%-8px)] sm:w-[calc(25%-9px)] aspect-video rounded-xl overflow-hidden border border-primary bg-card-hover">
            <img
              src={url}
              alt={`${label} ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => handleRemove(idx)}
                className="px-2 py-1 bg-red-500/40 hover:bg-red-500/60 text-white text-xs rounded-lg transition-all"
              >
                Remove
              </button>
            </div>
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-primary text-[10px]">
              {idx + 1}
            </span>
          </div>
        ))}
        {uploading && (
          <div className="w-[calc(33.333%-8px)] sm:w-[calc(25%-9px)] aspect-video rounded-xl border-2 border-dashed border-[#D4A853]/40 bg-[#D4A853]/5 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <svg className="animate-spin h-5 w-5 text-[#D4A853]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-[#D4A853] text-[10px]">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {showDropzone && (
        <div
          role="button"
          tabIndex={0}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          onKeyDown={handleKeyDown}
          className={`relative flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            dragOver
              ? 'border-[#D4A853] bg-[#D4A853]/5'
              : 'border-primary bg-card-hover hover:border-[#D4A853]/40 hover:bg-[#D4A853]/3'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleInputChange}
            className="hidden"
            disabled={uploading}
            multiple
          />
          <svg className="w-6 h-6 text-tertiary mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-secondary text-xs">
            {value?.length || 0 > 0
              ? `Drop more images or click (${value?.length || 0}/5 used)`
              : 'Drop multiple images or click to browse'
            }
          </p>
          <p className="text-tertiary text-[10px] mt-0.5">JPEG, PNG, GIF, WebP — max 5MB each — up to 5 total</p>
        </div>
      )}

      {/* Current count indicator */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-tertiary text-[10px]">
          {(value?.length || 0) > 0 ? `${value.length} image(s)` : 'No images uploaded'}
        </span>
        {(value?.length || 0) > 0 && (
          <button
            onClick={() => { onChange([]); }}
            className="text-red-400/80 hover:text-red-400 text-[10px] transition-all"
          >
            Remove all
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Image Uploader Component ───
function ImageUploader({
  value,
  onChange,
  label,
  onToast,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  onToast?: (msg: string, type: 'success' | 'error') => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);
  const objectUrlRef = useRef<string | null>(null);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onToast?.('Please select an image file (JPEG, PNG, GIF, WebP)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onToast?.('File too large. Maximum size is 5MB.', 'error');
      return;
    }

    // Revoke previous object URL if any
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    // Show local preview
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setPreview(objectUrl);
    cancelledRef.current = false;

    // Upload to server
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (cancelledRef.current) {
        // User removed the image during upload — ignore this result
        return;
      }
      onChange(url);
      onToast?.('Image uploaded successfully', 'success');
    } catch (err: any) {
      if (cancelledRef.current) return;
      onToast?.(err.message || 'Upload failed', 'error');
      setPreview(null);
    } finally {
      if (!cancelledRef.current) {
        setUploading(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    cancelledRef.current = true;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreview(null);
    setUploading(false);
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const displayUrl = preview || value;

  return (
    <div>
      {displayUrl ? (
        <div className="relative group rounded-xl overflow-hidden border border-primary">
          <img
            src={displayUrl}
            alt={label}
            className="w-full h-36 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="cursor-pointer px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg transition-all">
              Change
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleInputChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <button
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-500/40 hover:bg-red-500/60 text-white text-xs rounded-lg transition-all"
            >
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="flex items-center gap-2 text-white text-sm">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading...
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          onKeyDown={handleKeyDown}
          className={`relative flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            dragOver
              ? 'border-[#D4A853] bg-[#D4A853]/5'
              : 'border-primary bg-card-hover hover:border-[#D4A853]/40 hover:bg-[#D4A853]/3'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleInputChange}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex items-center gap-2 text-secondary text-sm">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading...
            </div>
          ) : (
            <>
              <svg className="w-8 h-8 text-tertiary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-secondary text-xs">Drop an image or click to browse</p>
              <p className="text-tertiary text-xs mt-0.5">JPEG, PNG, GIF, WebP — max 5MB</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tabs ───
type Tab = 'team' | 'achievements' | 'projects' | 'settings';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'team', label: 'Team Members', icon: '👥' },
  { id: 'achievements', label: 'Achievements', icon: '🏆' },
  { id: 'projects', label: 'Project Media', icon: '📁' },
  { id: 'settings', label: 'Site Settings', icon: '⚙️' },
];

// ─── Toast ───
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-theme-lg border ${
        type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
      } text-sm font-medium`}
    >
      {message}
    </motion.div>
  );
}

// ─── Generic List + Form ───
function GenericManager({
  title,
  icon,
  apiPath,
  fields,
  defaultItem,
  labelKey,
  imageKey,
}: {
  title: string;
  icon: string;
  apiPath: string;
  fields: { key: string; label: string; type: string; placeholder?: string; required?: boolean; options?: { value: string; label: string }[] }[];
  defaultItem: Record<string, any>;
  labelKey: string;
  imageKey?: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, any>>(defaultItem);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const loadItems = useCallback(async () => {
    try {
      const json = await apiFetch(`${apiPath}?all=true`);
      setItems(json.data || []);
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [apiPath]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Convert comma-separated string fields to arrays for fields that expect arrays
      const payload = { ...form };
      if (payload.tags && typeof payload.tags === 'string') {
        payload.tags = payload.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
      // Convert socialLinks from JSON string to object if needed
      if (payload.socialLinks && typeof payload.socialLinks === 'string') {
        try { payload.socialLinks = JSON.parse(payload.socialLinks); } catch { payload.socialLinks = {}; }
      }

      if (editing) {
        await apiFetch(`${apiPath}/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setToast({ message: `${title} item updated successfully`, type: 'success' });
      } else {
        await apiFetch(apiPath, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setToast({ message: `${title} item created successfully`, type: 'success' });
      }
      setShowForm(false);
      setEditing(null);
      setForm(defaultItem);
      loadItems();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await apiFetch(`${apiPath}/${id}`, { method: 'DELETE' });
      setToast({ message: `Item deleted successfully`, type: 'success' });
      loadItems();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setForm(defaultItem);
  };

  // ── Drag & Drop Reorder ──

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newItems = [...items];
    const [movedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, movedItem);

    // Update order values based on new positions
    const reordered = newItems.map((item, i) => ({
      ...item,
      order: i,
    }));

    setItems(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      const orderPayload = items.map((item, i) => ({
        _id: item._id,
        order: i,
      }));
      await apiFetch(`${apiPath}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ items: orderPayload }),
      });
      setToast({ message: 'Order saved successfully', type: 'success' });
      setReorderMode(false);
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelReorder = () => {
    setReorderMode(false);
    setDraggedIndex(null);
    setDragOverIndex(null);
    loadItems(); // Reload to reset order
  };

  const handleEnterReorder = () => {
    setReorderMode(true);
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-primary">{icon} {title}</h3>
        <div className="flex items-center gap-2">
          {!showForm && !reorderMode && (
            <>
              <button
                onClick={handleEnterReorder}
                className="px-3 py-2 border border-primary text-secondary text-sm font-medium rounded-xl hover:bg-card-hover hover:text-primary transition-all"
              >
                ↕ Reorder
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 gold-gradient text-black text-sm font-semibold rounded-xl hover:scale-[1.02] transition-all"
              >
                + Add New
              </button>
            </>
          )}
          {reorderMode && (
            <>
              <button
                onClick={handleSaveOrder}
                disabled={saving}
                className="px-4 py-2 gold-gradient text-black text-sm font-semibold rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : '✓ Save Order'}
              </button>
              <button
                onClick={handleCancelReorder}
                className="px-4 py-2 border border-primary text-secondary text-sm font-medium rounded-xl hover:bg-card-hover hover:text-primary transition-all"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {reorderMode && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-[#D4A853]/5 border border-[#D4A853]/20">
          <p className="text-[#D4A853] text-xs font-medium">
            ↕ Drag the handle (⠿) to reorder items, then click &ldquo;Save Order&rdquo; to persist.
          </p>
        </div>
      )}

      {showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card border border-primary mb-6"
        >
          <h4 className="text-primary font-semibold mb-4">{editing ? 'Edit Item' : 'Create New Item'}</h4>           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {fields.map((field) => (
              <div key={field.key} className={field.type === 'textarea' || field.type === 'json' || field.type === 'multi-file' ? 'sm:col-span-2' : ''}>
                <label className="block text-secondary text-xs font-medium mb-1.5">{field.label}</label>
                {field.type === 'multi-file' ? (
                  <MultiImageUploader
                    value={form[field.key] || []}
                    onChange={(urls) => setForm({ ...form, [field.key]: urls })}
                    label={field.label}
                    onToast={(msg, type) => setToast({ message: msg, type })}
                  />
                ) : field.type === 'file' ? (
                  <ImageUploader
                    value={form[field.key] || ''}
                    onChange={(url) => setForm({ ...form, [field.key]: url })}
                    label={field.label}
                    onToast={(msg, type) => setToast({ message: msg, type })}
                  />
                ) : field.type === 'select' && field.options ? (
                  <select
                    value={form[field.key] || ''}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-primary border border-primary text-primary text-sm focus:border-[#D4A853]/40 focus:outline-none"
                  >
                    {field.options.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={form[field.key] || ''}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-primary border border-primary text-primary text-sm placeholder-tertiary focus:border-[#D4A853]/40 focus:outline-none resize-none"
                  />
                ) : field.type === 'json' ? (
                  <textarea
                    value={typeof form[field.key] === 'object' ? JSON.stringify(form[field.key], null, 2) : form[field.key] || ''}
                    onChange={(e) => {
                      try { setForm({ ...form, [field.key]: JSON.parse(e.target.value) }); }
                      catch { setForm({ ...form, [field.key]: e.target.value }); }
                    }}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl bg-primary border border-primary text-primary text-sm placeholder-tertiag focus:border-[#D4A853]/40 focus:outline-none font-mono resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={form[field.key] || ''}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-3 py-2 rounded-xl bg-primary border border-primary text-primary text-sm placeholder-tertiary focus:border-[#D4A853]/40 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 gold-gradient text-black text-sm font-semibold rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all"
            >
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
            <button
              onClick={handleCancel}
              className="px-5 py-2 border border-primary text-secondary text-sm font-medium rounded-xl hover:bg-card-hover transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-primary animate-pulse">
              <div className="w-40 h-4 bg-card-hover rounded mb-2" />
              <div className="w-24 h-3 bg-inset rounded" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary text-sm">No items yet. Click &ldquo;+ Add New&rdquo; to create one.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => {
            const isDragging = draggedIndex === i;
            const isOver = dragOverIndex === i && !isDragging;

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: isDragging ? 1.02 : 1,
                  borderColor: isOver ? 'var(--stambhix-gold)' : undefined,
                }}
                transition={{ delay: i * 0.03 }}
                draggable={reorderMode}
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-4 rounded-xl bg-card border border-primary transition-all group ${
                  reorderMode ? 'cursor-grab active:cursor-grabbing select-none' : ''
                } ${isDragging ? 'opacity-60 shadow-theme-lg z-10' : ''} ${isOver ? '!border-[#D4A853] !bg-[#D4A853]/5' : ''}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {reorderMode && (
                    <span className="text-tertiary cursor-grab active:cursor-grabbing shrink-0 text-lg select-none" title="Drag to reorder">
                      ⠿
                    </span>
                  )}
                  {imageKey && !reorderMode && (() => {
                    const imgVal = item[imageKey];
                    const src = Array.isArray(imgVal) && imgVal.length > 0 ? imgVal[0] : (typeof imgVal === 'string' ? imgVal : null);
                    return src ? (
                      <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-primary bg-card-hover">
                        <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    ) : null;
                  })()}
                  <div className="min-w-0">
                    <p className="text-primary text-sm font-medium truncate">
                      {item[labelKey] || item[fields[0]?.key] || '(untitled)'}
                    </p>
                    <p className="text-tertiary text-xs truncate mt-0.5">
                      {item.position || item.category || item.description?.slice(0, 60) || ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  {reorderMode && (
                    <span className="text-xs text-tertiary px-2 py-0.5 rounded-full bg-card-hover border border-primary">
                      #{i + 1}
                    </span>
                  )}
                  {!reorderMode && (
                    <>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.isActive !== false ? 'bg-green-500/10 text-green-400' : 'bg-tertiary/10 text-tertiary'}`}>
                        {item.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                      <button onClick={() => handleEdit(item)}
                        className="px-3 py-1 text-xs rounded-lg border border-primary text-secondary hover:text-primary hover:bg-card-hover transition-all">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 text-xs rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Settings Manager ───
function SettingsManager() {
  const [settings, setSettings] = useState<any[]>([]);
  const [map, setMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      const json = await apiFetch('/api/settings');
      setSettings(json.data || []);
      setMap(json.map || {});
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = settings.map((s) => ({
        key: s.key,
        label: s.label,
        value: map[s.key],
        description: s.description,
      }));
      await apiFetch('/api/settings/bulk', {
        method: 'POST',
        body: JSON.stringify({ settings: payload }),
      });
      setToast({ message: 'Settings saved successfully', type: 'success' });
      loadSettings();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-xl bg-card border border-primary animate-pulse">
          <div className="w-40 h-4 bg-card-hover rounded mb-2" />
          <div className="w-24 h-3 bg-inset rounded" />
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h3 className="text-xl font-semibold text-primary mb-6">⚙️ Site Settings</h3>
      <p className="text-secondary text-sm mb-6">
        Manage global site settings like client counts, project counts, and other editable stats. These values are used across the landing page and public sections.
      </p>

      {settings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">⚙️</div>
          <p className="text-secondary text-sm mb-2">No settings found.</p>
          <p className="text-tertiary text-xs">Settings are auto-created when you save values below.</p>
          <button
            onClick={() => {
              setSettings([
                { key: 'trusted_clients', label: 'Trusted Clients', value: 500, type: 'number', description: 'Number shown in hero/stats section' },
                { key: 'projects_delivered', label: 'Projects Delivered', value: 1200, type: 'number', description: 'Total projects delivered count' },
                { key: 'expert_professionals', label: 'Expert Professionals', value: 50, type: 'number', description: 'Number of professionals on platform' },
                { key: 'cities_covered', label: 'Cities Covered', value: 15, type: 'number', description: 'Cities with active coverage' },
                { key: 'client_satisfaction', label: 'Client Satisfaction', value: '98%', type: 'string', description: 'Satisfaction percentage displayed' },
                { key: 'support_hours', label: 'Support Hours', value: '24/7', type: 'string', description: 'Support availability text' },
              ]);
              const newMap: Record<string, any> = {
                trusted_clients: 500,
                projects_delivered: 1200,
                expert_professionals: 50,
                cities_covered: 15,
                client_satisfaction: '98%',
                support_hours: '24/7',
              };
              setMap(newMap);
            }}
            className="mt-3 px-4 py-2 gold-gradient text-black text-sm font-semibold rounded-xl hover:scale-[1.02] transition-all"
          >
            + Load Default Settings
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {settings.map((s) => (
            <div key={s.key} className="p-4 rounded-xl bg-card border border-primary">
              <label className="block text-primary text-sm font-medium mb-1">{s.label}</label>
              {s.description && <p className="text-tertiary text-xs mb-2">{s.description}</p>}
              {s.type === 'number' ? (
                <input
                  type="number"
                  value={map[s.key] ?? s.value ?? ''}
                  onChange={(e) => setMap({ ...map, [s.key]: Number(e.target.value) })}
                  className="w-full max-w-xs px-3 py-2 rounded-xl bg-primary border border-primary text-primary text-sm focus:border-[#D4A853]/40 focus:outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={map[s.key] ?? s.value ?? ''}
                  onChange={(e) => setMap({ ...map, [s.key]: e.target.value })}
                  className="w-full max-w-sm px-3 py-2 rounded-xl bg-primary border border-primary text-primary text-sm focus:border-[#D4A853]/40 focus:outline-none"
                />
              )}
            </div>
          ))}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 gold-gradient text-black text-sm font-semibold rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ───
export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<Tab>('team');

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">⚡ Content Management</h1>
          <p className="text-secondary text-sm mt-1">Manage team members, achievements, project media, and site settings.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-card border border-primary mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'gold-gradient text-black'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 rounded-2xl bg-secondary border border-primary">
          {activeTab === 'team' && (
            <GenericManager
              title="Team Members"
              icon="👥"
              apiPath="/api/team"
              labelKey="name"
              imageKey="avatar"
              defaultItem={{ name: '', position: '', bio: '', avatar: '', socialLinks: { linkedin: '', twitter: '', github: '', website: '' }, order: 0, isActive: true }}
              fields={[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Arjun Mehta', required: true },
                { key: 'position', label: 'Position / Role', type: 'text', placeholder: 'e.g. CEO & Founder', required: true },
                { key: 'bio', label: 'Short Bio', type: 'textarea', placeholder: 'Brief description about this team member...' },
                { key: 'avatar', label: 'Avatar Image', type: 'file', placeholder: 'Upload profile photo' },
                { key: 'socialLinks', label: 'Social Links (JSON)', type: 'json', placeholder: '{"linkedin": "", "twitter": "", "github": "", "website": ""}' },
                { key: 'order', label: 'Display Order', type: 'number', placeholder: '0' },
                { key: 'isActive', label: 'Active', type: 'select', options: [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }] },
              ]}
            />
          )}

          {activeTab === 'achievements' && (
            <GenericManager
              title="Achievements"
              icon="🏆"
              apiPath="/api/achievements"
              labelKey="title"
              defaultItem={{ title: '', description: '', date: '', icon: '🏆', category: 'milestone', metric: '', metricValue: '', order: 0, isActive: true }}
              fields={[
                { key: 'title', label: 'Achievement Title', type: 'text', placeholder: 'e.g. First 1000 Clients', required: true },
                { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Details about this achievement...' },
                { key: 'date', label: 'Achievement Date', type: 'date', placeholder: '' },
                { key: 'icon', label: 'Icon (emoji)', type: 'text', placeholder: '🏆' },
                { key: 'category', label: 'Category', type: 'select', options: [
                  { value: 'milestone', label: 'Milestone' },
                  { value: 'award', label: 'Award' },
                  { value: 'growth', label: 'Growth' },
                  { value: 'recognition', label: 'Recognition' },
                  { value: 'other', label: 'Other' },
                ]},
                { key: 'metric', label: 'Metric Label', type: 'text', placeholder: 'e.g. Clients Served' },
                { key: 'metricValue', label: 'Metric Value', type: 'text', placeholder: 'e.g. 500+' },
                { key: 'order', label: 'Display Order', type: 'number', placeholder: '0' },
                { key: 'isActive', label: 'Active', type: 'select', options: [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }] },
              ]}
            />
          )}

          {activeTab === 'projects' && (
            <GenericManager
              title="Project Media"
              icon="📁"
              apiPath="/api/project-media"
              labelKey="projectName"
              imageKey="images"
              defaultItem={{ projectName: '', description: '', mediaType: 'image', imageUrl: '', images: [], videoUrl: '', thumbnailUrl: '', category: 'web', client: '', completionDate: '', tags: [], order: 0, isActive: true }}
              fields={[
                { key: 'projectName', label: 'Project Name', type: 'text', placeholder: 'e.g. E-Commerce Platform', required: true },
                { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the project...' },
                { key: 'mediaType', label: 'Media Type', type: 'select', options: [
                  { value: 'image', label: 'Image' },
                  { value: 'video', label: 'Video' },
                  { value: 'both', label: 'Both Image & Video' },
                ]},
                { key: 'images', label: 'Project Images (up to 5)', type: 'multi-file', placeholder: 'Upload project screenshots' },
                { key: 'imageUrl', label: 'Legacy Image (fallback)', type: 'file', placeholder: 'Upload single legacy image' },
                { key: 'videoUrl', label: 'Video URL (YouTube embed)', type: 'text', placeholder: 'https://www.youtube.com/embed/...' },
                { key: 'thumbnailUrl', label: 'Video Thumbnail', type: 'file', placeholder: 'Upload thumbnail image' },
                { key: 'category', label: 'Category', type: 'select', options: [
                  { value: 'web', label: 'Web Development' },
                  { value: 'app', label: 'App Development' },
                  { value: 'design', label: 'UI/UX Design' },
                  { value: 'seo', label: 'SEO' },
                  { value: 'home', label: 'Home Services' },
                  { value: 'other', label: 'Other' },
                ]},
                { key: 'client', label: 'Client Name', type: 'text', placeholder: 'e.g. TechVentures Inc.' },
                { key: 'completionDate', label: 'Completion Date', type: 'date', placeholder: '' },
                { key: 'tags', label: 'Tags (comma-separated)', type: 'text', placeholder: 'react, node.js, mongodb' },
                { key: 'order', label: 'Display Order', type: 'number', placeholder: '0' },
                { key: 'isActive', label: 'Active', type: 'select', options: [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }] },
              ]}
            />
          )}

          {activeTab === 'settings' && <SettingsManager />}
        </div>

        <p className="text-tertiary text-xs text-center mt-6">
          All changes are saved directly to the database and take effect immediately.
        </p>
      </div>
    </div>
  );
}
