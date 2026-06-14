// FILE: src/app/admin/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Star, Check, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Review {
  _id: string;
  productId: { _id: string; name: string } | string;
  userId: { _id: string; name: string; email: string } | string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/reviews?approved=${tab === 'approved'}`);
    const data = await res.json();
    if (data.success) setReviews(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [tab]);

  const handleApprove = async (id: string) => {
    setActionId(id);
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isApproved: true }),
    });
    fetchReviews();
    setActionId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return;
    setActionId(id);
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchReviews();
    setActionId(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-admin-text">Reviews</h1>
        <p className="text-sm text-admin-muted mt-0.5">Moderate customer product reviews</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['pending', 'approved'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
              tab === t ? 'bg-white shadow text-admin-text' : 'text-admin-muted hover:text-admin-text'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-admin-border overflow-hidden">
        {loading ? (
          <div className="py-16 text-center"><Loader2 size={28} className="animate-spin text-brand-primary mx-auto" /></div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare size={36} className="mx-auto text-admin-border mb-3" />
            <p className="text-admin-muted text-sm">No {tab} reviews.</p>
          </div>
        ) : (
          <div className="divide-y divide-admin-border">
            {reviews.map((review) => {
              const product = typeof review.productId === 'object' ? review.productId : null;
              const user = typeof review.userId === 'object' ? review.userId : null;

              return (
                <div key={review._id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      {/* Product & User */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-sm font-semibold text-admin-text truncate">
                          {product?.name ?? 'Unknown Product'}
                        </span>
                        <span className="text-admin-muted text-xs">·</span>
                        <span className="text-sm text-admin-muted">{user?.name ?? 'Unknown User'}</span>
                        <span className="text-admin-muted text-xs">·</span>
                        <span className="text-xs text-admin-muted">{formatDate(review.createdAt)}</span>
                      </div>

                      {/* Stars + title */}
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={review.rating} />
                        <span className="text-sm font-medium text-admin-text">{review.title}</span>
                      </div>

                      {/* Comment */}
                      <p className="text-sm text-admin-muted line-clamp-3">{review.comment}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!review.isApproved && (
                        <button
                          onClick={() => handleApprove(review._id)}
                          disabled={actionId === review._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          {actionId === review._id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={actionId === review._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {actionId === review._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
