// FILE: src/app/(store)/loading.tsx
export default function StoreLoading() {
  return (
    <div className="bg-brand-light/20 min-h-screen">
      {/* Hero / Header Skeleton */}
      <div className="h-64 md:h-96 bg-brand-light animate-pulse w-full mb-12"></div>
      
      <div className="container mx-auto px-4 pb-24">
        {/* Title Skeleton */}
        <div className="w-48 h-8 bg-brand-light rounded animate-pulse mb-8 mx-auto"></div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-brand-border overflow-hidden">
              <div className="aspect-square bg-brand-light animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="w-full h-4 bg-brand-light rounded animate-pulse"></div>
                <div className="w-2/3 h-4 bg-brand-light rounded animate-pulse"></div>
                <div className="w-1/3 h-5 bg-brand-light rounded animate-pulse mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
