// FILE: src/app/(store)/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Loader2, Package, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function MyOrdersPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login?redirect=/orders');
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.data);
          }
        })
        .finally(() => setFetching(false));
    }
  }, [isLoggedIn]);

  if (isLoading || fetching) {
    return (
      <div className="py-24 flex items-center justify-center bg-brand-light min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-brand-light text-brand-dark border-brand-border';
    }
  };

  return (
    <div className="bg-brand-light/50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4 text-brand-muted">
              <Package size={32} />
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-2">No orders yet</h2>
            <p className="text-brand-muted mb-6">You haven't placed any orders yet. Start exploring our collection!</p>
            <Link href="/products" className="btn-primary px-8 py-3 inline-flex">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm hover:border-brand-primary transition-colors group">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-brand-border/50">
                  <div>
                    <p className="text-xs text-brand-muted mb-1">Order Number</p>
                    <p className="font-bold text-brand-dark">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted mb-1">Date Placed</p>
                    <p className="font-medium text-brand-dark">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted mb-1">Total Amount</p>
                    <p className="font-bold text-brand-dark">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item: any, idx: number) => (
                      <div key={idx} className="w-10 h-10 rounded-full border-2 border-white bg-brand-light overflow-hidden">
                        {item.productImage ? (
                          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-brand-border" />
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-dark text-white flex items-center justify-center text-xs font-medium z-10">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <Link 
                    href={`/orders/${order._id}`} 
                    className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-dark transition-colors"
                  >
                    View Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
