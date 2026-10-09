export function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl mb-8 sm:mb-10 ${alignment} space-y-2`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/80 border border-primary-200/60 dark:border-primary-800/60">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-normal leading-relaxed text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
}
