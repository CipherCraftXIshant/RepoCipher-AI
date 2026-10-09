import React from "react";
import { RepoInput } from "./RepoInput";
import { Sparkles, Zap, ShieldCheck, Cpu } from "lucide-react";

export function Hero({ onAnalyze }) {
  return (
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 text-center overflow-hidden">
      {/* Ambient glowing backdrop spheres */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 w-[650px] h-[400px] rounded-full glow-primary blur-[140px] opacity-70 dark:opacity-90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-32 w-[350px] h-[350px] rounded-full glow-emerald blur-[120px] opacity-50 dark:opacity-70"
      />

      <div className="relative max-w-5xl mx-auto space-y-6">
        {/* Floating Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold shadow-xs animate-float">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400">
            <Sparkles className="w-4 h-4" />
            RepoCipher AI 2.0
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Understand any codebase in minutes
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-extrabold tracking-tight leading-[1.05] text-4xl sm:text-6xl lg:text-7xl text-slate-900 dark:text-white max-w-4xl mx-auto">
          Understand any codebase.{" "}
          <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 dark:from-primary-400 dark:via-purple-400 dark:to-indigo-300 bg-clip-text text-transparent animate-gradient-x">
            Before you read it.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-normal">
          Paste any public GitHub repository and RepoCipher automatically detects the stack, maps the request flow architecture, and hands you an AI-generated onboarding guide.
        </p>

        {/* Interactive Input Component */}
        <div className="pt-4 max-w-2xl mx-auto">
          <RepoInput onAnalyze={onAnalyze} />
        </div>

        {/* Quick Value Props */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>10x Faster Developer Onboarding</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-primary-500" />
            <span>AST & Manifest Topology Mapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Zero Local Cloning Required</span>
          </div>
        </div>
      </div>
    </section>
  );
}
