import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

export function Dialog({ open, onOpenChange, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && open) {
        onOpenChange?.(false);
      }
    }
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-200"
        onClick={() => onOpenChange?.(false)}
        aria-hidden="true"
      />
      {/* Dialog content wrapper */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="relative z-50 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-[#0D1322] text-white p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-left mb-5", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, children, ...props }) {
  return (
    <div className="flex items-center justify-between">
      <h2
        className={cn("text-lg font-bold text-white leading-none tracking-tight", className)}
        {...props}
      >
        {children}
      </h2>
    </div>
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-xs text-slate-400 mt-1 leading-relaxed", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6",
        className
      )}
      {...props}
    />
  );
}

export function DialogClose({ onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
        className
      )}
    >
      <X className="w-4 h-4" />
      <span className="sr-only">Close</span>
    </button>
  );
}
