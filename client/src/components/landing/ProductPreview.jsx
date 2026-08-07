import { useState } from "react";
import { AI_SUMMARY_PARAGRAPHS, PRODUCT_SIDEBAR, STACK_BADGES } from "./data";
import { ArchitectureShowcase } from "./ArchitectureShowcase";
import { FileTreeExplorer } from "./FileTreeExplorer";
import { InsightPanelContent } from "./InsightPanelContent";
import { ChatPreview } from "./ChatPreview";

function OverviewPanel() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-[15px] leading-relaxed text-text-dark">{AI_SUMMARY_PARAGRAPHS[0]}</p>
      <div className="flex flex-wrap gap-2">
        {STACK_BADGES.map((item) => (
          <span key={item.name} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-[13px] text-heading-dark">
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

const PANELS = {
  overview: OverviewPanel,
  architecture: ArchitectureShowcase,
  files: FileTreeExplorer,
  dependencies: () => <InsightPanelContent tabId="dependencies" />,
  chat: ChatPreview,
};

const TITLES = {
  overview: "react Repository",
  architecture: "Architecture",
  files: "Files",
  dependencies: "Dependencies",
  chat: "Ask RepoCipher",
};

export function ProductPreview() {
  const [active, setActive] = useState("overview");
  const ActivePanel = PANELS[active];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)]">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10 bg-white/[0.015]">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="ml-3 text-[13px] font-medium text-text-dark">RepoCipher AI</span>
      </div>

      <div className="grid md:grid-cols-[220px_1fr]">
        <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible p-3 border-b md:border-b-0 md:border-r border-white/10">
          {PRODUCT_SIDEBAR.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium text-left whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                  isActive ? "bg-accent-dark/15 text-accent-dark" : "text-text-dark hover:text-heading-dark hover:bg-white/5"
                }`}
              >
                <Icon width={16} height={16} className="shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 sm:p-8 min-h-100">
          <h3 className="text-lg font-medium text-heading-dark mb-6">{TITLES[active]}</h3>
          <div key={active} className="fade-in">
            <ActivePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
