import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, createAnalysis, getAnalysis } from "../api";
import { useAuth } from "../auth/AuthContext";
import { AnalysisTabs } from "../components/dashboard/AnalysisTabs";
import { subscribeToJob } from "../socket";

const STEPS = ["pending", "fetching", "analyzing", "completed"];

const STEP_LABEL = {
  pending: "Queued",
  fetching: "Fetching repository",
  analyzing: "Analyzing with Gemini",
  completed: "Completed",
  failed: "Failed",
};

const STEP_TEXT_CLASS = {
  done: "text-heading dark:text-heading-dark",
  active: "text-heading dark:text-heading-dark font-medium",
  failed: "text-text dark:text-text-dark",
  upcoming: "text-text dark:text-text-dark",
};

const STEP_DOT_CLASS = {
  done: "bg-accent dark:bg-accent-dark border-accent dark:border-accent-dark",
  active: "border-accent dark:border-accent-dark shadow-focus dark:shadow-focus-dark",
  failed: "bg-danger border-danger",
  upcoming: "",
};

function ProgressSteps({ status }) {
  const activeIndex = status === "failed" ? STEPS.length : STEPS.indexOf(status);

  return (
    <ol className="list-none mt-8 p-0 flex flex-col gap-3">
      {STEPS.map((step, i) => {
        const state = status === "failed" && i === activeIndex - 1
          ? "failed"
          : i < activeIndex ? "done" : i === activeIndex ? "active" : "upcoming";
        return (
          <li key={step} className={`flex items-center gap-2.5 ${STEP_TEXT_CLASS[state]}`}>
            <span
              className={`w-2.5 h-2.5 rounded-full border-2 border-border dark:border-border-dark shrink-0 ${STEP_DOT_CLASS[state]}`}
              aria-hidden="true"
            />
            {STEP_LABEL[step]}
          </li>
        );
      })}
    </ol>
  );
}

export function AnalyzerPage() {
  const { user, logout, withAuth } = useAuth();
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    let cancelled = false;

    const refresh = async () => {
      try {
        const latest = await withAuth((token) => getAnalysis(token, jobId));
        if (!cancelled) setJob(latest);
      } catch {
        // transient fetch error; the next progress event will retry
      }
    };

    void refresh();

    const unsubscribe = subscribeToJob(jobId, (event) => {
      if (event.status === "completed" || event.status === "failed") {
        void refresh();
      } else {
        setJob((prev) => (prev ? { ...prev, status: event.status } : prev));
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [jobId, withAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim() || submitting) return;

    setSubmitting(true);
    setFormError(null);
    setJob(null);
    setJobId(null);

    try {
      const result = await withAuth((token) => createAnalysis(token, url.trim()));
      setJobId(result.jobId);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setJobId(null);
    setJob(null);
    setFormError(null);
    setUrl("");
  };

  return (
    <main className="max-w-180 mx-auto pt-12 px-6 pb-20 text-left">
      <nav className="flex items-center justify-between gap-4 mb-8">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-lg text-heading dark:text-heading-dark no-underline">
          RepoCipher AI
        </Link>
        <div className="flex items-center gap-5">
          <Link to="/profile" className="text-heading dark:text-heading-dark no-underline">
            {user?.displayName ?? user?.email}
          </Link>
          <button
            type="button"
            className="[font:inherit] text-base px-5 py-3 rounded-lg border border-border dark:border-border-dark bg-transparent text-heading dark:text-heading-dark cursor-pointer whitespace-nowrap"
            onClick={() => void logout()}
          >
            Log out
          </button>
        </div>
      </nav>

      {!jobId && (
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="github.com/owner/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={submitting}
            autoFocus
            className="flex-1 [font:inherit] text-base px-4 py-3 rounded-lg border border-border dark:border-border-dark bg-bg dark:bg-bg-dark text-heading dark:text-heading-dark focus:outline-none focus:border-accent-border dark:focus:border-accent-border-dark"
          />
          <button
            type="submit"
            disabled={submitting || !url.trim()}
            className="[font:inherit] text-base px-5 py-3 rounded-lg border border-accent-border dark:border-accent-border-dark bg-accent-bg dark:bg-accent-bg-dark text-heading dark:text-heading-dark cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-default"
          >
            {submitting ? "Starting…" : "Analyze"}
          </button>
        </form>
      )}
      {formError && <p className="text-danger mt-4">{formError}</p>}

      {jobId && job && (
        <section className="mt-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-left wrap-break-word text-xl lg:text-2xl font-medium text-heading dark:text-heading-dark leading-[118%] tracking-[-0.24px] mb-2">
                {job.repository.fullName}
              </h2>
              {job.repository.description && (
                <p className="text-text dark:text-text-dark mt-1">{job.repository.description}</p>
              )}
            </div>
            <button
              type="button"
              className="[font:inherit] text-base px-5 py-3 rounded-lg border border-border dark:border-border-dark bg-transparent text-heading dark:text-heading-dark cursor-pointer whitespace-nowrap"
              onClick={reset}
            >
              Analyze another
            </button>
          </div>

          {job.status !== "completed" && job.status !== "failed" && <ProgressSteps status={job.status} />}

          {job.status === "failed" && (
            <p className="text-danger mt-4">Analysis failed: {job.error ?? "Unknown error"}</p>
          )}

          {job.status === "completed" && job.analysis && <AnalysisTabs analysis={job.analysis} />}
        </section>
      )}
    </main>
  );
}
