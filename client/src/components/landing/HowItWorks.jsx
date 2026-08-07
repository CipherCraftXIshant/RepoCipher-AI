import { Reveal } from "../ui/Reveal";
import { HOW_IT_WORKS } from "./data";

export function HowItWorks() {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
      <div
        aria-hidden="true"
        className="hidden md:block absolute top-6 left-[16.5%] right-[16.5%] h-px overflow-hidden"
      >
        <div className="h-full w-[200%] bg-[repeating-linear-gradient(to_right,rgb(192_132_252/0.5)_0,rgb(192_132_252/0.5)_6px,transparent_6px,transparent_12px)] animate-flow-x" />
      </div>

      {HOW_IT_WORKS.map((step, i) => {
        const Icon = step.icon;
        return (
          <Reveal key={step.n} delay={i * 100} className="relative">
            <div className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-200 hover:border-accent-dark/40 hover:bg-white/[0.04] hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-dark border border-white/15 text-accent-dark shrink-0 transition-colors duration-200 group-hover:border-accent-dark/60">
                  <Icon width={17} height={17} />
                </span>
                <span className="text-sm font-mono text-text-dark/60">{step.n}</span>
              </div>
              <h3 className="text-base font-medium text-heading-dark">{step.title}</h3>
              <p className="text-[15px] text-text-dark leading-relaxed">{step.body}</p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
