// FILE: src/app/admin/products/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Package } from 'lucide-react';
import { listProductsAdmin } from '@/services/product.service';
import { findAllAdmin as findAllCategories } from '@/repositories/category.repo';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import ProductsTableClient from '@/components/admin/products/ProductsTableClient';

export const metadata = { title: 'Products' };

interface SearchParams { page?: string; search?: string; categoryId?: string; }

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? '1');
  const search = sp.search;
  const categoryId = sp.categoryId;

  const [result, categories] = await Promise.all([
    listProductsAdmin(page, 20, search, categoryId),
    findAllCategories(),
  ]);

  const { data: products, total, totalPages } = result;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Products</h1>
          <p className="text-sm text-admin-muted mt-0.5">{total} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-[#7a3c10] transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Table */}
      <ProductsTableClient
        products={JSON.parse(JSON.stringify(products))}
        categories={JSON.parse(JSON.stringify(categories))}
        total={total}
        totalPages={totalPages}
        currentPage={page}
        currentSearch={search ?? ''}
        currentCategory={categoryId ?? ''}
      />
    </div>
  );
}
