import { useState } from "react";
import { AI_SUMMARY_PARAGRAPHS, PRODUCT_SIDEBAR, STACK_BADGES } from "./data";
import { ArchitectureShowcase } from "./ArchitectureShowcase";
import { FileTreeExplorer } from "./FileTreeExplorer";
import { InsightPanelContent } from "./InsightPanelContent";
import { ChatPreview } from "./ChatPreview";
import { Sparkles } from "lucide-react";

function OverviewPanel() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
        {AI_SUMMARY_PARAGRAPHS[0]}
      </p>
      <div className="flex flex-wrap gap-2">
        {STACK_BADGES.map((item) => (
          <span
            key={item.name}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
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
  overview: "react Repository Topology",
  architecture: "Architecture Flow Graph",
  files: "File Tree Explorer",
  dependencies: "Dependencies Audit",
  chat: "Ask RepoCipher AI",
};

export function ProductPreview() {
  const [active, setActive] = useState("overview");
  const ActivePanel = PANELS[active];

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden mt-8">
      {/* Top Header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/70">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="ml-3 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary-500" />
          RepoCipher Interactive Product Interface
        </span>
      </div>

      <div className="grid md:grid-cols-[220px_1fr]">
        <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible p-3.5 border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
          {PRODUCT_SIDEBAR.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <Icon width={16} height={16} className="shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 sm:p-8 min-h-[380px]">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
            {TITLES[active]}
          </h3>
          <div key={active} className="fade-in">
            <ActivePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
