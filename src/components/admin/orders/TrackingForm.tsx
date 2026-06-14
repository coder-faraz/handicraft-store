// FILE: src/components/admin/orders/TrackingForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ORDER_STATUSES = [
  { value: 'placed',      label: '📥 Placed' },
  { value: 'confirmed',   label: '✅ Confirmed' },
  { value: 'processing',  label: '⚙️ Processing' },
  { value: 'shipped',     label: '🚚 Shipped' },
  { value: 'delivered',   label: '🎉 Delivered' },
  { value: 'cancelled',   label: '❌ Cancelled' },
];

interface TrackingFormProps {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
  currentTracking?: {
    courierName?: string;
    trackingId?: string;
    trackingUrl?: string;
  };
}

export default function TrackingForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
  currentTracking = {},
}: TrackingFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [courierName, setCourierName] = useState(currentTracking.courierName ?? '');
  const [trackingId, setTrackingId] = useState(currentTracking.trackingId ?? '');
  const [trackingUrl, setTrackingUrl] = useState(currentTracking.trackingUrl ?? '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderStatus: status,
          paymentStatus,
          courierName: courierName || undefined,
          trackingId: trackingId || undefined,
          trackingUrl: trackingUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Update failed.');
        return;
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-admin-border px-3 py-2.5 text-sm text-admin-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all bg-white';
  const labelClass = 'block text-xs font-medium text-admin-muted mb-1.5 uppercase tracking-wide';

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-admin-border p-5 space-y-4">
      <h3 className="font-semibold text-admin-text">Update Order</h3>

      {/* Order Status */}
      <div>
        <label className={labelClass}>Order Status</label>
        <select
          id="tracking-order-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={inputClass}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Payment Status */}
      <div>
        <label className={labelClass}>Payment Status</label>
        <select
          id="tracking-payment-status"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className={inputClass}
        >
          <option value="pending">⏳ Pending</option>
          <option value="paid">✅ Paid</option>
          <option value="failed">❌ Failed</option>
        </select>
      </div>

      <hr className="border-admin-border" />
      <p className="text-xs font-medium text-admin-muted uppercase tracking-wide">Shipping Tracking</p>

      {/* Courier */}
      <div>
        <label className={labelClass}>Courier Name</label>
        <input
          id="tracking-courier"
          value={courierName}
          onChange={(e) => setCourierName(e.target.value)}
          placeholder="e.g. Delhivery, Blue Dart, DTDC"
          className={inputClass}
        />
      </div>

      {/* Tracking ID */}
      <div>
        <label className={labelClass}>Tracking ID</label>
        <input
          id="tracking-id"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="e.g. DLV1234567890"
          className={inputClass}
        />
      </div>

      {/* Tracking URL */}
      <div>
        <label className={labelClass}>Tracking URL</label>
        <input
          id="tracking-url"
          type="url"
          value={trackingUrl}
          onChange={(e) => setTrackingUrl(e.target.value)}
          placeholder="https://courier.com/track/..."
          className={inputClass}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
          <CheckCircle size={15} />
          Order updated successfully!
        </div>
      )}

      <button
        id="tracking-submit-btn"
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-[#7a3c10] disabled:opacity-60 transition-colors"
      >
        {loading ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><Save size={15} /> Update Order</>}
      </button>
    </form>
  );
}
