// FILE: src/components/admin/products/ProductsTableClient.tsx
'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search, Pencil, Trash2, ChevronLeft, ChevronRight,
  ImageIcon, Loader2, Package
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: { url: string; publicId: string }[];
  categoryId: { _id: string; name: string } | null;
  isActive: boolean;
  isFeatured: boolean;
}

interface Category { _id: string; name: string; }

interface Props {
  products: Product[];
  categories: Category[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentSearch: string;
  currentCategory: string;
}

export default function ProductsTableClient({
  products, categories, total, totalPages, currentPage,
  currentSearch, currentCategory,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch);
  const [categoryId, setCategoryId] = useState(currentCategory);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const pushParams = (params: Record<string, string>) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v); });
    startTransition(() => router.push(`${pathname}?${sp.toString()}`));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    pushParams({ search, categoryId, page: '1' });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deactivate "${name}"? It will be hidden from the storefront.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        startTransition(() => router.refresh());
      }
    } finally {
      setDeleting(null);
    }
  };

  const toggleAll = () => {
    setSelected(selected.length === products.length ? [] : products.map((p) => p._id));
  };

  return (
    <div className="bg-white rounded-xl border border-admin-border overflow-hidden">
      {/* Filters bar */}
      <div className="p-4 border-b border-admin-border flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
            <input
              id="products-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-admin-border rounded-lg focus:outline-none focus:border-brand-primary"
            />
          </div>
          <select
            id="products-category-filter"
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); pushParams({ search, categoryId: e.target.value, page: '1' }); }}
            className="px-3 py-2 text-sm border border-admin-border rounded-lg focus:outline-none focus:border-brand-primary bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <button type="submit" className="px-4 py-2 text-sm bg-brand-primary text-white rounded-lg hover:bg-[#7a3c10] transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.length === products.length && products.length > 0}
                  onChange={toggleAll}
                  className="rounded border-admin-border"
                />
              </th>
              <th className="px-4 py-3 font-medium text-admin-muted">Image</th>
              <th className="px-4 py-3 font-medium text-admin-muted">Name / SKU</th>
              <th className="px-4 py-3 font-medium text-admin-muted">Price</th>
              <th className="px-4 py-3 font-medium text-admin-muted">Stock</th>
              <th className="px-4 py-3 font-medium text-admin-muted">Category</th>
              <th className="px-4 py-3 font-medium text-admin-muted">Status</th>
              <th className="px-4 py-3 font-medium text-admin-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <Package size={36} className="mx-auto text-admin-border mb-3" />
                  <p className="text-admin-muted text-sm">No products found.</p>
                  <Link href="/admin/products/new" className="text-brand-primary text-sm hover:underline mt-1 inline-block">
                    Add your first product →
                  </Link>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(product._id)}
                      onChange={(e) =>
                        setSelected(e.target.checked
                          ? [...selected, product._id]
                          : selected.filter((id) => id !== product._id)
                        )
                      }
                      className="rounded border-admin-border"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <ImageIcon size={18} className="text-admin-muted/50" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-admin-text line-clamp-1">{product.name}</p>
                    <p className="text-xs text-admin-muted font-mono">{product.sku}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-admin-text">{formatPrice(product.salePrice ?? product.price)}</p>
                    {product.salePrice && (
                      <p className="text-xs text-admin-muted line-through">{formatPrice(product.price)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-sm font-medium',
                      product.stock === 0 ? 'text-red-600' :
                      product.stock <= 5 ? 'text-amber-600' : 'text-emerald-600'
                    )}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-admin-muted text-sm">
                    {typeof product.categoryId === 'object' && product.categoryId
                      ? product.categoryId.name
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium',
                      product.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    )}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-admin-muted hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        disabled={deleting === product._id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-admin-muted hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Deactivate"
                      >
                        {deleting === product._id
                          ? <Loader2 size={15} className="animate-spin" />
                          : <Trash2 size={15} />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-admin-border bg-gray-50">
          <p className="text-xs text-admin-muted">
            Showing {(currentPage - 1) * 20 + 1}–{Math.min(currentPage * 20, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => pushParams({ search, categoryId, page: String(currentPage - 1) })}
              className="p-1.5 rounded hover:bg-white border border-transparent hover:border-admin-border disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 text-xs text-admin-text font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => pushParams({ search, categoryId, page: String(currentPage + 1) })}
              className="p-1.5 rounded hover:bg-white border border-transparent hover:border-admin-border disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
