import React, { useState } from "react";
import { cn } from "../../lib/utils";

export function Avatar({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 font-medium text-slate-700 text-xs items-center justify-center select-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt = "", className, ...props }) {
  const [error, setError] = useState(false);

  if (!src || error) return null;

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
}

export function AvatarFallback({ className, children, ...props }) {
  return (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
