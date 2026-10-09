import { useEffect, useState } from "react";
import {
  IconAlert,
  IconBox,
  IconBranch,
  IconChart,
  IconFile,
  IconFolder,
  IconLayers,
  IconQuestion,
  IconSparkle,
  IconTerminal,
} from "../ui/Icons";
import { AnalysisPanelContent } from "./AnalysisPanelContent";

export const ANALYSIS_TABS = [
  { id: "overview", label: "AI Summary", icon: IconSparkle, description: "A plain-English explanation of what this repository does and how it's put together." },
  { id: "stack", label: "Stack Detection", icon: IconBranch, description: "Frameworks, languages, and infrastructure detected from manifests and config files." },
  { id: "architecture", label: "Architecture", icon: IconLayers, description: "How requests flow through the system, from client to data layer." },
  { id: "entry-points", label: "Entry Points", icon: IconFile, description: "The handful of files that show you how the whole app boots." },
  { id: "dependencies", label: "Dependencies", icon: IconBox, description: "Key third-party packages and the role each one plays." },
  { id: "directories", label: "Key Directories", icon: IconFolder, description: "Important folders and what lives in each one." },
  { id: "risks", label: "Code Quality & Risks", icon: IconAlert, description: "Observations on testing, tooling, and other risk signals found in the repository." },
  { id: "languages", label: "Languages", icon: IconChart, description: "Composition of the codebase by language, by bytes." },
  { id: "interview", label: "Interview Prep", icon: IconQuestion, description: "AI-generated interview questions and model answers grounded in this specific repository." },
  { id: "setup", label: "Setup & Run", icon: IconTerminal, description: "How to install and run this project locally." },
];

export function AnalysisTabs({
  analysis,
  languages,
  onTabChange,
  initialTab,
  interviewQuestions,
  onGenerateInterview,
  generatingInterview,
  onInterviewTurn,
}) {
  const [activeTab, setActiveTab] = useState(initialTab ?? ANALYSIS_TABS[0].id);
  const active = ANALYSIS_TABS.find((tab) => tab.id === activeTab) ?? ANALYSIS_TABS[0];

  useEffect(() => {
    onTabChange?.(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="grid md:grid-cols-[240px_1fr] rounded-2xl border border-border dark:border-border-dark bg-bg dark:bg-bg-dark overflow-hidden mt-8">
      <div
        className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible p-3 border-b md:border-b-0 md:border-r border-border dark:border-border-dark"
        role="tablist"
      >
        {ANALYSIS_TABS.map((tab) => {
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
                  ? "bg-accent-bg dark:bg-accent-bg-dark text-heading dark:text-heading-dark border border-accent-border dark:border-accent-border-dark"
                  : "text-text dark:text-text-dark hover:text-heading dark:hover:text-heading-dark hover:bg-accent-bg/50 dark:hover:bg-accent-bg-dark/50 border border-transparent"
              }`}
            >
              <Icon width={16} height={16} className="shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-6 sm:p-8">
        <h3 className="text-lg font-medium text-heading dark:text-heading-dark mb-1.5">{active.label}</h3>
        <p className="text-sm text-text dark:text-text-dark mb-6">{active.description}</p>
        <div key={active.id}>
          <AnalysisPanelContent
            tabId={active.id}
            analysis={analysis}
            languages={languages}
            interviewQuestions={interviewQuestions}
            onGenerateInterview={onGenerateInterview}
            generatingInterview={generatingInterview}
            onInterviewTurn={onInterviewTurn}
          />
        </div>
      </div>
    </div>
  );
}
