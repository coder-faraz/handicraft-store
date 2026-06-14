// FILE: src/components/store/product/ProductFilters.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, Star, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ICategory } from '@/models/Category';

interface ProductFiltersProps {
  categories: ICategory[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  
  // Local state for expandable sections
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    rating: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    params.delete('page'); // Reset pagination on filter change
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const currentCategory = searchParams.get('category');
  const currentRating = searchParams.get('rating');
  const currentSort = searchParams.get('sort');

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort (Mobile only, desktop has it elsewhere) */}
      <div className="block lg:hidden">
        <h3 className="font-semibold text-brand-dark mb-3">Sort By</h3>
        <select
          value={currentSort || 'newest'}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="w-full border border-brand-border rounded-lg p-2.5 text-sm outline-none focus:border-brand-primary"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <hr className="border-brand-border block lg:hidden" />

      {/* Category */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full font-semibold text-brand-dark mb-3"
        >
          Category
          {openSections.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.category && (
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat._id as string} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={currentCategory === cat.slug}
                  onChange={() => handleFilterChange('category', cat.slug)}
                  className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/20"
                />
                <span className="text-sm text-brand-muted group-hover:text-brand-dark transition-colors">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <hr className="border-brand-border" />

      {/* Rating */}
      <div>
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full font-semibold text-brand-dark mb-3"
        >
          Minimum Rating
          {openSections.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.rating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={currentRating === rating.toString()}
                  onChange={() => handleFilterChange('rating', rating.toString())}
                  className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/20"
                />
                <div className="flex items-center gap-1 text-sm text-brand-muted group-hover:text-brand-dark transition-colors">
                  <div className="flex text-brand-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < rating ? 'fill-current' : 'text-brand-border'}
                      />
                    ))}
                  </div>
                  <span>&amp; up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <button
        onClick={() => setIsOpenMobile(true)}
        className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-brand-border rounded-xl text-brand-dark font-medium shadow-sm mb-6"
      >
        <SlidersHorizontal size={18} />
        Filter & Sort
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-28 bg-white p-6 rounded-2xl border border-brand-border shadow-warm">
          <h2 className="font-display text-xl font-bold text-brand-dark mb-6">Filters</h2>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 w-full h-[80vh] bg-white rounded-t-2xl shadow-warm-lg flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpenMobile ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-brand-border">
          <h2 className="font-display text-xl font-bold text-brand-dark">Filters & Sort</h2>
          <button onClick={() => setIsOpenMobile(false)} className="p-2 text-brand-muted hover:text-brand-dark">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <FilterContent />
        </div>
        <div className="p-5 border-t border-brand-border">
          <button
            onClick={() => setIsOpenMobile(false)}
            className="w-full btn-primary py-3"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
