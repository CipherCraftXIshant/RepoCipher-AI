import { useState } from "react";
import { INSIGHT_TABS } from "./data";
import { InsightPanelContent } from "./InsightPanelContent";

export function FindingsTabs() {
  const [activeTab, setActiveTab] = useState(INSIGHT_TABS[0].id);
  const active = INSIGHT_TABS.find((tab) => tab.id === activeTab) ?? INSIGHT_TABS[0];

  return (
    <div className="grid md:grid-cols-[260px_1fr] rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden">
      <div
        className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible p-3.5 border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40"
        role="tablist"
      >
        {INSIGHT_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-left whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <Icon width={16} height={16} className="shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-6 sm:p-8 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            {active.label}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {active.description}
          </p>
        </div>

        <div key={active.id} className="fade-in pt-2">
          <InsightPanelContent tabId={active.id} />
        </div>
      </div>
    </div>
  );
}
