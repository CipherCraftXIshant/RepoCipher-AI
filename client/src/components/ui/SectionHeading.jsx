export function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-140 mb-10 sm:mb-12 ${alignment}`}>
      {eyebrow && <span className="block text-[13px] font-semibold text-accent-dark mb-3 tracking-wide uppercase">{eyebrow}</span>}
      <h2 className="text-2xl sm:text-3xl font-medium text-heading-dark tracking-[-0.6px] mb-3 text-balance">{title}</h2>
      {subtitle && <p className="text-text-dark text-[15px] sm:text-base leading-relaxed text-balance">{subtitle}</p>}
    </div>
  );
}
