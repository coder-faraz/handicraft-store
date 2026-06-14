// FILE: src/app/admin/banners/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Image as ImageIcon, Check, X, ToggleLeft, ToggleRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: { url: string; publicId: string };
  link?: string;
  position: 'hero' | 'mid' | 'footer';
  isActive: boolean;
  sortOrder: number;
}

const positionColors: Record<string, string> = {
  hero:   'bg-blue-100 text-blue-700',
  mid:    'bg-amber-100 text-amber-700',
  footer: 'bg-purple-100 text-purple-700',
};

const emptyForm = { title: '', subtitle: '', link: '', position: 'hero' as const, sortOrder: 0, isActive: true, image: null as { url: string; publicId: string } | null };

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchBanners = async () => {
    const res = await fetch('/api/admin/banners');
    const data = await res.json();
    if (data.success) setBanners(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'banners');
    const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
    const data = await res.json();
    if (data.success) setForm((f) => ({ ...f, image: { url: data.data.url, publicId: data.data.publicId } }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.image) { setError('Please upload a banner image.'); return; }
    setSubmitting(true); setError('');

    const res = await fetch('/api/admin/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...form, image: form.image }),
    });
    const data = await res.json();
    if (!data.success) { setError(data.error ?? 'Error.'); setSubmitting(false); return; }
    setShowForm(false);
    setForm({ ...emptyForm });
    fetchBanners();
    setSubmitting(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete banner "${title}"?`)) return;
    setDeletingId(id);
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchBanners();
    setDeletingId(null);
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchBanners();
  };

  const inputClass = 'w-full rounded-lg border border-admin-border px-3 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 bg-white';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Banners</h1>
          <p className="text-sm text-admin-muted mt-0.5">{banners.length} banners</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-[#7a3c10] transition-colors">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {/* Add Banner Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-admin-border p-5">
          <h3 className="font-semibold text-admin-text mb-4">New Banner</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-admin-muted mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Banner headline" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-muted mb-1.5">Position *</label>
              <select value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value as any }))} className={inputClass}>
                <option value="hero">Hero (Top)</option>
                <option value="mid">Mid Page</option>
                <option value="footer">Footer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-muted mb-1.5">Subtitle</label>
              <input value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} placeholder="Optional tagline" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-muted mb-1.5">Link URL</label>
              <input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} placeholder="https://..." className={inputClass} />
            </div>

            {/* Image upload */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-admin-muted mb-1.5">Banner Image *</label>
              <div className="flex items-start gap-4">
                {form.image ? (
                  <div className="relative w-40 h-20 rounded-lg overflow-hidden border border-admin-border flex-shrink-0">
                    <Image src={form.image.url} alt="Banner preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-40 h-20 rounded-lg border-2 border-dashed border-admin-border flex items-center justify-center flex-shrink-0">
                    <ImageIcon size={24} className="text-admin-muted/50" />
                  </div>
                )}
                <label className={cn('cursor-pointer px-4 py-2 rounded-lg border border-admin-border text-sm text-admin-text hover:bg-gray-50 transition-colors flex items-center gap-2', uploading && 'opacity-60')}>
                  {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading…</> : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                </label>
              </div>
            </div>

            {error && <p className="md:col-span-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-[#7a3c10] disabled:opacity-60">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Create Banner
              </button>
              <button type="button" onClick={() => { setShowForm(false); setError(''); }} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-admin-border text-sm">
                <X size={14} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banner Grid */}
      {loading ? (
        <div className="py-16 text-center"><Loader2 size={28} className="animate-spin text-brand-primary mx-auto" /></div>
      ) : banners.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-admin-border">
          <ImageIcon size={36} className="mx-auto text-admin-border mb-3" />
          <p className="text-admin-muted text-sm">No banners yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div key={banner._id} className={cn('bg-white rounded-xl border overflow-hidden', banner.isActive ? 'border-admin-border' : 'border-admin-border opacity-60')}>
              {/* Preview */}
              <div className="relative h-32 bg-gray-100">
                {banner.image?.url && (
                  <Image src={banner.image.url} alt={banner.title} fill className="object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50" />
                <div className="absolute bottom-3 left-4 text-white">
                  <p className="font-semibold text-sm">{banner.title}</p>
                  {banner.subtitle && <p className="text-xs opacity-80">{banner.subtitle}</p>}
                </div>
              </div>
              {/* Info */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium capitalize', positionColors[banner.position])}>
                    {banner.position}
                  </span>
                  {banner.link && <span className="text-xs text-admin-muted truncate max-w-[120px]">{banner.link}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggle(banner._id, banner.isActive)} className="text-admin-muted hover:text-brand-primary transition-colors">
                    {banner.isActive ? <ToggleRight size={22} className="text-brand-primary" /> : <ToggleLeft size={22} />}
                  </button>
                  <button onClick={() => handleDelete(banner._id, banner.title)} disabled={deletingId === banner._id} className="p-1.5 rounded-lg hover:bg-red-50 text-admin-muted hover:text-red-600 transition-colors disabled:opacity-50">
                    {deletingId === banner._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
