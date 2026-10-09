import { Reveal } from "../ui/Reveal";
import { TRUST_METRICS } from "./data";

export function TrustMetrics() {
  return (
    <div className="space-y-8">
      <Reveal className="text-center max-w-xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Built for developers who don't want to spend days reading raw source trees.
        </h3>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {TRUST_METRICS.map((metric, i) => (
          <Reveal key={metric.label} delay={i * 90}>
            <div className="text-center p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 hover:border-primary-500 transition-all duration-200 group">
              <span className="block text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {metric.value}
              </span>
              <span className="block text-sm font-bold text-primary-600 dark:text-primary-400 mb-1">
                {metric.label}
              </span>
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                {metric.note}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
