import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../lib/hooks";
import { IconCheck, IconGithub } from "../ui/Icons";
import { ANALYSIS_STEPS, DEFAULT_DEMO_REPO, INSIGHT_TABS } from "./data";
import { InsightPanelContent } from "./InsightPanelContent";

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
    <li className="flex items-center gap-2.5 text-[13px]">
      <span
        className={`flex items-center justify-center w-4 h-4 rounded-full shrink-0 border ${
          state === "done"
            ? "bg-good/20 border-good text-good"
            : state === "active"
              ? "border-accent-dark text-accent-dark"
              : "border-white/15 text-transparent"
        }`}
      >
        {state === "done" && <IconCheck width={10} height={10} />}
        {state === "active" && <span className="w-1.5 h-1.5 rounded-full bg-accent-dark animate-pulse" />}
      </span>
      <span className={state === "pending" ? "text-text-dark/50" : "text-text-dark"}>{label}</span>
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
      className="rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_20px_60px_-24px_rgb(0_0_0/0.6)] overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.015]">
        <span className="text-[13px] font-medium text-heading-dark">RepoCipher AI</span>
        <span className="flex items-center gap-1.5 text-xs text-good font-medium">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-good opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-good" />
          </span>
          Live
        </span>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex items-center gap-2 text-sm text-text-dark mb-5">
          <IconGithub width={15} height={15} />
          <span className="font-mono">github.com/{repoLabel}</span>
        </div>

        {phase === "analyzing" ? (
          <ul className="flex flex-col gap-3 py-2">
            {ANALYSIS_STEPS.map((step, i) => (
              <StepRow key={step} label={step} state={i < stepIndex ? "done" : i === stepIndex ? "active" : "pending"} />
            ))}
          </ul>
        ) : (
          <>
            <p className="text-sm font-medium text-heading-dark mb-4">Repository understood.</p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mb-6">
              {CHECKLIST.map((label) => (
                <StepRow key={label} label={label} state="done" />
              ))}
            </ul>

            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 mb-5" role="tablist">
              {DEMO_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-accent-dark text-[#0b0710]"
                      : "text-text-dark hover:text-heading-dark hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div key={activeTab} className="min-h-45 fade-in">
              <InsightPanelContent tabId={activeTab} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
