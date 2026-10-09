import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../lib/hooks";
import { IconCheck, IconGithub } from "../ui/Icons";
import { ANALYSIS_STEPS, DEFAULT_DEMO_REPO, INSIGHT_TABS } from "./data";
import { InsightPanelContent } from "./InsightPanelContent";
import { Sparkles } from "lucide-react";

const DEMO_TABS = INSIGHT_TABS.filter((tab) => tab.id !== "dependencies");
const STEP_DELAY_MS = 380;

const CHECKLIST = [
  "Repository analyzed",
  "Stack detected",
  "Architecture mapped",
  "Entry points identified",
];

function StepRow({ label, state }) {
  return (
    <li className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
      <span
        className={`flex items-center justify-center w-4 h-4 rounded-full shrink-0 border ${
          state === "done"
            ? "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400"
            : state === "active"
            ? "border-primary-500 text-primary-500"
            : "border-slate-300 dark:border-slate-700 text-transparent"
        }`}
      >
        {state === "done" && <IconCheck width={10} height={10} />}
        {state === "active" && <span className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 animate-pulse" />}
      </span>
      <span className={state === "pending" ? "text-slate-400 dark:text-slate-600" : "text-slate-800 dark:text-slate-200"}>
        {label}
      </span>
    </li>
  );
}

/**
 * The centerpiece "product demo": a terminal-style card that runs a
 * simulated analysis (checklist) then reveals an interactive tabbed
 * preview of the results. Re-runs whenever `trigger.key` changes.
 */
export function AnalysisDemo({ trigger }) {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState("result");
  const [repoLabel, setRepoLabel] = useState(DEFAULT_DEMO_REPO);
  const [stepIndex, setStepIndex] = useState(ANALYSIS_STEPS.length);
  const [activeTab, setActiveTab] = useState(DEMO_TABS[0].id);
  const timeouts = useRef([]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (!trigger) return undefined;

    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setRepoLabel(trigger.repo);
    setActiveTab(DEMO_TABS[0].id);

    if (reducedMotion) {
      setPhase("result");
      setStepIndex(ANALYSIS_STEPS.length);
      return undefined;
    }

    setPhase("analyzing");
    setStepIndex(0);

    ANALYSIS_STEPS.forEach((_, i) => {
      timeouts.current.push(setTimeout(() => setStepIndex(i + 1), (i + 1) * STEP_DELAY_MS));
    });
    timeouts.current.push(
      setTimeout(() => setPhase("result"), ANALYSIS_STEPS.length * STEP_DELAY_MS + 350),
    );

    return () => timeouts.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger?.key]);

  return (
    <div
      id="analysis-demo"
      className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden"
    >
      {/* Top terminal bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/70">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            RepoCipher Live Analysis
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Active Session
        </span>
      </div>

      <div className="p-5 sm:p-7 space-y-5">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-300 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/60">
          <IconGithub width={16} height={16} className="text-slate-400" />
          <span className="font-semibold text-slate-900 dark:text-white">github.com/{repoLabel}</span>
        </div>

        {phase === "analyzing" ? (
          <ul className="flex flex-col gap-3 py-2">
            {ANALYSIS_STEPS.map((step, i) => (
              <StepRow key={step} label={step} state={i < stepIndex ? "done" : i === stepIndex ? "active" : "pending"} />
            ))}
          </ul>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Repository Synthesis Complete
              </p>
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CHECKLIST.map((label) => (
                <StepRow key={label} label={label} state="done" />
              ))}
            </ul>

            <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80" role="tablist">
              {DEMO_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div key={activeTab} className="min-h-45 fade-in pt-2">
              <InsightPanelContent tabId={activeTab} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
