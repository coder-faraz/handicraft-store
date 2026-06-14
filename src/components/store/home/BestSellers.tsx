// FILE: src/components/store/home/BestSellers.tsx
'use client';

import { useState } from 'react';
import ProductCard from '../product/ProductCard';
import type { IProduct } from '@/models/Product';
import { cn } from '@/lib/utils';

interface BestSellersProps {
  products: IProduct[];
}

const TABS = ['All', 'Decor', 'Kitchen', 'Gifts'];

export default function BestSellers({ products }: BestSellersProps) {
  const [activeTab, setActiveTab] = useState('All');

  if (!products || products.length === 0) return null;

  // Filter products based on active tab.
  // Assuming products have a populated category object with a 'name'.
  const filteredProducts = products.filter((product) => {
    if (activeTab === 'All') return true;
    const catName = (product.category as any)?.name;
    // Simple substring match for the demo
    return catName && catName.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <section className="py-16 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-4">Best Sellers</h2>
          <div className="w-16 h-1 bg-brand-primary mx-auto rounded-full mb-8" />
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border',
                  activeTab === tab
                    ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                    : 'bg-white text-brand-muted border-brand-border hover:border-brand-primary hover:text-brand-primary'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brand-muted">No best sellers found for this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id as string} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
