// FILE: src/components/admin/dashboard/StatsCard.tsx
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number; // positive = up, negative = down, 0 = neutral
  trendLabel?: string;
  color?: 'brown' | 'amber' | 'green' | 'blue' | 'purple';
}

const colorMap = {
  brown:  { bg: 'bg-[#8B4513]/10', icon: 'text-[#8B4513]', badge: 'bg-[#8B4513]' },
  amber:  { bg: 'bg-amber-50',     icon: 'text-amber-600',  badge: 'bg-amber-500' },
  green:  { bg: 'bg-emerald-50',   icon: 'text-emerald-600',badge: 'bg-emerald-500' },
  blue:   { bg: 'bg-blue-50',      icon: 'text-blue-600',   badge: 'bg-blue-500' },
  purple: { bg: 'bg-purple-50',    icon: 'text-purple-600', badge: 'bg-purple-500' },
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'brown',
}: StatsCardProps) {
  const colors = colorMap[color];

  const TrendIcon = trend === undefined || trend === 0
    ? Minus
    : trend > 0 ? TrendingUp : TrendingDown;

  const trendColor =
    trend === undefined || trend === 0
      ? 'text-admin-muted'
      : trend > 0
      ? 'text-emerald-600'
      : 'text-red-500';

  return (
    <div className="bg-white rounded-xl border border-admin-border p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', colors.bg)}>
          <Icon size={22} className={colors.icon} />
        </div>

        {/* Trend badge */}
        {trend !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full', trendColor,
            trend > 0 ? 'bg-emerald-50' : trend < 0 ? 'bg-red-50' : 'bg-gray-100'
          )}>
            <TrendIcon size={12} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-admin-text tracking-tight">{value}</p>
        <p className="text-sm text-admin-muted mt-0.5">{title}</p>
        {trendLabel && (
          <p className="text-xs text-admin-muted mt-1">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}
