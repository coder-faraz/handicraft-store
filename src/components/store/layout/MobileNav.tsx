// FILE: src/components/store/layout/MobileNav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ChevronDown, ChevronUp, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ICategory } from '@/models/Category';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[]; // Using any to simplify for now, should be ICategory
}

export default function MobileNav({ isOpen, onClose, categories }: MobileNavProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 w-4/5 max-w-sm bg-brand-surface z-50 transform transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-border">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-brand-primary flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-brand-dark leading-none">Limra</p>
            </div>
          </Link>
          <button onClick={onClose} className="p-2 text-brand-muted hover:text-brand-dark">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/products"
                onClick={onClose}
                className="block px-6 py-3 text-lg font-medium text-brand-dark hover:bg-brand-light"
              >
                All Products
              </Link>
            </li>
            
            {/* Categories */}
            <li>
              <div className="px-6 py-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">
                Shop by Category
              </div>
              {categories.map((cat) => (
                <div key={cat._id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    onClick={onClose}
                    className="block px-6 py-3 text-lg font-medium text-brand-dark hover:bg-brand-light"
                  >
                    {cat.name}
                  </Link>
                </div>
              ))}
            </li>

            <li className="pt-4 mt-4 border-t border-brand-border">
              <Link
                href="/about"
                onClick={onClose}
                className="block px-6 py-3 text-lg font-medium text-brand-dark hover:bg-brand-light"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={onClose}
                className="block px-6 py-3 text-lg font-medium text-brand-dark hover:bg-brand-light"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Footer info */}
        <div className="p-6 border-t border-brand-border bg-brand-light">
          <p className="text-sm text-brand-muted mb-4">
            Need help? Call us at <br/>
            <span className="font-bold text-brand-dark">+91 98765 43210</span>
          </p>
          <div className="flex gap-4">
            <Link href="/login" onClick={onClose} className="text-sm font-medium text-brand-primary">Login</Link>
            <span className="text-brand-border">|</span>
            <Link href="/register" onClick={onClose} className="text-sm font-medium text-brand-primary">Register</Link>
          </div>
        </div>
      </div>
    </>
  );
}
