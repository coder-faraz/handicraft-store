// FILE: src/app/(store)/account/addresses/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, MapPin, Heart, Package, Loader2, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AddressesPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login?redirect=/account/addresses');
    }
  }, [isLoading, isLoggedIn, router]);

  const fetchAddresses = () => {
    setFetching(true);
    fetch('/api/addresses')
      .then(res => res.json())
      .then(data => {
        if (data.success) setAddresses(data.data);
      })
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAddresses();
    }
  }, [isLoggedIn]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAddresses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) fetchAddresses();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading || fetching) {
    return (
      <div className="py-24 flex items-center justify-center bg-brand-light min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className="bg-brand-light/50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-8">Saved Addresses</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-2">
            <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-brand-dark hover:bg-white hover:shadow-sm rounded-xl font-medium transition-all">
              <User size={18} className="text-brand-muted" /> Profile
            </Link>
            <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-brand-dark hover:bg-white hover:shadow-sm rounded-xl font-medium transition-all">
              <Package size={18} className="text-brand-muted" /> My Orders
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 bg-brand-primary text-white rounded-xl font-medium shadow-sm">
              <MapPin size={18} /> Saved Addresses
            </Link>
            <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-brand-dark hover:bg-white hover:shadow-sm rounded-xl font-medium transition-all">
              <Heart size={18} className="text-brand-muted" /> Wishlist
            </Link>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            
            {addresses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-brand-border p-12 text-center shadow-sm">
                <MapPin size={48} className="mx-auto mb-4 text-brand-muted" />
                <h2 className="text-xl font-bold text-brand-dark mb-2">No addresses saved</h2>
                <p className="text-brand-muted mb-6">Add a shipping address to checkout faster.</p>
                {/* Note: In a real app we'd have a form modal here. Keeping it simple per spec. */}
                <span className="text-sm text-brand-muted italic">Add address via Checkout</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr._id} className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm relative group">
                    {addr.isDefault && (
                      <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2 py-1 rounded flex items-center gap-1">
                        <CheckCircle2 size={12} /> Default
                      </span>
                    )}
                    <h3 className="font-bold text-brand-dark pr-20">{addr.name}</h3>
                    <p className="text-sm text-brand-muted mt-2">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="text-sm text-brand-muted">{addr.addressLine2}</p>}
                    <p className="text-sm text-brand-muted">{addr.city}, {addr.state} {addr.pincode}</p>
                    <p className="text-sm font-medium text-brand-dark mt-2">Mobile: {addr.phone}</p>
                    
                    <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {!addr.isDefault && (
                          <button onClick={() => handleSetDefault(addr._id)} className="text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors">
                            Set as Default
                          </button>
                        )}
                      </div>
                      <button onClick={() => handleDelete(addr._id)} className="text-red-500 hover:text-red-700 transition-colors p-1" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
