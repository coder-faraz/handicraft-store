// FILE: src/app/(store)/account/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, MapPin, Heart, Package, Loader2 } from 'lucide-react';

export default function AccountPage() {
  const { user, isLoggedIn, isLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [passUpdating, setPassUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [passMessage, setPassMessage] = useState('');

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login?redirect=/account');
    }
    if (user) {
      setName(user.name || '');
      // If we expose phone in SessionUser, we can set it here.
    }
  }, [isLoading, isLoggedIn, user, router]);

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center bg-brand-light min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');
    
    // In a real app, you would have a PUT /api/auth/me route
    setTimeout(() => {
      setMessage('Profile updated successfully (Mocked)');
      setUpdating(false);
    }, 1000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassUpdating(true);
    setPassMessage('');
    
    // In a real app, you would have a POST /api/auth/change-password route
    setTimeout(() => {
      setPassMessage('Password changed successfully (Mocked)');
      setCurrentPassword('');
      setNewPassword('');
      setPassUpdating(false);
    }, 1000);
  };

  return (
    <div className="bg-brand-light/50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-8">My Account</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-2">
            <Link href="/account" className="flex items-center gap-3 px-4 py-3 bg-brand-primary text-white rounded-xl font-medium shadow-sm">
              <User size={18} /> Profile
            </Link>
            <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-brand-dark hover:bg-white hover:shadow-sm rounded-xl font-medium transition-all">
              <Package size={18} className="text-brand-muted" /> My Orders
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 text-brand-dark hover:bg-white hover:shadow-sm rounded-xl font-medium transition-all">
              <MapPin size={18} className="text-brand-muted" /> Saved Addresses
            </Link>
            <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-brand-dark hover:bg-white hover:shadow-sm rounded-xl font-medium transition-all">
              <Heart size={18} className="text-brand-muted" /> Wishlist
            </Link>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Profile Info */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 shadow-sm">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-6">Personal Information</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                {message && <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200">{message}</div>}
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-primary text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 outline-none bg-brand-light text-brand-muted text-sm cursor-not-allowed" 
                  />
                  <p className="text-xs text-brand-muted mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-primary text-sm" 
                  />
                </div>
                <button type="submit" disabled={updating} className="btn-primary px-6 py-2.5 text-sm w-full md:w-auto">
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 shadow-sm">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-6">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                {passMessage && <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200">{passMessage}</div>}
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-primary text-sm" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-primary text-sm" 
                    required
                    minLength={8}
                  />
                </div>
                <button type="submit" disabled={passUpdating} className="btn-primary px-6 py-2.5 text-sm w-full md:w-auto">
                  {passUpdating ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
