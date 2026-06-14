// FILE: src/app/(store)/categories/[slug]/page.tsx
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/store/product/ProductGrid';
import ProductFilters from '@/components/store/product/ProductFilters';
import SortSelect from '@/components/store/product/SortSelect';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await params;
  const category = await Category.findOne({ slug }).lean();
  
  if (!category) return { title: 'Category Not Found' };
  
  return {
    title: `${category.name} | Limra Manufacturing Co.`,
    description: category.description || `Shop our collection of ${category.name}`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await connectDB();
  const { slug } = await params;
  const sp = await searchParams;
  
  const category = await Category.findOne({ slug }).lean();
  if (!category) notFound();

  const sort = sp.sort as string | undefined;
  
  // Sorting
  let sortOption: any = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };

  // Fetch Data
  const [products, allCategories] = await Promise.all([
    Product.find({ category: category._id, status: 'active' }).populate('category', 'name').sort(sortOption).lean(),
    Category.find({}).lean()
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-brand-muted mb-8">
        <Link href="/" className="hover:text-brand-primary">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-brand-primary">Categories</Link>
        <span>/</span>
        <span className="text-brand-dark font-medium">{category.name}</span>
      </div>

      {/* Category Header */}
      <div className="mb-10 relative rounded-2xl overflow-hidden bg-brand-dark h-48 md:h-64 flex items-center shadow-warm">
        {category.image?.url && (
          <>
            <img
              src={category.image.url}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 to-transparent" />
          </>
        )}
        <div className="relative z-10 p-8 md:p-12 text-white">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 drop-shadow-md">{category.name}</h1>
          {category.description && (
            <p className="max-w-xl text-brand-light/90 drop-shadow-sm text-lg font-medium">{category.description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <ProductFilters categories={JSON.parse(JSON.stringify(allCategories))} />
        <div className="flex-1 w-full">
          {/* Desktop Sort Header */}
          <div className="hidden lg:flex justify-between items-center mb-6 pb-4 border-b border-brand-border">
            <p className="text-sm text-brand-muted">Showing {products.length} products in {category.name}</p>
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
