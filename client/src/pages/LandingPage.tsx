import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function IconSparkle(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={props.className}>
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
      <path d="M19 15l.9 2.6L22.5 18.5l-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15z" opacity="0.7" />
    </svg>
  );
}

function IconClock(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconBranch(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="6" cy="5" r="2.2" />
      <circle cx="6" cy="19" r="2.2" />
      <circle cx="18" cy="12" r="2.2" />
      <path d="M6 7.2V16.8M6 9c0 4 4 3 8 3 2.2 0 3.6-1.3 4-3" />
    </svg>
  );
}

function IconFile(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}

const STEPS = [
  {
    title: "Paste a GitHub URL",
    body: "Drop in any public repository — owner/repo or a full github.com link.",
  },
  {
    title: "We ingest the repo",
    body: "The file tree and README are pulled straight from GitHub, no cloning required.",
  },
  {
    title: "Claude reads it for you",
    body: "An onboarding summary covering what it does, the stack, the architecture, and where to start reading.",
  },
];

const METRICS = [
  {
    label: "Time to first read",
    value: "~90 sec",
    delta: "↓ 95%",
    deltaTone: "good" as const,
    note: "vs. cloning and reading the code yourself.",
  },
  {
    label: "Setup required",
    value: "0 min",
    delta: "",
    deltaTone: "good" as const,
    note: "No cloning, no local environment, just a URL.",
  },
  {
    label: "Coverage per repo",
    value: "Full tree",
    delta: "",
    deltaTone: "neutral" as const,
    note: "Structure, README, and stack pulled in one pass.",
  },
  {
    label: "Output format",
    value: "1 doc",
    delta: "",
    deltaTone: "neutral" as const,
    note: "Architecture, stack, and where to start reading.",
  },
];

const INSIGHTS = [
  {
    icon: IconBranch,
    text: "Detects the stack automatically — frameworks, languages, and how the pieces connect.",
    tag: "Stack detection",
  },
  {
    icon: IconFile,
    text: "No README? Claude infers structure and purpose from the file tree alone.",
    tag: "Handled",
  },
  {
    icon: IconClock,
    text: "Skips the hour of clicking through folders just to find where the app boots.",
    tag: "Entry points",
  },
];

export function LandingPage() {
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";

  return (
    <main className="landing">
      <nav className="topnav">
        <span className="brand">
          <span className="brand-badge">
            <IconSparkle />
          </span>
          RepoCipher AI
        </span>
        <div className="topnav-right">
          {isAuthenticated ? (
            <Link to="/app" className="cta-link">Open app</Link>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup" className="cta-link">Sign up</Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <span className="eyebrow">
          <IconSparkle />
          AI-powered repo onboarding
        </span>
        <h1>Understand any GitHub repository in minutes, not days.</h1>
        <p className="subtitle">
          RepoCipher AI ingests a repo's structure and README, then hands it to Claude to write the
          onboarding doc you wish every project already had.
        </p>
        <Link to={isAuthenticated ? "/app" : "/signup"} className="cta-button">
          {isAuthenticated ? "Analyze a repo" : "Get started free"}
        </Link>
      </section>

      <section className="metrics-grid">
        {METRICS.map((m) => (
          <div className="metric-card" key={m.label}>
            <span className="metric-label">{m.label}</span>
            <div className="metric-value-row">
              <span className="metric-value">{m.value}</span>
              {m.delta && (
                <span className={`metric-delta metric-delta-${m.deltaTone}`}>{m.delta}</span>
              )}
            </div>
            <p className="metric-note">
              <IconSparkle className="metric-note-icon" />
              {m.note}
            </p>
          </div>
        ))}
      </section>

      <section className="insights-panel">
        <div className="insights-header">
          <h2>
            <IconSparkle className="insights-header-icon" />
            What Claude finds for you
          </h2>
          <span className="insights-example-tag">Example output</span>
        </div>
        <ul className="insights-list">
          {INSIGHTS.map(({ icon: Icon, text, tag }) => (
            <li key={text} className="insights-row">
              <span className="insights-icon">
                <Icon />
              </span>
              <p className="insights-text">{text}</p>
              <span className="insights-tag">{tag}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="how-it-works">
        <h2>How it works</h2>
        <ol className="steps-explainer">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <span className="step-number">{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="final-cta">
        <h2>Stop reading code cold.</h2>
        <p>Paste a repo, get an onboarding doc back before your coffee cools.</p>
        <Link to={isAuthenticated ? "/app" : "/signup"} className="cta-button">
          {isAuthenticated ? "Analyze a repo" : "Get started free"}
        </Link>
      </section>
    </main>
  );
}
