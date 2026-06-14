// FILE: src/app/(store)/orders/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Loader2, ArrowLeft, MapPin, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_STEPS = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  const isSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    if (isLoggedIn && params.id) {
      fetch(`/api/orders/${params.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrder(data.data);
          } else {
            router.push('/orders');
          }
        })
        .finally(() => setFetching(false));
    }
  }, [isLoggedIn, params.id, router]);

  if (isLoading || fetching) {
    return (
      <div className="py-24 flex items-center justify-center bg-brand-light min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!order) return null;

  const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="bg-brand-light/50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {isSuccess && (
          <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
            <CheckCircle2 className="text-emerald-500 mt-1" size={24} />
            <div>
              <h2 className="text-lg font-bold text-emerald-900">Order Placed Successfully!</h2>
              <p className="text-emerald-700 mt-1">Thank you for your purchase. Your payment has been verified and your order is confirmed.</p>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center gap-4">
          <Link href="/orders" className="w-10 h-10 bg-white border border-brand-border rounded-full flex items-center justify-center text-brand-dark hover:border-brand-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-dark">Order #{order.orderNumber}</h1>
            <p className="text-brand-muted text-sm mt-1">Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy h:mm a')}</p>
          </div>
        </div>

        {/* Tracking Stepper */}
        {order.orderStatus !== 'cancelled' && (
          <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 shadow-sm mb-8 overflow-hidden">
            <h3 className="font-bold text-brand-dark mb-8 text-lg">Order Status</h3>
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-brand-border -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500" 
                style={{ width: `${(Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
              
              <div className="relative z-10 flex justify-between">
                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-brand-border text-brand-muted'}`}>
                        {isCompleted && <CheckCircle2 size={16} />}
                      </div>
                      <span className={`mt-3 text-xs md:text-sm font-medium capitalize hidden md:block ${isCurrent ? 'text-brand-dark font-bold' : isCompleted ? 'text-emerald-700' : 'text-brand-muted'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {order.trackingId && (
              <div className="mt-8 bg-brand-light p-4 rounded-xl border border-brand-border flex flex-wrap gap-6 items-center justify-between">
                <div>
                  <p className="text-xs text-brand-muted">Courier / Logistics</p>
                  <p className="font-bold text-brand-dark flex items-center gap-2"><Truck size={16} /> {order.courierName || 'Standard Shipping'}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-muted">Tracking ID</p>
                  <p className="font-bold text-brand-dark tracking-wide">{order.trackingId}</p>
                </div>
                {order.trackingUrl && (
                  <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="btn-primary px-4 py-2 text-sm rounded-lg">
                    Track Shipment
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm">
              <h3 className="font-bold text-brand-dark mb-4 text-lg border-b border-brand-border pb-4">Items Ordered</h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-20 h-20 bg-brand-light rounded-xl overflow-hidden border border-brand-border flex-shrink-0">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-brand-border" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${item.productId}`} className="font-semibold text-brand-dark hover:text-brand-primary line-clamp-2">
                        {item.productName}
                      </Link>
                      <p className="text-sm text-brand-muted mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-brand-dark">{formatPrice(item.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Payment Info */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm">
              <h3 className="font-bold text-brand-dark mb-4 text-lg flex items-center gap-2 border-b border-brand-border pb-4">
                <CreditCard size={20} className="text-brand-primary" /> Payment Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Subtotal</span>
                  <span className="font-medium text-brand-dark">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Shipping</span>
                  <span className="font-medium text-brand-dark">{order.shippingCharge === 0 ? 'Free' : formatPrice(order.shippingCharge)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Discount</span>
                    <span className="font-medium text-emerald-600">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-brand-border">
                  <span className="font-bold text-brand-dark">Total</span>
                  <span className="font-display text-xl font-bold text-brand-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between text-sm">
                <span className="text-brand-muted">Payment Status</span>
                <span className={`px-2 py-1 rounded font-medium capitalize ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm sticky top-28">
              <h3 className="font-bold text-brand-dark mb-4 text-lg flex items-center gap-2 border-b border-brand-border pb-4">
                <MapPin size={20} className="text-brand-primary" /> Delivery Address
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-bold text-brand-dark">{order.shippingAddress.name}</p>
                <p className="text-brand-muted">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p className="text-brand-muted">{order.shippingAddress.addressLine2}</p>}
                <p className="text-brand-muted">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                <p className="text-brand-dark font-medium mt-3">Phone: {order.shippingAddress.phone}</p>
              </div>
              
              {order.notes && (
                <div className="mt-6 pt-4 border-t border-brand-border">
                  <p className="text-xs font-semibold text-brand-dark uppercase mb-2">Order Notes</p>
                  <p className="text-sm text-brand-muted bg-brand-light p-3 rounded-lg italic">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
