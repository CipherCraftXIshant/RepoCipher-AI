import { ARCHITECTURE_NODES } from "./data";

const NODE_POSITIONS = {
  client: { top: 8, left: 50 },
  api: { top: 33, left: 50 },
  serviceA: { top: 60, left: 26 },
  serviceB: { top: 60, left: 74 },
  database: { top: 88, left: 50 },
};

const PATHS = [
  "M50,13 L50,29",
  "M50,37 L50,47 L26,47 L26,55",
  "M50,37 L50,47 L74,47 L74,55",
  "M26,65 L26,73 L50,73 L50,83",
  "M74,65 L74,73 L50,73 L50,83",
];

function Node({ id }) {
  const { label, icon: Icon } = ARCHITECTURE_NODES[id];
  const pos = NODE_POSITIONS[id];
  return (
    <div
      className="absolute flex flex-col items-center gap-1.5 -translate-x-1/2 -translate-y-1/2 px-4 py-3 rounded-xl border border-white/10 bg-bg-dark/90 backdrop-blur text-center shadow-[0_8px_24px_-12px_rgb(0_0_0/0.6)]"
      style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
    >
      <Icon width={18} height={18} className="text-accent-dark" />
      <span className="text-[13px] font-medium text-heading-dark whitespace-nowrap">{label}</span>
    </div>
  );
}

/** A branching request-flow diagram with subtly animated connector lines. */
export function ArchitectureShowcase() {
  return (
    <div className="relative w-full max-w-160 mx-auto h-90 sm:h-100">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {PATHS.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="rgb(192 132 252 / 0.45)"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeDasharray="2.2 2.2"
            vectorEffect="non-scaling-stroke"
            className="flow-line"
          />
        ))}
      </svg>

      {Object.keys(ARCHITECTURE_NODES).map((id) => (
        <Node key={id} id={id} />
      ))}
    </div>
  );
}
