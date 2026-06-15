// FILE: src/app/error.tsx
'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-brand-light text-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-brand-border">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-600 text-2xl font-bold">!</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">Something went wrong!</h2>
        <p className="text-brand-muted mb-8">
          We encountered an unexpected error. Our technical team has been notified.
        </p>
        <button
          onClick={() => reset()}
          className="btn-primary px-8 py-3 w-full"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
