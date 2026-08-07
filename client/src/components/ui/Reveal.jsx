import { useRef } from "react";
import { useInView } from "../../lib/hooks";

/**
 * Fades + translates children up into place the first time they cross into
 * the viewport. `delay` (ms) lets a parent stagger a list of children.
 */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div", ...props }) {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
      {...props}
    >
      {children}
    </Tag>
  );
}
