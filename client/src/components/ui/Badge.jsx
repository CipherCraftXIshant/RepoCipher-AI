import React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
  default: "bg-primary-50 text-primary-700 border-primary-200/70",
  secondary: "bg-slate-100 text-slate-700 border-slate-200",
  outline: "text-slate-600 border-slate-200 bg-transparent",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  warning: "bg-amber-50 text-amber-700 border-amber-200/70",
  danger: "bg-rose-50 text-rose-700 border-rose-200/70",
  neutral: "bg-slate-50 text-slate-600 border-slate-200/80",
};

export function Badge({ className, variant = "default", children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
