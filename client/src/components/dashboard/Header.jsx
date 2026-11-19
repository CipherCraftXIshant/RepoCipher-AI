import React from "react";
import { Plus, Menu, Bell, ChevronRight, Home, Sparkles } from "lucide-react";

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

export function Header({
  userName = "Ishant",
  onOpenAnalyzeModal,
  onToggleMobileSidebar,
}) {
  const greeting = getTimeGreeting();

  return (
    <header className="space-y-4 pb-4 border-b border-slate-800/80 bg-transparent">
      {/* Top Breadcrumbs & Utility Row */}
      <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 -ml-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Home className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          <span className="text-slate-400 font-medium">Workspace</span>
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          <span className="font-semibold text-white truncate">Dashboard Overview</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title & CTA Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {greeting}, {userName} <span className="animate-wiggle inline-block">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time software architecture AST mapping, intelligence scoring, and senior engineering interview loops.
          </p>
        </div>

        {/* Primary CTA */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onOpenAnalyzeModal}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 px-4.5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all cursor-pointer border border-indigo-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>Analyze Repository</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
