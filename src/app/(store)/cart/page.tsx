// FILE: src/app/(store)/cart/page.tsx
'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/store/cart/CartItem';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-white border border-brand-border flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-brand-muted/50" />
        </div>
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-4">Your Cart is Empty</h1>
        <p className="text-brand-muted mb-8 max-w-md mx-auto">
          Looks like you haven't added any products to your cart yet. Discover our collection of authentic handicrafts.
        </p>
        <Link href="/products" className="btn-primary px-8 py-3 inline-flex">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-border">
              <h2 className="font-semibold text-lg text-brand-dark">Item ({totalItems})</h2>
              <Link href="/products" className="text-sm font-medium text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-1">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 sticky top-28">
            <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span className="font-medium text-brand-dark">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>Shipping estimate</span>
                <span className="font-medium text-brand-dark text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>Tax estimate</span>
                <span className="font-medium text-brand-dark">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-brand-border pt-6 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-brand-dark">Order Total</span>
                <span className="font-display font-bold text-2xl text-brand-dark">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button className="w-full btn-primary py-4 text-lg shadow-warm-md hover:shadow-warm-lg transition-all mb-4">
              Proceed to Checkout
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-brand-muted bg-brand-light p-3 rounded-lg">
              <ShieldCheck size={18} className="text-emerald-600" />
              <span>Secure Checkout & Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
