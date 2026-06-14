// FILE: src/app/admin/orders/[id]/page.tsx
import { notFound } from 'next/navigation';
import { findById } from '@/repositories/order.repo';
import TrackingForm from '@/components/admin/orders/TrackingForm';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import { MapPin, Phone, User, Package, CreditCard, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Order Details' };

const statusColors: Record<string, string> = {
  placed:     'bg-blue-100 text-blue-700',
  confirmed:  'bg-indigo-100 text-indigo-700',
  processing: 'bg-amber-100 text-amber-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-emerald-100 text-emerald-700',
  cancelled:  'bg-red-100 text-red-700',
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await findById(id);
  if (!order) notFound();

  const serialized = JSON.parse(JSON.stringify(order));
  const customer = typeof serialized.userId === 'object' ? serialized.userId : null;
  const addr = serialized.shippingAddress;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Order Details</h1>
          <p className="text-sm text-admin-muted mt-0.5 font-mono">{serialized.orderNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('px-3 py-1.5 rounded-full text-sm font-medium', statusColors[serialized.orderStatus] ?? 'bg-gray-100 text-gray-700')}>
            {serialized.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* ── Left: Order info ── */}
        <div className="xl:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-xl border border-admin-border overflow-hidden">
            <div className="px-5 py-4 border-b border-admin-border">
              <h3 className="font-semibold text-admin-text flex items-center gap-2">
                <Package size={16} /> Order Items
              </h3>
            </div>
            <div className="divide-y divide-admin-border">
              {serialized.items?.map((item: any) => (
                <div key={item._id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-admin-muted/50">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-admin-text text-sm">{item.productName}</p>
                    <p className="text-xs text-admin-muted">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-semibold text-admin-text">{formatPrice(item.total)}</p>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="px-5 py-4 border-t border-admin-border bg-gray-50 space-y-1.5">
              <div className="flex justify-between text-sm text-admin-muted">
                <span>Subtotal</span><span>{formatPrice(serialized.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-admin-muted">
                <span>Shipping</span><span>{formatPrice(serialized.shippingCharge)}</span>
              </div>
              {serialized.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount</span><span>−{formatPrice(serialized.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-admin-text pt-2 border-t border-admin-border">
                <span>Total</span><span>{formatPrice(serialized.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Customer */}
            <div className="bg-white rounded-xl border border-admin-border p-5">
              <h3 className="font-semibold text-admin-text flex items-center gap-2 mb-4">
                <User size={16} /> Customer
              </h3>
              {customer ? (
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-admin-text">{customer.name}</p>
                  <p className="text-admin-muted">{customer.email}</p>
                  {customer.phone && <p className="text-admin-muted">{customer.phone}</p>}
                </div>
              ) : <p className="text-sm text-admin-muted">Guest order</p>}
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-admin-border p-5">
              <h3 className="font-semibold text-admin-text flex items-center gap-2 mb-4">
                <MapPin size={16} /> Shipping Address
              </h3>
              <address className="not-italic space-y-1 text-sm text-admin-text">
                <p className="font-medium">{addr?.name}</p>
                <p className="text-admin-muted">{addr?.addressLine1}</p>
                {addr?.addressLine2 && <p className="text-admin-muted">{addr.addressLine2}</p>}
                <p className="text-admin-muted">{addr?.city}, {addr?.state} — {addr?.pincode}</p>
                <p className="flex items-center gap-1 text-admin-muted mt-1">
                  <Phone size={12} /> {addr?.phone}
                </p>
              </address>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-white rounded-xl border border-admin-border p-5">
            <h3 className="font-semibold text-admin-text flex items-center gap-2 mb-4">
              <CreditCard size={16} /> Payment
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-admin-muted text-xs uppercase tracking-wide">Status</p>
                <span className={cn('inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium',
                  serialized.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                  serialized.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                )}>
                  {serialized.paymentStatus}
                </span>
              </div>
              {serialized.paymentId && (
                <div>
                  <p className="text-admin-muted text-xs uppercase tracking-wide">Payment ID</p>
                  <p className="mt-1 font-mono text-xs text-admin-text">{serialized.paymentId}</p>
                </div>
              )}
              {serialized.razorpayOrderId && (
                <div>
                  <p className="text-admin-muted text-xs uppercase tracking-wide">Razorpay Order</p>
                  <p className="mt-1 font-mono text-xs text-admin-text">{serialized.razorpayOrderId}</p>
                </div>
              )}
              <div>
                <p className="text-admin-muted text-xs uppercase tracking-wide">Placed On</p>
                <p className="mt-1 text-admin-text">{formatDateTime(serialized.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Tracking info (if shipped) */}
          {serialized.trackingId && (
            <div className="bg-white rounded-xl border border-admin-border p-5">
              <h3 className="font-semibold text-admin-text mb-3">Tracking Info</h3>
              <div className="space-y-2 text-sm">
                {serialized.courierName && <p><span className="text-admin-muted">Courier:</span> {serialized.courierName}</p>}
                {serialized.trackingId && <p><span className="text-admin-muted">Tracking ID:</span> <span className="font-mono">{serialized.trackingId}</span></p>}
                {serialized.trackingUrl && (
                  <Link href={serialized.trackingUrl} target="_blank" className="flex items-center gap-1.5 text-brand-primary hover:underline">
                    Track Shipment <ExternalLink size={12} />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Tracking form ── */}
        <div>
          <TrackingForm
            orderId={serialized._id}
            currentStatus={serialized.orderStatus}
            currentPaymentStatus={serialized.paymentStatus}
            currentTracking={{
              courierName: serialized.courierName,
              trackingId: serialized.trackingId,
              trackingUrl: serialized.trackingUrl,
            }}
          />
        </div>
      </div>
    </div>
  );
}
