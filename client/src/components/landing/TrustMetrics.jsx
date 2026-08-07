import { Reveal } from "../ui/Reveal";
import { TRUST_METRICS } from "./data";

export function TrustMetrics() {
  return (
    <div>
      <Reveal className="text-center max-w-140 mx-auto mb-10">
        <p className="text-lg text-heading-dark">
          Built for developers who don&apos;t want to spend hours onboarding.
        </p>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TRUST_METRICS.map((metric, i) => (
          <Reveal key={metric.label} delay={i * 90}>
            <div className="text-center p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
              <span className="block text-3xl font-medium text-heading-dark tracking-[-0.5px] mb-1.5">{metric.value}</span>
              <span className="block text-sm font-medium text-accent-dark mb-2">{metric.label}</span>
              <span className="block text-[13px] text-text-dark/70">{metric.note}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
