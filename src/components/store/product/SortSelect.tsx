// FILE: src/components/store/product/SortSelect.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.delete('page'); // Reset pagination on sort change
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <select
      name="sort"
      id="desktop-sort"
      value={currentSort || 'newest'}
      onChange={handleSortChange}
      className="border border-brand-border rounded-lg py-1.5 px-3 text-sm focus:border-brand-primary outline-none bg-white text-brand-dark"
    >
      <option value="newest">Newest Arrivals</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}
