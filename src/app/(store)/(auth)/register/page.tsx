// FILE: src/app/(store)/(auth)/register/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, Store, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function StoreRegisterPage() {
  const { register, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    setError('');

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone || undefined,
    });

    if (!result.success) {
      setError(result.error ?? 'Registration failed.');
      setSubmitting(false);
      return;
    }

    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center bg-brand-light">
        <Loader2 size={32} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 bg-brand-light flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-warm-lg p-8 md:p-10 border border-brand-border">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary mb-4 shadow-md hover:scale-105 transition-transform">
              <Store size={32} className="text-white" />
            </Link>
            <h1 className="font-display text-3xl font-bold text-brand-dark">Create Account</h1>
            <p className="text-brand-muted text-sm mt-2">Join Limra for exclusive artisan collections</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Full Name *</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Phone (Optional)</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full border border-brand-border rounded-xl pl-4 pr-11 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">Confirm Password *</label>
                <input
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <p className="text-xs text-brand-muted my-2">
              By creating an account, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3.5 text-base shadow-warm hover:shadow-warm-md"
            >
              {submitting ? (
                <><Loader2 size={18} className="animate-spin inline mr-2" /> Creating Account…</>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-brand-border text-center">
            <p className="text-sm text-brand-muted">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-brand-primary hover:text-brand-dark transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
