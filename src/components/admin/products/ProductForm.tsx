// FILE: src/components/admin/products/ProductForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { slugify } from '@/lib/utils';
import ImageUploader, { UploadedImage } from './ImageUploader';
import { cn } from '@/lib/utils';

const ProductFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  slug: z.string().min(2).optional(),
  shortDescription: z.string().min(10, 'Short description is too short').max(300),
  description: z.string().min(10, 'Description is too short'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  salePrice: z.coerce.number().positive().optional().or(z.literal('')),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  sku: z.string().min(2, 'SKU required').max(50),
  categoryId: z.string().min(1, 'Please select a category'),
  tags: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof ProductFormSchema>;

interface Category { _id: string; name: string; }

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData> & {
    images?: UploadedImage[];
    _id?: string;
  };
  mode?: 'create' | 'edit';
}

export default function ProductForm({ defaultValues, mode = 'create' }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<UploadedImage[]>(defaultValues?.images ?? []);
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      isActive: true,
      isFeatured: false,
      ...defaultValues,
    },
  });

  // Load categories
  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); })
      .catch(() => {});
  }, []);

  // Auto-generate slug from name (create mode only)
  const name = watch('name');
  useEffect(() => {
    if (mode === 'create' && name) {
      setValue('slug', slugify(name));
    }
  }, [name, mode, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    setServerError('');

    try {
      const payload = {
        ...data,
        salePrice: data.salePrice ? Number(data.salePrice) : undefined,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        images,
      };

      const url =
        mode === 'edit' && defaultValues?._id
          ? `/api/admin/products/${defaultValues._id}`
          : '/api/admin/products';

      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setServerError(result.error ?? 'Something went wrong.');
        return;
      }

      router.push('/admin/products');
      router.refresh();
    } catch {
      setServerError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-admin-border px-3 py-2.5 text-sm text-admin-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all bg-white';
  const labelClass = 'block text-sm font-medium text-admin-text mb-1.5';
  const errorClass = 'text-xs text-red-500 mt-1 flex items-center gap-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left/main column ── */}
        <div className="xl:col-span-2 space-y-5">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl border border-admin-border p-5">
            <h3 className="font-semibold text-admin-text mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Product Name *</label>
                <input
                  id="product-name"
                  {...register('name')}
                  placeholder="e.g. Handcrafted Wooden Elephant"
                  className={inputClass}
                />
                {errors.name && <p className={errorClass}><AlertCircle size={12} />{errors.name.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Slug</label>
                <input
                  id="product-slug"
                  {...register('slug')}
                  placeholder="auto-generated-from-name"
                  className={cn(inputClass, 'text-admin-muted font-mono text-xs')}
                  readOnly={mode === 'create'}
                />
                <p className="text-xs text-admin-muted mt-1">Auto-generated from name in create mode.</p>
              </div>

              <div>
                <label className={labelClass}>Short Description *</label>
                <input
                  id="product-short-desc"
                  {...register('shortDescription')}
                  placeholder="Brief 1-line product summary (shown on cards)"
                  className={inputClass}
                />
                {errors.shortDescription && <p className={errorClass}><AlertCircle size={12} />{errors.shortDescription.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Full Description *</label>
                <textarea
                  id="product-description"
                  {...register('description')}
                  rows={6}
                  placeholder="Detailed product description — materials, dimensions, care instructions..."
                  className={cn(inputClass, 'resize-y min-h-[120px]')}
                />
                {errors.description && <p className={errorClass}><AlertCircle size={12} />{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* Images Card */}
          <div className="bg-white rounded-xl border border-admin-border p-5">
            <h3 className="font-semibold text-admin-text mb-4">Product Images</h3>
            <ImageUploader
              value={images}
              onChange={setImages}
              maxImages={6}
              folder="products"
            />
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">
          {/* Pricing Card */}
          <div className="bg-white rounded-xl border border-admin-border p-5">
            <h3 className="font-semibold text-admin-text mb-4">Pricing & Stock</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Price (₹) *</label>
                <input
                  id="product-price"
                  type="number"
                  step="0.01"
                  {...register('price')}
                  placeholder="0"
                  className={inputClass}
                />
                {errors.price && <p className={errorClass}><AlertCircle size={12} />{errors.price.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Sale Price (₹)</label>
                <input
                  id="product-sale-price"
                  type="number"
                  step="0.01"
                  {...register('salePrice')}
                  placeholder="Leave blank if no discount"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Stock Quantity *</label>
                <input
                  id="product-stock"
                  type="number"
                  {...register('stock')}
                  placeholder="0"
                  className={inputClass}
                />
                {errors.stock && <p className={errorClass}><AlertCircle size={12} />{errors.stock.message}</p>}
              </div>

              <div>
                <label className={labelClass}>SKU *</label>
                <input
                  id="product-sku"
                  {...register('sku')}
                  placeholder="e.g. LMC-WOOD-001"
                  className={cn(inputClass, 'uppercase')}
                />
                {errors.sku && <p className={errorClass}><AlertCircle size={12} />{errors.sku.message}</p>}
              </div>
            </div>
          </div>

          {/* Organization Card */}
          <div className="bg-white rounded-xl border border-admin-border p-5">
            <h3 className="font-semibold text-admin-text mb-4">Organization</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Category *</label>
                <select
                  id="product-category"
                  {...register('categoryId')}
                  className={inputClass}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className={errorClass}><AlertCircle size={12} />{errors.categoryId.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Tags</label>
                <input
                  id="product-tags"
                  {...register('tags')}
                  placeholder="wooden, handmade, gift (comma separated)"
                  className={inputClass}
                />
                <p className="text-xs text-admin-muted mt-1">Separate tags with commas</p>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl border border-admin-border p-5">
            <h3 className="font-semibold text-admin-text mb-4">Status</h3>
            <div className="space-y-3">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-admin-text">Active</p>
                      <p className="text-xs text-admin-muted">Visible in storefront</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors duration-200',
                        field.value ? 'bg-brand-primary' : 'bg-gray-200'
                      )}
                    >
                      <span className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200',
                        field.value ? 'left-6' : 'left-1'
                      )} />
                    </button>
                  </label>
                )}
              />

              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-admin-text">Featured</p>
                      <p className="text-xs text-admin-muted">Show on homepage</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors duration-200',
                        field.value ? 'bg-brand-accent' : 'bg-gray-200'
                      )}
                    >
                      <span className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200',
                        field.value ? 'left-6' : 'left-1'
                      )} />
                    </button>
                  </label>
                )}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            id="product-submit-btn"
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-[#7a3c10] disabled:opacity-60 transition-colors"
          >
            {submitting ? (
              <><Loader2 size={18} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={18} /> {mode === 'edit' ? 'Update Product' : 'Create Product'}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
