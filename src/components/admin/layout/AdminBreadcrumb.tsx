// FILE: src/components/admin/layout/AdminBreadcrumb.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  admin: 'Admin',
  products: 'Products',
  categories: 'Categories',
  orders: 'Orders',
  customers: 'Customers',
  banners: 'Banners',
  reviews: 'Reviews',
  settings: 'Settings',
  new: 'New',
  edit: 'Edit',
};

export default function AdminBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((seg, idx, arr) => {
      const href = '/' + arr.slice(0, idx + 1).join('/');
      // If it looks like a MongoDB ObjectId (24 hex chars), label it "Details"
      const isId = /^[a-f0-9]{24}$/i.test(seg);
      const label = isId ? 'Details' : (routeLabels[seg] ?? seg);
      return { href, label, isId };
    });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href="/admin"
        className="text-admin-muted hover:text-admin-text transition-colors"
      >
        <Home size={14} />
      </Link>
      {segments.slice(1).map((seg, idx) => (
        <span key={seg.href} className="flex items-center gap-1.5">
          <ChevronRight size={14} className="text-admin-muted" />
          {idx === segments.length - 2 ? (
            <span className="font-medium text-admin-text">{seg.label}</span>
          ) : (
            <Link
              href={seg.href}
              className="text-admin-muted hover:text-admin-text transition-colors"
            >
              {seg.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
