import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { MARKDOWN_COMPONENTS } from "../../lib/markdown";
import { IconChevronDown, IconFile, IconLoader } from "../ui/Icons";

function EmptyState({ label }) {
  return <p className="text-sm text-text dark:text-text-dark">No {label} found for this repository.</p>;
}

const SEVERITY_CLASS = {
  risk: "border-l-danger",
  warning: "border-l-[#d4a017] dark:border-l-[#e0b32e]",
  info: "border-l-accent dark:border-l-accent-dark",
};

const LANGUAGE_BAR_OPACITY = [1, 0.85, 0.7, 0.55, 0.45, 0.35];

function InterviewQuestionCard({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="rounded-lg border border-border dark:border-border-dark bg-accent-bg dark:bg-accent-bg-dark overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-3 w-full p-3 text-left cursor-pointer [font:inherit]"
      >
        <div>
          <span className="text-[11px] uppercase tracking-wide text-accent dark:text-accent-dark">{item.category}</span>
          <p className="text-sm font-medium text-heading dark:text-heading-dark mt-0.5">{item.question}</p>
        </div>
        <IconChevronDown
          width={16}
          height={16}
          className={`shrink-0 text-text dark:text-text-dark transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="text-[13px] text-text dark:text-text-dark leading-relaxed px-3 pb-3">{item.answer}</p>
      )}
    </li>
  );
}

export function AnalysisPanelContent({
  tabId,
  analysis,
  languages,
  interviewQuestions,
  onGenerateInterview,
  generatingInterview,
}) {
  if (!analysis) return <EmptyState label="analysis" />;

  if (tabId === "stack") {
    if (!analysis.stack?.length) return <EmptyState label="stack" />;
    return (
      <div className="flex flex-wrap gap-2.5">
        {analysis.stack.map((item) => (
          <span
            key={item.name}
            className="px-3.5 py-2 rounded-lg border border-border dark:border-border-dark bg-accent-bg dark:bg-accent-bg-dark text-sm text-heading dark:text-heading-dark"
          >
            {item.name}
            <span className="block text-[11px] text-text dark:text-text-dark mt-0.5">{item.role}</span>
          </span>
        ))}
      </div>
    );
  }

  if (tabId === "architecture") {
    if (!analysis.architecture?.length) return <EmptyState label="architecture" />;
    return (
      <div className="flex flex-col gap-3">
        {analysis.architecture.map((node, i) => (
          <div key={node.label} className="flex gap-3 items-start">
            <div className="flex flex-col items-center shrink-0">
              <span className="px-3.5 py-2 rounded-lg border border-border dark:border-border-dark bg-accent-bg dark:bg-accent-bg-dark text-heading dark:text-heading-dark text-sm font-medium whitespace-nowrap">
                {node.label}
              </span>
              {i < analysis.architecture.length - 1 && (
                <span className="text-accent dark:text-accent-dark my-1" aria-hidden="true">↓</span>
              )}
            </div>
            <p className="text-[13px] text-text dark:text-text-dark leading-relaxed mt-2">{node.description}</p>
          </div>
        ))}
      </div>
    );
  }

  if (tabId === "entry-points") {
    if (!analysis.entryPoints?.length) return <EmptyState label="entry points" />;
    return (
      <ul className="flex flex-col gap-2">
        {analysis.entryPoints.map((entry) => (
          <li
            key={entry.path}
            className="p-3 rounded-lg border border-border dark:border-border-dark bg-accent-bg dark:bg-accent-bg-dark"
          >
            <code className="text-[13px] text-accent dark:text-accent-dark font-mono">{entry.path}</code>
            <p className="text-[13px] text-text dark:text-text-dark mt-1">{entry.note}</p>
          </li>
        ))}
      </ul>
    );
  }

  if (tabId === "dependencies") {
    if (!analysis.dependencies?.length) return <EmptyState label="dependencies" />;
    return (
      <ul className="flex flex-col divide-y divide-border dark:divide-border-dark">
        {analysis.dependencies.map((dep) => (
          <li key={dep.name} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            <span className="font-mono text-heading dark:text-heading-dark">{dep.name}</span>
            <span className="text-text dark:text-text-dark text-[13px]">{dep.role}</span>
            {dep.version && (
              <span className="text-text/70 dark:text-text-dark/70 text-[13px] font-mono shrink-0">{dep.version}</span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (tabId === "directories") {
    if (!analysis.directories?.length) return <EmptyState label="key directories" />;
    return (
      <ul className="flex flex-col gap-2">
        {analysis.directories.map((dir) => (
          <li
            key={dir.path}
            className="flex items-start gap-2.5 p-3 rounded-lg border border-border dark:border-border-dark bg-accent-bg dark:bg-accent-bg-dark"
          >
            <IconFile width={14} height={14} className="shrink-0 mt-0.5 text-accent dark:text-accent-dark" />
            <div className="min-w-0 flex-1">
              <code className="text-[13px] text-accent dark:text-accent-dark font-mono">{dir.path}</code>
              <p className="text-[13px] text-text dark:text-text-dark mt-1">{dir.note}</p>
              {dir.files?.length > 0 && (
                <ul className="flex flex-col gap-1.5 mt-2.5 pl-3 border-l border-border dark:border-border-dark">
                  {dir.files.map((file) => (
                    <li key={file.path}>
                      <code className="text-[12px] text-heading dark:text-heading-dark font-mono">{file.path}</code>
                      <p className="text-[12px] text-text dark:text-text-dark mt-0.5">{file.note}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (tabId === "risks") {
    if (!analysis.risks?.length) {
      return <p className="text-sm text-text dark:text-text-dark">No notable code-quality or risk observations — nothing stood out.</p>;
    }
    return (
      <ul className="flex flex-col gap-2.5">
        {analysis.risks.map((risk) => (
          <li
            key={risk.title}
            className={`p-3 pl-4 rounded-lg border border-border dark:border-border-dark border-l-2 bg-accent-bg dark:bg-accent-bg-dark ${SEVERITY_CLASS[risk.severity] ?? SEVERITY_CLASS.info}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-heading dark:text-heading-dark">{risk.title}</span>
              <span className="text-[11px] uppercase tracking-wide text-text dark:text-text-dark shrink-0">{risk.severity}</span>
            </div>
            <p className="text-[13px] text-text dark:text-text-dark mt-1">{risk.description}</p>
          </li>
        ))}
      </ul>
    );
  }

  if (tabId === "languages") {
    const entries = languages && Object.keys(languages).length
      ? Object.entries(languages).sort((a, b) => b[1] - a[1])
      : [];
    if (!entries.length) return <EmptyState label="language" />;

    const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
    return (
      <div className="flex flex-col gap-3.5">
        {entries.map(([name, bytes], i) => {
          const pct = total ? (bytes / total) * 100 : 0;
          return (
            <div key={name}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm font-medium text-heading dark:text-heading-dark">{name}</span>
                <span className="text-[13px] text-text dark:text-text-dark tabular-nums">{pct.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-accent-bg dark:bg-accent-bg-dark overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent dark:bg-accent-dark"
                  style={{ width: `${Math.max(pct, 1)}%`, opacity: LANGUAGE_BAR_OPACITY[i] ?? 0.3 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (tabId === "interview") {
    if (generatingInterview) {
      return (
        <div className="flex items-center gap-2 text-sm text-text dark:text-text-dark">
          <IconLoader width={16} height={16} />
          Generating interview questions…
        </div>
      );
    }
    if (!interviewQuestions?.length) {
      return (
        <div>
          <p className="text-sm text-text dark:text-text-dark mb-4">
            Generate realistic interview questions — with model answers — grounded in this repository's actual stack and architecture.
          </p>
          <button
            type="button"
            onClick={onGenerateInterview}
            className="[font:inherit] text-sm px-4 py-2.5 rounded-lg border border-accent-border dark:border-accent-border-dark bg-accent-bg dark:bg-accent-bg-dark text-heading dark:text-heading-dark cursor-pointer"
          >
            Generate Interview Questions
          </button>
        </div>
      );
    }
    return (
      <ul className="flex flex-col gap-2">
        {interviewQuestions.map((item) => (
          <InterviewQuestionCard key={item.question} item={item} />
        ))}
      </ul>
    );
  }

  if (tabId === "setup") {
    if (!analysis.setup) return <EmptyState label="setup instructions" />;
    return (
      <article className="leading-[155%]">
        <ReactMarkdown components={MARKDOWN_COMPONENTS}>{analysis.setup}</ReactMarkdown>
      </article>
    );
  }

  if (!analysis.overview) return <EmptyState label="summary" />;
  return (
    <article className="leading-[155%]">
      <ReactMarkdown components={MARKDOWN_COMPONENTS}>{analysis.overview}</ReactMarkdown>
    </article>
  );
}
