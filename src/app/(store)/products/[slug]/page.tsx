// FILE: src/app/(store)/products/[slug]/page.tsx
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductImageGallery from '@/components/store/product/ProductImageGallery';
import ProductDetails from '@/components/store/product/ProductDetails';
import RelatedProducts from '@/components/store/product/RelatedProducts';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  await connectDB();
  const { slug } = await params;
  const product = await Product.findOne({ slug }).lean();
  
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: `${product.name} | Limra Manufacturing Co.`,
    description: product.description,
    openGraph: {
      images: product.images?.length > 0 ? [product.images[0].url] : [],
    }
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connectDB();
  const { slug } = await params;
  
  const product = await Product.findOne({ slug }).populate('category', 'name slug').lean();
  if (!product) notFound();

  // Fetch related products (same category, excluding current product)
  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    status: 'active'
  }).limit(4).lean();

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((img: any) => img.url) || [],
    description: product.description,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.salePrice || product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="bg-brand-light">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-brand-muted mb-8">
            <Link href="/" className="hover:text-brand-primary">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-primary">Products</Link>
            <span>/</span>
            {(product.category as any)?.name && (
              <>
                <Link href={`/categories/${(product.category as any).slug}`} className="hover:text-brand-primary">
                  {(product.category as any).name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-brand-dark font-medium line-clamp-1">{product.name}</span>
          </div>

          <div className="bg-white rounded-3xl shadow-warm border border-brand-border p-6 md:p-10 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
              <ProductImageGallery 
                images={product.images as any[]} 
                productName={product.name} 
              />
              <ProductDetails 
                product={JSON.parse(JSON.stringify(product))} 
              />
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <RelatedProducts products={JSON.parse(JSON.stringify(relatedProducts))} />
      )}
    </>
  );
}
