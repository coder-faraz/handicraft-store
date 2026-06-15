// FILE: src/components/shared/LoadingSpinner.tsx
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full border-4 border-brand-light"></div>
        <Loader2 className="animate-spin text-brand-primary relative z-10" size={40} strokeWidth={3} />
      </div>
      {message && <p className="text-brand-muted font-medium text-sm animate-pulse">{message}</p>}
    </div>
  );
}
