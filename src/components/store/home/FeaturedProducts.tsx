// FILE: src/components/store/home/FeaturedProducts.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import type { IProduct } from '@/models/Product';

interface FeaturedProductsProps {
  products: IProduct[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-3">Featured Products</h2>
            <div className="w-16 h-1 bg-brand-primary rounded-full" />
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-2 text-brand-primary font-medium hover:text-[#7a3c10] transition-colors">
            View All Collection <ArrowRight size={18} />
          </Link>
        </div>

        {/* Mobile Horizontal Scroll, Desktop Grid */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 pb-6 md:pb-0 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {products.slice(0, 8).map((product) => (
            <div key={product._id as string} className="min-w-[260px] md:min-w-0 flex-shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/products" className="btn-primary py-3 px-8 inline-block">
            View All Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
