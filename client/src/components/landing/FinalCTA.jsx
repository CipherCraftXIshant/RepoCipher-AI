import React from "react";
import { Button } from "../ui/Button";
import { Sparkles } from "lucide-react";

export function FinalCTA({ isAuthenticated }) {
  return (
    <div className="relative text-center py-16 sm:py-20 px-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50">
      {/* Glow effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 rounded-full glow-primary blur-[120px] opacity-70"
      />

      <div className="relative max-w-2xl mx-auto space-y-5">
        <div className="inline-flex p-3 rounded-2xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 mb-2">
          <Sparkles className="w-8 h-8" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
          Stop onboarding by reading every file.
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-medium max-w-lg mx-auto">
          Let AI analyze, map, and summarize the codebase before you write a single line of code.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            to={isAuthenticated ? "/app" : "/signup"}
            variant="default"
            size="lg"
            showArrow
            className="w-full sm:w-auto font-bold shadow-md shadow-primary-500/20"
          >
            {isAuthenticated ? "Go to Workspace" : "Start Analyzing Repositories"}
          </Button>

          <Button
            to="/login"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto font-semibold"
          >
            Explore Interactive Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
