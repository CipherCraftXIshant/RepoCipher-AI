import { AI_SUMMARY_PARAGRAPHS, ARCHITECTURE_FLOW, DEPENDENCIES, ENTRY_POINTS, STACK_BADGES } from "./data";

/**
 * Renders the demo content for a single insight tab id. Shared by the hero
 * AnalysisDemo card and the "What RepoCipher finds" dashboard section so the
 * two interactive surfaces stay in sync without duplicating markup.
 */
export function InsightPanelContent({ tabId }) {
  if (tabId === "stack") {
    return (
      <div className="flex flex-wrap gap-2.5">
        {STACK_BADGES.map((item) => (
          <span key={item.name} className="px-3.5 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-heading-dark">
            {item.name}
            <span className="block text-[11px] text-text-dark/70 mt-0.5">{item.role}</span>
          </span>
        ))}
      </div>
    );
  }

  if (tabId === "architecture") {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {ARCHITECTURE_FLOW.map((node, i) => (
          <span key={node} className="flex items-center gap-2">
            <span className="px-3.5 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-heading-dark">{node}</span>
            {i < ARCHITECTURE_FLOW.length - 1 && <span className="text-accent-dark">→</span>}
          </span>
        ))}
      </div>
    );
  }

  if (tabId === "entry-points") {
    return (
      <ul className="flex flex-col gap-2">
        {ENTRY_POINTS.map((entry) => (
          <li
            key={entry.path}
            className="p-3 rounded-lg border border-white/10 bg-white/[0.03] hover:border-accent-dark/50 hover:bg-white/[0.05] transition-colors duration-150"
          >
            <code className="text-[13px] text-accent-dark font-mono">{entry.path}</code>
            <p className="text-[13px] text-text-dark mt-1">{entry.note}</p>
          </li>
        ))}
      </ul>
    );
  }

  if (tabId === "dependencies") {
    return (
      <ul className="flex flex-col divide-y divide-white/10">
        {DEPENDENCIES.map((dep) => (
          <li key={dep.name} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            <span className="font-mono text-heading-dark">{dep.name}</span>
            <span className="text-text-dark text-[13px]">{dep.role}</span>
            <span className="text-text-dark/60 text-[13px] font-mono shrink-0">{dep.version}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {AI_SUMMARY_PARAGRAPHS.map((p) => (
        <p key={p.slice(0, 24)} className="text-[15px] leading-relaxed text-text-dark">
          {p}
        </p>
      ))}
    </div>
  );
}
