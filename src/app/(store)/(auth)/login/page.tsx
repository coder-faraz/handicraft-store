// FILE: src/app/(store)/(auth)/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, Store, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function StoreLoginPage() {
  const { login, isLoggedIn, user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push(user?.role === 'admin' ? '/admin' : redirect);
    }
  }, [isLoggedIn, isLoading, user, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setSubmitting(true);
    setError('');

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error ?? 'Login failed.');
      setSubmitting(false);
      return;
    }

    router.push(user?.role === 'admin' ? '/admin' : redirect);
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
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-warm-lg p-8 md:p-10 border border-brand-border">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary mb-4 shadow-md hover:scale-105 transition-transform">
              <Store size={32} className="text-white" />
            </Link>
            <h1 className="font-display text-3xl font-bold text-brand-dark">Welcome Back</h1>
            <p className="text-brand-muted text-sm mt-2">Sign in to your Limra account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-brand-dark mb-1.5">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-brand-dark mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-brand-border rounded-xl pl-4 pr-11 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                  required
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-brand-border text-brand-primary focus:ring-brand-primary/20 cursor-pointer" />
                <span className="text-brand-muted group-hover:text-brand-dark transition-colors">Remember me</span>
              </label>
              <a href="#" className="font-medium text-brand-primary hover:text-brand-dark transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3.5 text-base mt-2 shadow-warm hover:shadow-warm-md"
            >
              {submitting ? (
                <><Loader2 size={18} className="animate-spin inline mr-2" /> Signing in…</>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-brand-border text-center">
            <p className="text-sm text-brand-muted">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-brand-primary hover:text-brand-dark transition-colors">
                Create an account
              </Link>
            </p>
          </div>
          <p className="text-center text-xs text-brand-muted mt-5">
            <Link href="/" className="hover:text-brand-primary transition-colors">
              ← Back to store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
