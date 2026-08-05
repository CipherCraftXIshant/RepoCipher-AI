import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function IconSparkle(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={props.className}>
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
      <path d="M19 15l.9 2.6L22.5 18.5l-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15z" opacity="0.7" />
    </svg>
  );
}

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconBranch(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="6" cy="5" r="2.2" />
      <circle cx="6" cy="19" r="2.2" />
      <circle cx="18" cy="12" r="2.2" />
      <path d="M6 7.2V16.8M6 9c0 4 4 3 8 3 2.2 0 3.6-1.3 4-3" />
    </svg>
  );
}

function IconFile(props) {
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
    deltaTone: "good",
    note: "vs. cloning and reading the code yourself.",
  },
  {
    label: "Setup required",
    value: "0 min",
    delta: "",
    deltaTone: "good",
    note: "No cloning, no local environment, just a URL.",
  },
  {
    label: "Coverage per repo",
    value: "Full tree",
    delta: "",
    deltaTone: "neutral",
    note: "Structure, README, and stack pulled in one pass.",
  },
  {
    label: "Output format",
    value: "1 doc",
    delta: "",
    deltaTone: "neutral",
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

const METRIC_DELTA_TONE = {
  good: "text-good",
  neutral: "text-text dark:text-text-dark",
};

export function LandingPage() {
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";

  return (
    <main className="max-w-240 mx-auto pt-8 px-6 pb-24">
      <nav className="flex items-center justify-between gap-4 mb-8">
        <span className="flex items-center gap-2.5 font-semibold text-lg text-heading dark:text-heading-dark">
          <span className="flex items-center justify-center w-8 h-8 rounded-[9px] bg-accent dark:bg-accent-dark text-white">
            <IconSparkle />
          </span>
          RepoCipher AI
        </span>
        <div className="flex items-center gap-5">
          {isAuthenticated ? (
            <Link
              to="/app"
              className="px-4 py-2 rounded-lg bg-accent-bg dark:bg-accent-bg-dark border border-accent-border dark:border-accent-border-dark text-heading dark:text-heading-dark no-underline"
            >
              Open app
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-heading dark:text-heading-dark no-underline">Log in</Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-accent-bg dark:bg-accent-bg-dark border border-accent-border dark:border-accent-border-dark text-heading dark:text-heading-dark no-underline"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="text-center pt-14 pb-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent-bg dark:bg-accent-bg-dark border border-accent-border dark:border-accent-border-dark text-accent dark:text-accent-dark text-[13px] font-semibold mb-5">
          <IconSparkle />
          AI-powered repo onboarding
        </span>
        <h1 className="font-medium text-heading dark:text-heading-dark tracking-[-1.68px] max-w-180 mx-auto my-5 lg:my-8 text-[32px] min-[721px]:text-[48px]">
          Understand any GitHub repository in minutes, not days.
        </h1>
        <p className="text-text dark:text-text-dark max-w-140 mx-auto mt-4 mb-8 text-lg">
          RepoCipher AI ingests a repo's structure and README, then hands it to Claude to write the
          onboarding doc you wish every project already had.
        </p>
        <Link
          to={isAuthenticated ? "/app" : "/signup"}
          className="inline-block px-7 py-3.5 rounded-[10px] bg-accent dark:bg-accent-dark border border-accent dark:border-accent-dark text-white no-underline text-base font-medium shadow-card dark:shadow-card-dark"
        >
          {isAuthenticated ? "Analyze a repo" : "Get started free"}
        </Link>
      </section>

      <section className="grid grid-cols-4 max-[720px]:grid-cols-2 max-[480px]:grid-cols-1 gap-4 pt-2 pb-10">
        {METRICS.map((m) => (
          <div className="p-5 border border-border dark:border-border-dark rounded-2xl bg-bg dark:bg-bg-dark shadow-card dark:shadow-card-dark" key={m.label}>
            <span className="block text-sm text-text dark:text-text-dark mb-2.5">{m.label}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[26px] font-semibold text-heading dark:text-heading-dark tracking-[-0.3px]">{m.value}</span>
              {m.delta && (
                <span className={`text-[13px] font-semibold ${METRIC_DELTA_TONE[m.deltaTone]}`}>{m.delta}</span>
              )}
            </div>
            <p className="flex items-start gap-1.5 mt-3.5 text-[13px] text-text dark:text-text-dark leading-[140%]">
              <IconSparkle className="shrink-0 mt-0.5 text-accent dark:text-accent-dark" />
              {m.note}
            </p>
          </div>
        ))}
      </section>

      <section className="border border-border dark:border-border-dark rounded-2xl shadow-card dark:shadow-card-dark p-6 mb-10">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="flex items-center gap-2 m-0 text-xl lg:text-2xl font-medium text-heading dark:text-heading-dark leading-[118%] tracking-[-0.24px]">
            <IconSparkle className="text-accent dark:text-accent-dark" />
            What Claude finds for you
          </h2>
          <span className="shrink-0 text-xs font-medium text-text dark:text-text-dark px-2.5 py-1 border border-border dark:border-border-dark rounded-full">
            Example output
          </span>
        </div>
        <ul className="list-none m-0 p-0 flex flex-col">
          {INSIGHTS.map(({ icon: Icon, text, tag }) => (
            <li
              key={text}
              className="flex items-center max-[720px]:items-start gap-3.5 py-4 border-t border-border dark:border-border-dark first:border-t-0"
            >
              <span className="shrink-0 w-9 h-9 rounded-full border border-border dark:border-border-dark flex items-center justify-center text-text dark:text-text-dark">
                <Icon />
              </span>
              <p className="flex-1 text-[15px] text-heading dark:text-heading-dark">{text}</p>
              <span className="shrink-0 max-[720px]:hidden text-[13px] font-medium px-3 py-1.5 rounded-full bg-accent-bg dark:bg-accent-bg-dark text-accent dark:text-accent-dark">
                {tag}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-8 border-t border-border dark:border-border-dark">
        <h2 className="text-center mb-8 text-xl lg:text-2xl font-medium text-heading dark:text-heading-dark leading-[118%] tracking-[-0.24px]">
          How it works
        </h2>
        <ol className="list-none p-0 m-0 grid grid-cols-3 max-[720px]:grid-cols-1 gap-6">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-3 items-start p-5 border border-border dark:border-border-dark rounded-2xl shadow-card dark:shadow-card-dark"
            >
              <span className="shrink-0 w-7 h-7 rounded-full bg-accent-bg dark:bg-accent-bg-dark border border-accent-border dark:border-accent-border-dark text-accent dark:text-accent-dark flex items-center justify-center text-sm font-semibold">
                {i + 1}
              </span>
              <div>
                <h3 className="m-0 mb-1 text-base text-left">{step.title}</h3>
                <p className="text-text dark:text-text-dark text-[15px]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="text-center py-14 px-6 mt-6 border border-border dark:border-border-dark rounded-[20px] bg-accent-bg dark:bg-accent-bg-dark">
        <h2 className="text-center text-xl lg:text-2xl font-medium text-heading dark:text-heading-dark leading-[118%] tracking-[-0.24px]">
          Stop reading code cold.
        </h2>
        <p className="text-text dark:text-text-dark mt-2 mb-6">
          Paste a repo, get an onboarding doc back before your coffee cools.
        </p>
        <Link
          to={isAuthenticated ? "/app" : "/signup"}
          className="inline-block px-7 py-3.5 rounded-[10px] bg-accent dark:bg-accent-dark border border-accent dark:border-accent-dark text-white no-underline text-base font-medium shadow-card dark:shadow-card-dark"
        >
          {isAuthenticated ? "Analyze a repo" : "Get started free"}
        </Link>
      </section>
    </main>
  );
}
