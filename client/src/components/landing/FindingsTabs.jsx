import { useState } from "react";
import { INSIGHT_TABS } from "./data";
import { InsightPanelContent } from "./InsightPanelContent";

export function FindingsTabs() {
  const [activeTab, setActiveTab] = useState(INSIGHT_TABS[0].id);
  const active = INSIGHT_TABS.find((tab) => tab.id === activeTab) ?? INSIGHT_TABS[0];

  return (
    <div className="grid md:grid-cols-[260px_1fr] rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible p-3 border-b md:border-b-0 md:border-r border-white/10" role="tablist">
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
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium text-left whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                isActive
                  ? "bg-accent-dark/15 text-accent-dark border border-accent-dark/30"
                  : "text-text-dark hover:text-heading-dark hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon width={16} height={16} className="shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-6 sm:p-8">
        <h3 className="text-lg font-medium text-heading-dark mb-1.5">{active.label}</h3>
        <p className="text-sm text-text-dark mb-6">{active.description}</p>
        <div key={active.id} className="fade-in">
          <InsightPanelContent tabId={active.id} />
        </div>
      </div>
    </div>
  );
}
