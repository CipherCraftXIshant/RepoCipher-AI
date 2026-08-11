import ReactMarkdown from "react-markdown";
import { MARKDOWN_COMPONENTS } from "../../lib/markdown";
import { IconFile } from "../ui/Icons";

function EmptyState({ label }) {
  return <p className="text-sm text-text dark:text-text-dark">No {label} found for this repository.</p>;
}

export function AnalysisPanelContent({ tabId, analysis }) {
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
            <div>
              <code className="text-[13px] text-accent dark:text-accent-dark font-mono">{dir.path}</code>
              <p className="text-[13px] text-text dark:text-text-dark mt-1">{dir.note}</p>
            </div>
          </li>
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
