import { Reveal } from "../ui/Reveal";
import { HOW_IT_WORKS } from "./data";
import { ArrowRight } from "lucide-react";

export function HowItWorks() {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mt-8">
      {/* Animated connecting line */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute top-12 left-[16.5%] right-[16.5%] h-0.5 overflow-hidden"
      >
        <div className="h-full w-[200%] bg-gradient-to-r from-primary-500 via-purple-500 to-emerald-500 animate-gradient-x opacity-60" />
      </div>

      {HOW_IT_WORKS.map((step, i) => {
        const Icon = step.icon;
        return (
          <Reveal key={step.n} delay={i * 100} className="relative">
            <div className="group relative flex flex-col justify-between h-full p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 transition-all duration-200 hover:border-primary-500 dark:hover:border-primary-500 hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 border border-primary-200/60 dark:border-primary-800/60 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200 shadow-sm">
                    <Icon width={20} height={20} />
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-slate-300 dark:text-slate-700 group-hover:text-primary-500 transition-colors">
                    {step.n}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {step.body}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform">
                <span>Step Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
