import { IconSparkle } from "../ui/Icons";
import { RepoInput } from "./RepoInput";

export function Hero({ onAnalyze }) {
  return (
    <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 px-6 text-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-175 h-125 rounded-full bg-accent-dark/20 blur-[120px]"
      />

      <div className="relative max-w-220 mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-accent-dark text-[13px] font-medium mb-6">
          <IconSparkle />
          AI-powered repository intelligence
        </span>

        <h1 className="font-medium text-heading-dark tracking-[-2px] leading-[1.05] text-[40px] sm:text-[56px] lg:text-[68px] mb-6 text-balance">
          Understand any codebase.
          <br />
          Before you read it.
        </h1>

        <p className="text-text-dark max-w-140 mx-auto text-lg mb-10 text-balance">
          Paste a GitHub repository and RepoCipher maps the stack, the architecture, and the entry
          points — then hands you an AI-written onboarding guide before you open a single file.
        </p>

        <RepoInput onAnalyze={onAnalyze} />
      </div>
    </section>
  );
}
