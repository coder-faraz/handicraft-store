// FILE: src/app/page.tsx
/**
 * Temporary placeholder home page.
 * Will be replaced in Phase 2 with the full storefront homepage.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-light">
      <div className="text-center max-w-2xl px-6">
        {/* Artisan accent */}
        <p className="text-artisan text-xl mb-4">Welcome to</p>

        {/* Brand heading */}
        <h1 className="font-display text-5xl md:text-6xl font-bold text-brand-dark mb-4 leading-tight">
          Limra Manufacturing
          <span className="block text-gradient-warm">Company</span>
        </h1>

        <p className="font-body text-brand-muted text-lg mb-8">
          Authentic Indian Handicrafts — crafted with love, delivered to your door.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a href="/products" className="btn-primary text-base">
            Shop Now
          </a>
          <a href="/admin" className="btn-outline text-base">
            Admin Panel
          </a>
        </div>

        {/* Phase indicator */}
        <div className="mt-12 p-4 rounded-lg bg-brand-border/30 border border-brand-border">
          <p className="text-brand-muted text-sm font-body">
            🚀 <strong>Phase 1 Complete</strong> — Foundation scaffold ready.
            Next: Storefront UI &amp; API routes.
          </p>
        </div>
      </div>
    </main>
  );
}
