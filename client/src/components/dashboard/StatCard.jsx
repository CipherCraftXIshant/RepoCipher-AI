import React from "react";
import { FolderGit2, Sparkles, MessageSquare, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "../ui/Card";
import { cn } from "../../lib/utils";

const ICONS = {
  FolderGit2,
  Sparkles,
  MessageSquare,
  Activity,
};

export function StatCard({
  label,
  value,
  unit = "",
  trend,
  trendType = "positive",
  iconName = "FolderGit2",
  className,
}) {
  const Icon = ICONS[iconName] || FolderGit2;
  const isPositive = trendType === "positive";

  return (
    <Card
      className={cn(
        "p-4 hover:border-slate-300/90 transition-all duration-200 bg-white relative overflow-hidden group",
        className
      )}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
          <Icon className="w-4 h-4" />
        </div>

        {/* Trend pill if provided */}
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-md",
              isPositive
                ? "text-emerald-700 bg-emerald-50 border border-emerald-200/60"
                : "text-rose-700 bg-rose-50 border border-rose-200/60"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend}
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-0.5">
          <span>{value}</span>
          {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
        </div>
        <div className="text-xs font-medium text-slate-400 mt-0.5 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </Card>
  );
}

export function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  );
}
