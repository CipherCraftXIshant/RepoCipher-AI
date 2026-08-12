function base(props, extra = {}) {
  return { width: 18, height: 18, viewBox: "0 0 24 24", className: props.className, ...extra };
}

export function IconSparkle(props) {
  return (
    <svg {...base(props, { width: 16, height: 16, fill: "currentColor" })}>
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
      <path d="M19 15l.9 2.6L22.5 18.5l-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15z" opacity="0.7" />
    </svg>
  );
}

export function IconClock(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconBranch(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <circle cx="6" cy="5" r="2.2" />
      <circle cx="6" cy="19" r="2.2" />
      <circle cx="18" cy="12" r="2.2" />
      <path d="M6 7.2V16.8M6 9c0 4 4 3 8 3 2.2 0 3.6-1.3 4-3" />
    </svg>
  );
}

export function IconFile(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}

export function IconFolder(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M4 6.5a1 1 0 0 1 1-1h4l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function IconGithub(props) {
  return (
    <svg {...base(props, { fill: "currentColor" })}>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.5-1.11-1.5-.9-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.56 1.42.21 2.47.1 2.73.65.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.79-4.58 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .28.18.61.69.5A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

export function IconArrowRight(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconCheck(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function IconChevronDown(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconMenu(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" })}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" })}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconTerminal(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13 15h4" />
    </svg>
  );
}

export function IconDatabase(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5V18c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5V5.5" />
      <path d="M5 12c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5" />
    </svg>
  );
}

export function IconServer(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  );
}

export function IconLayers(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  );
}

export function IconMessage(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M4 5h16v11H8l-4 4V5z" />
    </svg>
  );
}

export function IconBox(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8M12 13v8" />
    </svg>
  );
}

export function IconLoader(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" })} className={`animate-spin ${props.className ?? ""}`}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

export function IconStar(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M12 3.5l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.6 1-5.75-4.2-4.1 5.8-.85z" />
    </svg>
  );
}

export function IconUsers(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 4.3a3 3 0 0 1 0 5.8" />
      <path d="M21 20c0-2.8-1.9-5.1-4.5-5.8" />
    </svg>
  );
}

export function IconChart(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M4 20V10M11 20V4M18 20v-7" />
    </svg>
  );
}

export function IconQuestion(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2a2.5 2.5 0 1 1 3.7 2.2c-.8.5-1.2 1-1.2 1.9" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function IconSettings(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.9a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V20a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09A1.7 1.7 0 0 0 11 2.6V2.5a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55h.09a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.01z" />
    </svg>
  );
}

export function IconMore(props) {
  return (
    <svg {...base(props, { fill: "currentColor" })}>
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}

export function IconTrash(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M4 7h16M9 7V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V7M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconRefresh(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 4v5h-5" />
    </svg>
  );
}

export function IconSearch(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function IconAlert(props) {
  return (
    <svg {...base(props, { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.86l-8.2 14.2A1.5 1.5 0 0 0 3.4 20.4h17.2a1.5 1.5 0 0 0 1.3-2.34l-8.2-14.2a1.5 1.5 0 0 0-2.4 0z" />
    </svg>
  );
}
