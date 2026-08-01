import { useEffect, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { ApiError, createAnalysis, getAnalysis } from "./api";
import { subscribeToJob } from "./socket";
import type { AnalysisJobWithRepository, AnalysisStatus } from "./types";
import "./App.css";

const STEPS: AnalysisStatus[] = ["pending", "fetching", "analyzing", "completed"];

const STEP_LABEL: Record<AnalysisStatus, string> = {
  pending: "Queued",
  fetching: "Fetching repository",
  analyzing: "Analyzing with Claude",
  completed: "Completed",
  failed: "Failed",
};

function ProgressSteps({ status }: { status: AnalysisStatus }) {
  const activeIndex = status === "failed" ? STEPS.length : STEPS.indexOf(status);

  return (
    <ol className="steps">
      {STEPS.map((step, i) => {
        const state = status === "failed" && i === activeIndex - 1
          ? "failed"
          : i < activeIndex ? "done" : i === activeIndex ? "active" : "upcoming";
        return (
          <li key={step} className={`step step-${state}`}>
            <span className="step-dot" aria-hidden="true" />
            {STEP_LABEL[step]}
          </li>
        );
      })}
    </ol>
  );
}

function App() {
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<AnalysisJobWithRepository | null>(null);

  useEffect(() => {
    if (!jobId) return;

    let cancelled = false;

    const refresh = async () => {
      try {
        const latest = await getAnalysis(jobId);
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
  }, [jobId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim() || submitting) return;

    setSubmitting(true);
    setFormError(null);
    setJob(null);
    setJobId(null);

    try {
      const result = await createAnalysis(url.trim());
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
    <main className="page">
      <header className="header">
        <h1>RepoCipher AI</h1>
        <p className="subtitle">Understand any GitHub repository in minutes, not days.</p>
      </header>

      {!jobId && (
        <form className="submit-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="github.com/owner/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={submitting}
            autoFocus
          />
          <button type="submit" disabled={submitting || !url.trim()}>
            {submitting ? "Starting…" : "Analyze"}
          </button>
        </form>
      )}
      {formError && <p className="error-text">{formError}</p>}

      {jobId && job && (
        <section className="result">
          <div className="result-header">
            <div>
              <h2>{job.repository.fullName}</h2>
              {job.repository.description && <p className="repo-desc">{job.repository.description}</p>}
            </div>
            <button type="button" className="secondary" onClick={reset}>
              Analyze another
            </button>
          </div>

          {job.status !== "completed" && job.status !== "failed" && <ProgressSteps status={job.status} />}

          {job.status === "failed" && (
            <p className="error-text">Analysis failed: {job.error ?? "Unknown error"}</p>
          )}

          {job.status === "completed" && job.summary && (
            <article className="summary">
              <ReactMarkdown>{job.summary}</ReactMarkdown>
            </article>
          )}
        </section>
      )}
    </main>
  );
}

export default App;
