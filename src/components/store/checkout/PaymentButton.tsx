// FILE: src/components/store/checkout/PaymentButton.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Script from 'next/script';
import { formatPrice } from '@/lib/utils';
import type { CheckoutInput } from '@/validators/order.schema';

interface PaymentButtonProps {
  addressData: CheckoutInput | null;
  disabled: boolean;
}

export default function PaymentButton({ addressData, disabled }: PaymentButtonProps) {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const shippingCharge = totalPrice < 999 ? 60 : 0;
  const finalTotal = totalPrice + shippingCharge;

  const handlePayment = async () => {
    if (!addressData) {
      alert('Please select or enter a shipping address');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on backend
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          addressData,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to create order');
        setLoading(false);
        return;
      }

      // 2. Initialize Razorpay
      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: data.currency,
        name: 'Limra Manufacturing Co.',
        description: 'Handicraft Purchase',
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          setLoading(true);
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: data.dbOrderId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/orders/${verifyData.orderId}?success=true`);
            } else {
              alert(verifyData.error || 'Payment verification failed');
              router.push(`/orders/${data.dbOrderId}`);
            }
          } catch (e) {
            console.error(e);
            alert('Error verifying payment');
            router.push(`/orders/${data.dbOrderId}`);
          }
        },
        prefill: {
          name: '', // Optional, could get from session
          email: '',
          contact: addressData.newAddress?.phone || '',
        },
        theme: {
          color: '#8B4513',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error(response.error);
        alert('Payment failed. You can retry from your orders page.');
        router.push(`/orders/${data.dbOrderId}`);
      });

      rzp.open();

    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      // Don't set loading to false here because the Razorpay modal is open
      // We handle loading state in success/failure callbacks
      setTimeout(() => setLoading(false), 2000); 
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <button
        onClick={handlePayment}
        disabled={disabled || loading || items.length === 0}
        className="w-full btn-primary py-4 text-lg font-bold shadow-warm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader2 size={20} className="animate-spin" /> Processing...</>
        ) : (
          `Pay ${formatPrice(finalTotal)}`
        )}
      </button>
    </>
  );
}
