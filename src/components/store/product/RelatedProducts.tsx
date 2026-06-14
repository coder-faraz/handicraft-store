// FILE: src/components/store/product/RelatedProducts.tsx
import ProductCard from './ProductCard';
import type { IProduct } from '@/models/Product';

interface RelatedProductsProps {
  products: IProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 bg-white border-t border-brand-border">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl font-bold text-brand-dark mb-8 text-center md:text-left">
          You Might Also Like
        </h2>
        
        {/* Horizontal scroll for related products */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-6 pb-6 md:pb-0 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {products.slice(0, 4).map((product) => (
            <div key={product._id as string} className="min-w-[260px] md:min-w-0 flex-shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
