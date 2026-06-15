// FILE: src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-brand-light text-center px-4">
      <div className="max-w-md w-full">
        {/* Decorative SVG */}
        <svg 
          viewBox="0 0 200 200" 
          className="w-48 h-48 mx-auto mb-8 text-brand-primary"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M100 20C55.8 20 20 55.8 20 100C20 144.2 55.8 180 100 180C144.2 180 180 144.2 180 100C180 55.8 144.2 20 100 20ZM100 160C66.9 160 40 133.1 40 100C40 66.9 66.9 40 100 40C133.1 40 160 66.9 160 100C160 133.1 133.1 160 100 160Z" fill="currentColor"/>
          <path d="M100 60C77.9 60 60 77.9 60 100C60 122.1 77.9 140 100 140C122.1 140 140 122.1 140 100C140 77.9 122.1 60 100 60ZM100 120C89 120 80 111 80 100C80 89 89 80 100 80C111 80 120 89 120 100C120 111 111 120 100 120Z" fill="currentColor" opacity="0.5"/>
          <circle cx="100" cy="100" r="10" fill="currentColor" />
        </svg>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-dark mb-4">
          Page not found
        </h1>
        <p className="text-brand-muted mb-8 text-lg">
          We couldn't find the page you were looking for. It might have been moved or removed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary px-8 py-3 w-full sm:w-auto">
            Go to Homepage
          </Link>
          <Link href="/products" className="text-brand-primary font-semibold hover:text-brand-dark transition-colors px-8 py-3 w-full sm:w-auto border border-brand-primary rounded-xl hover:bg-brand-primary/5">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
