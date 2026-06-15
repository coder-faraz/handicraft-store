// FILE: src/app/(store)/products/page.tsx
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/store/product/ProductGrid';
import ProductFilters from '@/components/store/product/ProductFilters';
import SortSelect from '@/components/store/product/SortSelect';
import Link from 'next/link';

export const metadata = {
  title: 'All Products | Limra Manufacturing Co.',
  description: 'Explore our complete collection of premium Indian handicrafts.',
};

export const revalidate = 1800;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await connectDB();
  const sp = await searchParams;
  
  const categorySlug = sp.category as string | undefined;
  const rating = sp.rating as string | undefined;
  const sort = sp.sort as string | undefined;
  
  // Build Query
  const query: any = { status: 'active' };
  
  if (categorySlug) {
    const categoryDoc = await Category.findOne({ slug: categorySlug }).lean();
    if (categoryDoc) query.category = categoryDoc._id;
  }
  
  // Dummy rating filter implementation (assuming we add averageRating to Product model in future)
  // For now we just fetch all if rating is not really in schema.

  // Sorting
  let sortOption: any = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };

  // Fetch Data
  const [products, categories] = await Promise.all([
    Product.find(query).populate('category', 'name').sort(sortOption).lean(),
    Category.find({}).lean()
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-brand-muted mb-8">
        <Link href="/" className="hover:text-brand-primary">Home</Link>
        <span>/</span>
        <span className="text-brand-dark font-medium">All Products</span>
      </div>

      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-brand-dark mb-2">Our Collection</h1>
        <p className="text-brand-muted max-w-2xl">
          Discover our curated selection of authentic Indian handicrafts. Each piece is crafted with passion by skilled artisans, preserving traditional techniques while fitting beautifully into modern homes.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <ProductFilters categories={JSON.parse(JSON.stringify(categories))} />
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
