import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  color: string;
  trend?: number;
  prominent?: boolean;
}

export default function KPICard({ label, value, color, trend, prominent = false }: KPICardProps) {
  return (
    <div
      className={`bg-tavazi-charcoal border border-tavazi-navy/15 rounded-[10px] p-5 transition-all duration-200 hover:border-tavazi-navy/30 ${
        prominent ? 'ring-1 ring-success/20' : ''
      }`}
    >
      <div className="text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2 font-body">
        {label}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="font-display text-[28px] leading-tight" style={{ color }}>
          {value}
        </div>
        {trend !== undefined && trend !== 0 && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend > 0
                ? 'text-success bg-success/10'
                : 'text-danger bg-danger/10'
            }`}
          >
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}
