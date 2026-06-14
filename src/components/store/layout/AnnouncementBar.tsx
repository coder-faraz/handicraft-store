// FILE: src/components/store/layout/AnnouncementBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const ANNOUNCEMENTS = [
  'Free shipping on all orders above ₹999!',
  'Handcrafted with love by Indian Artisans since 1995.',
  'Need help? Call/WhatsApp: +91 98765 43210',
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setFade(true);
      }, 500); // 500ms fade duration
    }, 5000); // 5 seconds per message

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand-dark text-white py-2 px-4 text-center text-xs sm:text-sm font-medium tracking-wide">
      <div
        className={cn(
          'transition-opacity duration-500',
          fade ? 'opacity-100' : 'opacity-0'
        )}
      >
        {ANNOUNCEMENTS[currentIndex]}
      </div>
    </div>
  );
}
