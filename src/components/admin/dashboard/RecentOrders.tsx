// FILE: src/components/admin/dashboard/RecentOrders.tsx
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import type { IOrderType } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  placed:      { label: 'Placed',      className: 'bg-blue-100 text-blue-700' },
  confirmed:   { label: 'Confirmed',   className: 'bg-indigo-100 text-indigo-700' },
  processing:  { label: 'Processing',  className: 'bg-amber-100 text-amber-700' },
  shipped:     { label: 'Shipped',     className: 'bg-purple-100 text-purple-700' },
  delivered:   { label: 'Delivered',   className: 'bg-emerald-100 text-emerald-700' },
  cancelled:   { label: 'Cancelled',   className: 'bg-red-100 text-red-700' },
};

interface RecentOrdersProps {
  orders: IOrderType[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-xl border border-admin-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
        <h3 className="font-semibold text-admin-text">Recent Orders</h3>
        <Link
          href="/admin/orders"
          className="text-xs text-brand-primary hover:underline flex items-center gap-1"
        >
          View all <ExternalLink size={11} />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 font-medium text-admin-muted whitespace-nowrap">Order #</th>
              <th className="px-6 py-3 font-medium text-admin-muted whitespace-nowrap">Customer</th>
              <th className="px-6 py-3 font-medium text-admin-muted whitespace-nowrap">Amount</th>
              <th className="px-6 py-3 font-medium text-admin-muted whitespace-nowrap">Status</th>
              <th className="px-6 py-3 font-medium text-admin-muted whitespace-nowrap">Date</th>
              <th className="px-6 py-3 font-medium text-admin-muted whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-admin-muted">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = statusConfig[order.orderStatus] ?? {
                  label: order.orderStatus,
                  className: 'bg-gray-100 text-gray-700',
                };
                const customer =
                  typeof order.userId === 'object' && order.userId !== null
                    ? (order.userId as any).name
                    : '—';

                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-xs font-medium text-admin-text">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-3.5 text-admin-text">{customer}</td>
                    <td className="px-6 py-3.5 font-semibold text-admin-text">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', status.className)}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-admin-muted whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="text-brand-primary hover:underline text-xs font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
