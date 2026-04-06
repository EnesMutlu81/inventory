import type { StatsData } from "@/types/inventory";

interface StatsCardProps {
  data: StatsData;
}

export default function StatsCard({ data }: StatsCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-ghost flex items-start gap-4">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
        <span className="material-symbols-outlined text-on-primary-container text-[20px]">
          {data.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-[0.05em] font-label font-medium text-on-surface-variant mb-1">
          {data.label}
        </p>
        <p className="text-2xl font-headline font-bold text-on-surface leading-none">
          {data.value}
        </p>
        {data.trend && (
          <p
            className={`text-xs font-label mt-1 flex items-center gap-0.5 ${
              data.trendUp ? "text-[#1a5c2a]" : "text-error"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {data.trendUp ? "trending_up" : "trending_down"}
            </span>
            {data.trend}
          </p>
        )}
      </div>
    </div>
  );
}
