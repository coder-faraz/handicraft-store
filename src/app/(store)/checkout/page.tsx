// FILE: src/app/(store)/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Loader2 } from 'lucide-react';
import AddressForm from '@/components/store/checkout/AddressForm';
import OrderSummary from '@/components/store/checkout/OrderSummary';
import PaymentButton from '@/components/store/checkout/PaymentButton';
import type { CheckoutInput } from '@/validators/order.schema';

export default function CheckoutPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  const [addressData, setAddressData] = useState<CheckoutInput | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login?redirect=/checkout');
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center bg-brand-light">
        <Loader2 size={32} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-4">Your Cart is Empty</h1>
        <p className="text-brand-muted mb-8">Add items to your cart before proceeding to checkout.</p>
        <Link href="/products" className="btn-primary px-8 py-3 inline-flex">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-light/50 min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-brand-muted mb-8">
          <Link href="/cart" className="hover:text-brand-primary transition-colors">Cart</Link>
          <ChevronRight size={14} />
          <span className="text-brand-dark font-medium">Checkout</span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left Column: Address Form */}
          <div className="flex-1 w-full space-y-8">
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-6">1. Shipping Address</h2>
              <AddressForm onAddressSelect={setAddressData} />
            </div>

            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm opacity-60">
              <h2 className="font-display text-xl font-bold text-brand-dark">2. Payment Method</h2>
              <p className="text-sm text-brand-muted mt-2">You will pay securely via Razorpay after clicking Pay.</p>
            </div>
          </div>

          {/* Right Column: Order Summary & Payment */}
          <div className="w-full lg:w-[400px] sticky top-28 space-y-6">
            <OrderSummary />
            <PaymentButton addressData={addressData} disabled={!addressData} />
            
            <div className="flex items-center justify-center gap-2 text-sm text-brand-muted p-3 bg-white border border-brand-border rounded-xl">
              <ShieldCheck size={18} className="text-emerald-600" />
              <span>100% Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
