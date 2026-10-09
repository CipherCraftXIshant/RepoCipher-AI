import React from "react";
import { ARCHITECTURE_NODES } from "./data";

const NODE_POSITIONS = {
  client: { top: 12, left: 50 },
  api: { top: 35, left: 50 },
  serviceA: { top: 62, left: 28 },
  serviceB: { top: 62, left: 72 },
  database: { top: 88, left: 50 },
};

const PATHS = [
  "M50,16 L50,30",
  "M50,40 L50,49 L28,49 L28,56",
  "M50,40 L50,49 L72,49 L72,56",
  "M28,68 L28,76 L50,76 L50,83",
  "M72,68 L72,76 L50,76 L50,83",
];

function Node({ id }) {
  const { label, icon: Icon } = ARCHITECTURE_NODES[id];
  const pos = NODE_POSITIONS[id];
  return (
    <div
      className="absolute flex items-center gap-3 -translate-x-1/2 -translate-y-1/2 px-4 py-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 hover:scale-105 hover:border-primary-500 transition-all duration-200 group cursor-pointer"
      style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
    >
      <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
        <Icon width={18} height={18} />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
          {label}
        </span>
        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Service
        </span>
      </div>
    </div>
  );
}

/** A branching request-flow diagram with animated connector lines and ambient glows. */
export function ArchitectureShowcase() {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-[420px] rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-sm p-6 overflow-hidden">
      {/* Background dot grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" />

      {/* SVG Animated Flow Paths */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {PATHS.map((d) => (
          <g key={d}>
            {/* Background static line */}
            <path
              d={d}
              fill="none"
              stroke="rgba(99, 102, 241, 0.15)"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
            {/* Animated dashed line */}
            <path
              d={d}
              fill="none"
              stroke="rgb(99 102 241)"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
              className="flow-line"
            />
          </g>
        ))}
      </svg>

      {/* Architecture Service Nodes */}
      {Object.keys(ARCHITECTURE_NODES).map((id) => (
        <Node key={id} id={id} />
      ))}
    </div>
  );
}
