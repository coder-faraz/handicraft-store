// FILE: src/components/admin/orders/OrderTable.tsx
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { Eye, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { IOrderType } from '@/types';

const STATUS_TABS = [
  { label: 'All',        value: '' },
  { label: 'Placed',     value: 'placed' },
  { label: 'Confirmed',  value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped',    value: 'shipped' },
  { label: 'Delivered',  value: 'delivered' },
  { label: 'Cancelled',  value: 'cancelled' },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  placed:     { label: 'Placed',     className: 'bg-blue-100 text-blue-700' },
  confirmed:  { label: 'Confirmed',  className: 'bg-indigo-100 text-indigo-700' },
  processing: { label: 'Processing', className: 'bg-amber-100 text-amber-700' },
  shipped:    { label: 'Shipped',    className: 'bg-purple-100 text-purple-700' },
  delivered:  { label: 'Delivered',  className: 'bg-emerald-100 text-emerald-700' },
  cancelled:  { label: 'Cancelled',  className: 'bg-red-100 text-red-700' },
};

const paymentConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
  paid:    { label: 'Paid',    className: 'bg-emerald-100 text-emerald-700' },
  failed:  { label: 'Failed',  className: 'bg-red-100 text-red-700' },
};

interface Props {
  orders: IOrderType[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentStatus: string;
}

export default function OrderTable({ orders, total, totalPages, currentPage, currentStatus }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const pushParams = (params: Record<string, string>) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v); });
    startTransition(() => router.push(`${pathname}?${sp.toString()}`));
  };

  return (
    <div className="bg-white rounded-xl border border-admin-border overflow-hidden">
      {/* Status tabs */}
      <div className="flex overflow-x-auto border-b border-admin-border bg-gray-50 scrollbar-hide">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => pushParams({ status: tab.value, page: '1' })}
            className={cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
              currentStatus === tab.value
                ? 'border-brand-primary text-brand-primary bg-white'
                : 'border-transparent text-admin-muted hover:text-admin-text'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-admin-border">
              <th className="px-6 py-3 font-medium text-admin-muted">Order #</th>
              <th className="px-6 py-3 font-medium text-admin-muted">Date</th>
              <th className="px-6 py-3 font-medium text-admin-muted">Customer</th>
              <th className="px-6 py-3 font-medium text-admin-muted">Items</th>
              <th className="px-6 py-3 font-medium text-admin-muted">Total</th>
              <th className="px-6 py-3 font-medium text-admin-muted">Payment</th>
              <th className="px-6 py-3 font-medium text-admin-muted">Status</th>
              <th className="px-6 py-3 font-medium text-admin-muted text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <ShoppingBag size={36} className="mx-auto text-admin-border mb-3" />
                  <p className="text-admin-muted text-sm">No orders found.</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = statusConfig[order.orderStatus] ?? { label: order.orderStatus, className: 'bg-gray-100 text-gray-700' };
                const payment = paymentConfig[order.paymentStatus] ?? { label: order.paymentStatus, className: 'bg-gray-100 text-gray-700' };
                const customerName = typeof order.userId === 'object' && order.userId !== null
                  ? (order.userId as any).name
                  : '—';

                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-medium text-admin-text">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-admin-muted whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 text-admin-text">{customerName}</td>
                    <td className="px-6 py-4 text-admin-muted">{order.items?.length ?? 0} item(s)</td>
                    <td className="px-6 py-4 font-semibold text-admin-text">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', payment.className)}>
                        {payment.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', status.className)}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-brand-primary hover:text-white text-admin-text text-xs font-medium transition-colors"
                      >
                        <Eye size={13} />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-admin-border bg-gray-50">
          <p className="text-xs text-admin-muted">
            Showing {(currentPage - 1) * 20 + 1}–{Math.min(currentPage * 20, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => pushParams({ status: currentStatus, page: String(currentPage - 1) })}
              className="p-1.5 rounded hover:bg-white border border-transparent hover:border-admin-border disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-xs text-admin-text font-medium">{currentPage}/{totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => pushParams({ status: currentStatus, page: String(currentPage + 1) })}
              className="p-1.5 rounded hover:bg-white border border-transparent hover:border-admin-border disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
