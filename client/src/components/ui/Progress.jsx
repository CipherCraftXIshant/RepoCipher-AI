import React from "react";
import { cn } from "../../lib/utils";

export function Progress({
  value = 0,
  max = 100,
  className,
  barClassName,
  indicatorColor,
  ...props
}) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const defaultColor =
    percentage >= 80
      ? "bg-emerald-500"
      : percentage >= 60
      ? "bg-primary-500"
      : percentage >= 40
      ? "bg-amber-500"
      : "bg-rose-500";

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          indicatorColor || defaultColor,
          barClassName
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
