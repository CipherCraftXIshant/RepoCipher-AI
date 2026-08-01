import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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

export function LandingPage() {
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";

  return (
    <main className="landing">
      <nav className="topnav">
        <span className="brand">RepoCipher AI</span>
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
        <h1>Understand any GitHub repository in minutes, not days.</h1>
        <p className="subtitle">
          RepoCipher AI ingests a repo's structure and README, then hands it to Claude to write the
          onboarding doc you wish every project already had.
        </p>
        <Link to={isAuthenticated ? "/app" : "/signup"} className="cta-button">
          {isAuthenticated ? "Analyze a repo" : "Get started free"}
        </Link>
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
    </main>
  );
}
