// FILE: src/components/store/home/HeroBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: { url: string };
  link?: string;
}

interface HeroBannerProps {
  banners: Banner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] bg-brand-dark overflow-hidden">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-in-out',
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={banner.image.url}
              alt={banner.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-12">
              <div className="max-w-xl text-left text-white space-y-6">
                <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
                  {banner.title}
                </h1>
                {banner.subtitle && (
                  <p className="text-lg md:text-xl font-body text-brand-light/90 drop-shadow-md">
                    {banner.subtitle}
                  </p>
                )}
                <div className="pt-4">
                  <Link
                    href={banner.link || '/products'}
                    className="inline-block px-8 py-3.5 bg-brand-primary hover:bg-[#7a3c10] text-white font-medium rounded-full transition-transform hover:scale-105 shadow-warm-lg"
                  >
                    Explore Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      {banners.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  current === idx ? 'bg-brand-primary w-8' : 'bg-white/50 hover:bg-white'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
