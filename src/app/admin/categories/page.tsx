// FILE: src/app/admin/categories/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Tag, ImageIcon, Check, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/utils';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: { url: string; publicId: string };
  isActive: boolean;
  sortOrder: number;
}

interface FormState {
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  image: { url: string; publicId: string } | null;
}

const emptyForm: FormState = { name: '', description: '', sortOrder: 0, isActive: true, image: null };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    if (data.success) setCategories(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'categories');
    const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
    const data = await res.json();
    if (data.success) {
      setForm((f) => ({ ...f, image: { url: data.data.url, publicId: data.data.publicId } }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSubmitting(true);
    setError('');

    const payload = {
      name: form.name,
      description: form.description,
      sortOrder: form.sortOrder,
      isActive: form.isActive,
      ...(form.image ? { image: form.image } : {}),
    };

    const res = await fetch(
      editId ? `/api/admin/categories/${editId}` : '/api/admin/categories',
      {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    if (!data.success) { setError(data.error ?? 'Error saving category.'); setSubmitting(false); return; }

    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    fetchCategories();
    setSubmitting(false);
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat._id);
    setForm({
      name: cat.name,
      description: cat.description ?? '',
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
      image: cat.image?.url ? cat.image : null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchCategories();
    setDeletingId(null);
  };

  const inputClass = 'w-full rounded-lg border border-admin-border px-3 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 bg-white';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Categories</h1>
          <p className="text-sm text-admin-muted mt-0.5">{categories.length} categories</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-[#7a3c10] transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-admin-border p-5">
          <h3 className="font-semibold text-admin-text mb-4">{editId ? 'Edit Category' : 'New Category'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-admin-muted mb-1.5">Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Wooden Crafts" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-muted mb-1.5">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-admin-muted mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className={cn(inputClass, 'resize-none')} />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-muted mb-1.5">Category Image</label>
              <div className="flex items-center gap-3">
                {form.image ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-admin-border">
                    <Image src={form.image.url} alt="Category" fill className="object-cover" sizes="64px" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed border-admin-border flex items-center justify-center">
                    <ImageIcon size={20} className="text-admin-muted/50" />
                  </div>
                )}
                <label className="cursor-pointer px-3 py-2 rounded-lg border border-admin-border text-sm text-admin-text hover:bg-gray-50 transition-colors">
                  {uploading ? <Loader2 size={15} className="animate-spin" /> : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                </label>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={cn('w-10 h-6 rounded-full transition-colors relative', form.isActive ? 'bg-brand-primary' : 'bg-gray-200')}
                >
                  <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all', form.isActive ? 'left-5' : 'left-1')} />
                </button>
                <span className="text-sm text-admin-text">Active</span>
              </label>
            </div>

            {error && <p className="md:col-span-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <div className="md:col-span-2 flex items-center gap-3">
              <button type="submit" disabled={submitting} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-[#7a3c10] disabled:opacity-60">
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                {editId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); setError(''); }} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-admin-border text-sm text-admin-text hover:bg-gray-50">
                <X size={15} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-admin-border overflow-hidden">
        {loading ? (
          <div className="py-16 text-center"><Loader2 size={28} className="animate-spin text-brand-primary mx-auto" /></div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center">
            <Tag size={36} className="mx-auto text-admin-border mb-3" />
            <p className="text-admin-muted text-sm">No categories yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-admin-border">
                <th className="px-5 py-3 font-medium text-admin-muted">Image</th>
                <th className="px-5 py-3 font-medium text-admin-muted">Name</th>
                <th className="px-5 py-3 font-medium text-admin-muted">Slug</th>
                <th className="px-5 py-3 font-medium text-admin-muted">Sort</th>
                <th className="px-5 py-3 font-medium text-admin-muted">Status</th>
                <th className="px-5 py-3 font-medium text-admin-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {cat.image?.url ? (
                        <Image src={cat.image.url} alt={cat.name} width={40} height={40} className="object-cover" />
                      ) : (
                        <ImageIcon size={16} className="text-admin-muted/50" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium text-admin-text">{cat.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-admin-muted">{cat.slug}</td>
                  <td className="px-5 py-3 text-admin-muted">{cat.sortOrder}</td>
                  <td className="px-5 py-3">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium',
                      cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    )}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => handleEdit(cat)} className="p-1.5 rounded-lg hover:bg-blue-50 text-admin-muted hover:text-blue-600 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(cat._id, cat.name)} disabled={deletingId === cat._id} className="p-1.5 rounded-lg hover:bg-red-50 text-admin-muted hover:text-red-600 transition-colors disabled:opacity-50">
                        {deletingId === cat._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
