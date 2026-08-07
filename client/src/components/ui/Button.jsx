import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { IconArrowRight, IconLoader } from "./Icons";

const VARIANTS = {
  primary:
    "bg-accent-dark text-[#0b0710] border border-accent-dark shadow-[0_1px_0_0_rgb(255_255_255_/_0.25)_inset,0_8px_24px_-8px_rgb(192_132_252_/_0.55)] hover:shadow-[0_1px_0_0_rgb(255_255_255_/_0.3)_inset,0_12px_32px_-8px_rgb(192_132_252_/_0.7)] hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-white/[0.04] text-heading-dark border border-white/10 hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "bg-transparent text-text-dark border border-transparent hover:text-heading-dark hover:bg-white/[0.05]",
};

const SIZES = {
  md: "text-sm px-4 py-2.5 gap-1.5",
  lg: "text-base px-6 py-3.5 gap-2",
};

/**
 * Shared CTA button. Renders a router `Link`, a plain `a`, or a `button`
 * depending on which of `to` / `href` is supplied.
 */
export const Button = forwardRef(function Button(
  {
    as,
    to,
    href,
    variant = "primary",
    size = "lg",
    loading = false,
    showArrow = false,
    className = "",
    children,
    disabled,
    type = "button",
    ...props
  },
  ref,
) {
  const classes = `group relative inline-flex items-center justify-center rounded-xl font-medium whitespace-nowrap transition-all duration-200 ease-out no-underline cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-dark/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const content = (
    <>
      {loading && <IconLoader width={16} height={16} />}
      <span>{children}</span>
      {showArrow && !loading && (
        <IconArrowRight width={16} height={16} className="transition-transform duration-200 group-hover:translate-x-1" />
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
    <button ref={ref} type={type} className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
});
