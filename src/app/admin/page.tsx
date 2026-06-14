// FILE: src/app/admin/page.tsx
import { Suspense } from 'react';
import {
  ShoppingBag,
  Package,
  Users,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import RecentOrders from '@/components/admin/dashboard/RecentOrders';
import { getOrderStats, getRecentOrders } from '@/repositories/order.repo';
import { getProductStats } from '@/repositories/product.repo';
import { getUserStats } from '@/repositories/user.repo';
import { formatPrice } from '@/lib/utils';
import type { IOrderType } from '@/types';

export const metadata = { title: 'Dashboard' };

// Skeleton for stats
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-admin-border p-5 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100" />
            <div className="w-16 h-6 rounded-full bg-gray-100" />
          </div>
          <div className="w-24 h-7 rounded bg-gray-100 mb-1" />
          <div className="w-32 h-4 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

async function DashboardContent() {
  const [orderStats, productStats, userStats, recentOrders] = await Promise.all([
    getOrderStats(),
    getProductStats(),
    getUserStats(),
    getRecentOrders(10),
  ]);

  const stats = [
    {
      title: 'Total Revenue',
      value: formatPrice(orderStats.revenue),
      icon: IndianRupee,
      trend: 12,
      trendLabel: 'vs. last month',
      color: 'brown' as const,
    },
    {
      title: 'Total Orders',
      value: orderStats.total.toLocaleString('en-IN'),
      icon: ShoppingBag,
      trend: 8,
      trendLabel: `${orderStats.todayOrders} today`,
      color: 'blue' as const,
    },
    {
      title: 'Total Products',
      value: productStats.total.toLocaleString('en-IN'),
      icon: Package,
      trend: productStats.lowStock > 0 ? -productStats.lowStock : 0,
      trendLabel: `${productStats.lowStock} low stock`,
      color: 'amber' as const,
    },
    {
      title: 'Customers',
      value: userStats.total.toLocaleString('en-IN'),
      icon: Users,
      trend: 5,
      trendLabel: `${userStats.newThisMonth} new this month`,
      color: 'green' as const,
    },
  ];

  return (
    <>
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Alerts */}
      {(productStats.lowStock > 0 || productStats.outOfStock > 0) && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          <AlertTriangle size={18} className="flex-shrink-0 text-amber-600" />
          <span>
            {productStats.outOfStock > 0 && (
              <><strong>{productStats.outOfStock}</strong> products are out of stock. </>
            )}
            {productStats.lowStock > 0 && (
              <><strong>{productStats.lowStock}</strong> products have 5 or fewer items remaining.</>
            )}
          </span>
        </div>
      )}

      {/* Pending orders alert */}
      {orderStats.pending > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm">
          <TrendingUp size={18} className="flex-shrink-0 text-blue-600" />
          <span>
            <strong>{orderStats.pending}</strong> new order{orderStats.pending !== 1 ? 's' : ''} awaiting confirmation.
          </span>
        </div>
      )}

      {/* Recent orders table */}
      <RecentOrders orders={recentOrders as unknown as IOrderType[]} />
    </>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-admin-text">Dashboard</h1>
        <p className="text-sm text-admin-muted mt-1">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
