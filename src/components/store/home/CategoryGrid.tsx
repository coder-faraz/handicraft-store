// FILE: src/components/store/home/CategoryGrid.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Store } from 'lucide-react';
import type { ICategory } from '@/models/Category';

interface CategoryGridProps {
  categories: ICategory[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-4">Shop by Category</h2>
          <div className="w-24 h-1 bg-brand-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category._id as string}
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-sm border border-brand-border overflow-hidden mb-4 group-hover:shadow-warm-md group-hover:scale-105 transition-all duration-300 relative">
                {category.image?.url ? (
                  <Image
                    src={category.image.url}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-light/50">
                    <Store size={32} className="text-brand-muted" />
                  </div>
                )}
              </div>
              <h3 className="font-body font-semibold text-brand-dark group-hover:text-brand-primary transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
