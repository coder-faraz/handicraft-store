// FILE: src/components/store/cart/CartDrawer.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function CartDrawer() {
  const { isCartOpen, setCartOpen, items, updateQuantity, removeItem, totalPrice } = useCart();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-brand-light shadow-warm-lg flex flex-col transform transition-transform duration-300 ease-in-out',
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-white border-b border-brand-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-dark" />
            <h2 className="font-display text-lg font-bold text-brand-dark">Your Cart</h2>
            <span className="bg-brand-primary text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              {items.length}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1 text-brand-muted hover:text-brand-dark transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white border border-brand-border flex items-center justify-center">
                <ShoppingBag size={32} className="text-brand-muted/50" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-brand-dark mb-1">Your cart is empty</h3>
                <p className="text-sm text-brand-muted">Looks like you haven't added anything yet.</p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-4 btn-primary px-6"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-brand-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-brand-muted font-medium">Subtotal</span>
              <span className="font-display text-xl font-bold text-brand-dark">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-brand-muted text-center mb-2">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="btn-primary bg-white text-brand-dark border border-brand-border hover:bg-brand-light hover:text-brand-dark text-center"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="btn-primary text-center"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
