import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Loader2, ArrowRight } from "lucide-react";

const VARIANTS = {
  default:
    "bg-primary hover:bg-accent-hover text-white shadow-sm border border-transparent active:scale-[0.98]",
  primary:
    "bg-primary hover:bg-accent-hover text-white shadow-sm border border-transparent active:scale-[0.98]",
  secondary:
    "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 active:scale-[0.98]",
  outline:
    "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-subtle active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent",
  destructive:
    "bg-danger-500 hover:bg-danger-600 text-white shadow-sm active:scale-[0.98]",
  subtle:
    "bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200/60",
};

const SIZES = {
  xs: "text-xs px-2.5 py-1.5 gap-1 rounded-lg",
  sm: "text-xs font-medium px-3 py-1.5 gap-1.5 rounded-lg",
  md: "text-sm font-medium px-3.5 py-2 gap-1.5 rounded-xl",
  lg: "text-sm font-semibold px-4.5 py-2.5 gap-2 rounded-xl",
  icon: "h-9 w-9 p-0 rounded-xl flex items-center justify-center shrink-0",
  "icon-sm": "h-7.5 w-7.5 p-0 rounded-lg flex items-center justify-center shrink-0",
};

export const Button = forwardRef(function Button(
  {
    as,
    to,
    href,
    variant = "default",
    size = "md",
    loading = false,
    showArrow = false,
    className = "",
    children,
    disabled,
    type = "button",
    ...props
  },
  ref
) {
  const classes = cn(
    "group relative inline-flex items-center justify-center font-medium whitespace-nowrap transition-all duration-150 ease-out no-underline cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 select-none",
    VARIANTS[variant] || VARIANTS.default,
    SIZES[size] || SIZES.md,
    className
  );

  const content = (
    <>
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
      {showArrow && !loading && (
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 ml-1 shrink-0" />
      )}
    </>
  );

  const Tag = as === "a" || (href && !to) ? "a" : to ? Link : "button";

  if (Tag === Link) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (Tag === "a") {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
});
