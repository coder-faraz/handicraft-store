// FILE: src/components/store/product/ProductImageGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Store } from 'lucide-react';

interface ProductImageGalleryProps {
  images: { url: string; publicId: string; _id?: string }[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-brand-light flex items-center justify-center rounded-2xl border border-brand-border">
        <Store size={64} className="text-brand-muted/30" />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-24 hide-scrollbar snap-x snap-mandatory flex-shrink-0">
          {images.map((img, idx) => (
            <button
              key={img._id || idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 snap-start transition-all',
                activeIndex === idx ? 'border-brand-primary shadow-md' : 'border-brand-border opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative w-full aspect-square bg-brand-light rounded-2xl border border-brand-border overflow-hidden group">
        <Image
          src={images[activeIndex].url}
          alt={productName}
          fill
          priority
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 cursor-zoom-in"
        />
      </div>
    </div>
  );
}
