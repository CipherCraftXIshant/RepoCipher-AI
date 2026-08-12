import React from "react";
import { Plus, Menu } from "lucide-react";
import { Button } from "../ui/Button";

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

export function Header({ userName = "Ishant", onOpenAnalyzeModal, onToggleMobileSidebar }) {
  const greeting = getTimeGreeting();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 pt-2 border-b border-slate-200/80 bg-transparent">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {greeting}, {userName} <span className="animate-wiggle inline-block">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Understand your codebases faster.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 self-start sm:self-auto">
        <Button
          onClick={onOpenAnalyzeModal}
          variant="default"
          size="md"
          className="shadow-sm font-semibold hover:shadow-md transition-all"
        >
          <Plus className="w-4 h-4 mr-0.5" />
          Analyze Repository
        </Button>
      </div>
    </header>
  );
}
