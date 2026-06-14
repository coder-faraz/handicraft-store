// FILE: src/components/store/checkout/OrderSummary.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function OrderSummary() {
  const { items, totalPrice, totalItems } = useCart();

  const shippingCharge = totalPrice < 999 ? 60 : 0;
  const finalTotal = totalPrice + shippingCharge;

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm">
      <h2 className="font-display text-xl font-bold text-brand-dark mb-4">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-brand-border flex-shrink-0">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-brand-light" />
              )}
              <div className="absolute -top-2 -right-2 bg-brand-muted text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-brand-dark line-clamp-2">{item.name}</h4>
              <p className="text-xs text-brand-muted mt-1">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-brand-dark">{formatPrice(item.price * item.quantity)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-brand-border pt-4 space-y-3 mb-4">
        <div className="flex justify-between text-sm text-brand-muted">
          <span>Subtotal ({totalItems} items)</span>
          <span className="font-medium text-brand-dark">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm text-brand-muted">
          <span>Shipping</span>
          {shippingCharge === 0 ? (
            <span className="font-medium text-emerald-600">Free</span>
          ) : (
            <span className="font-medium text-brand-dark">{formatPrice(shippingCharge)}</span>
          )}
        </div>
      </div>

      <div className="border-t border-brand-border pt-4">
        <div className="flex justify-between items-end">
          <span className="font-bold text-brand-dark">Total</span>
          <span className="font-display text-2xl font-bold text-brand-primary">{formatPrice(finalTotal)}</span>
        </div>
        <p className="text-xs text-brand-muted text-right mt-1">Inclusive of all taxes</p>
      </div>
    </div>
  );
}
