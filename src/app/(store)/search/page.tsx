// FILE: src/app/(store)/search/page.tsx
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/store/product/ProductGrid';
import ProductFilters from '@/components/store/product/ProductFilters';
import SortSelect from '@/components/store/product/SortSelect';
import Link from 'next/link';

export const metadata = {
  title: 'Search Results',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await connectDB();
  const sp = await searchParams;
  
  const q = sp.q as string | undefined;
  const sort = sp.sort as string | undefined;
  const categorySlug = sp.category as string | undefined;

  const query: any = { status: 'active' };

  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }

  if (categorySlug) {
    const categoryDoc = await Category.findOne({ slug: categorySlug }).lean();
    if (categoryDoc) query.category = categoryDoc._id;
  }

  // Sorting
  let sortOption: any = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };

  // Fetch Data
  const [products, allCategories] = await Promise.all([
    Product.find(query).populate('category', 'name').sort(sortOption).lean(),
    Category.find({}).lean()
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-brand-muted mb-8">
        <Link href="/" className="hover:text-brand-primary">Home</Link>
        <span>/</span>
        <span className="text-brand-dark font-medium">Search Results</span>
      </div>

      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-2">
          {q ? `Search results for "${q}"` : 'Search Products'}
        </h1>
        <p className="text-brand-muted">
          Found {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <ProductFilters categories={JSON.parse(JSON.stringify(allCategories))} />
        <div className="flex-1 w-full">
          {/* Desktop Sort Header */}
          <div className="hidden lg:flex justify-between items-center mb-6 pb-4 border-b border-brand-border">
            <p className="text-sm text-brand-muted">Showing {products.length} products</p>
            <div className="flex items-center gap-3">
              <label htmlFor="desktop-sort" className="text-sm font-medium text-brand-dark">Sort By:</label>
              <SortSelect currentSort={sort} />
            </div>
          </div>

          <ProductGrid products={JSON.parse(JSON.stringify(products))} />
        </div>
      </div>
    </div>
  );
}
