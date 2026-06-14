// FILE: src/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, Store, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { login, isLoggedIn, user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
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

    // Redirect based on role
    router.push(user?.role === 'admin' ? '/admin' : redirect);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <Loader2 size={32} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-primary mb-4">
            <Store size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Welcome Back</h1>
          <p className="text-brand-muted text-sm mt-1">Sign in to Limra Manufacturing</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-warm p-6 border border-brand-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
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
                autoComplete="email"
                className="input-brand"
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
                  autoComplete="current-password"
                  className="input-brand pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center mt-2"
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in…</>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-primary hover:underline font-medium">
              Register
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
  );
}
