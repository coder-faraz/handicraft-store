// FILE: src/app/admin/loading.tsx
export default function AdminLoading() {
  return (
    <div className="p-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="w-48 h-8 bg-slate-200 rounded animate-pulse"></div>
        <div className="w-32 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-24 h-4 bg-slate-200 rounded animate-pulse mb-4"></div>
            <div className="w-16 h-8 bg-slate-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
          <div className="w-full h-4 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4 w-1/2">
                <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="w-full h-4 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="w-24 h-6 bg-slate-200 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
