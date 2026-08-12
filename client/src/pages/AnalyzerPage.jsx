import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ApiError, createAnalysis, generateInterviewQuestions, getAnalysis, touchAnalysisViewed } from "../api";
import { useAuth } from "../auth/AuthContext";
import { AnalysisTabs } from "../components/dashboard/AnalysisTabs";
import { ChatWidget } from "../components/chat/ChatWidget";
import { IconAlert, IconBranch, IconClock, IconStar, IconUsers } from "../components/ui/Icons";
import { timeAgo } from "../lib/format";
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

function StatPill({ icon: Icon, children }) {
  if (children === null || children === undefined) return null;
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border dark:border-border-dark text-[13px] text-text dark:text-text-dark">
      <Icon width={14} height={14} className="shrink-0 text-accent dark:text-accent-dark" />
      {children}
    </span>
  );
}

function RepoStatsStrip({ repository }) {
  if (!repository) return null;
  const { stars, forks, openIssues, license, pushedAt, contributorsCount } = repository;
  const hasAny = [stars, forks, openIssues, license, pushedAt, contributorsCount].some(
    (v) => v !== null && v !== undefined,
  );
  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <StatPill icon={IconStar}>{stars !== null && stars !== undefined ? `${stars} stars` : null}</StatPill>
      <StatPill icon={IconBranch}>{forks !== null && forks !== undefined ? `${forks} forks` : null}</StatPill>
      <StatPill icon={IconAlert}>{openIssues !== null && openIssues !== undefined ? `${openIssues} open issues` : null}</StatPill>
      <StatPill icon={IconUsers}>{contributorsCount !== null && contributorsCount !== undefined ? `${contributorsCount} contributors` : null}</StatPill>
      <StatPill icon={IconClock}>{pushedAt ? `Last commit ${timeAgo(pushedAt)}` : null}</StatPill>
      {license && (
        <span className="flex items-center px-3 py-1.5 rounded-lg border border-border dark:border-border-dark text-[13px] text-text dark:text-text-dark">
          {license}
        </span>
      )}
    </div>
  );
}

export function AnalyzerPage() {
  const { user, logout, withAuth } = useAuth();
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [jobId, setJobId] = useState(() => searchParams.get("job"));
  const [job, setJob] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState(null);
  const [generatingInterview, setGeneratingInterview] = useState(false);
  const viewTimerRef = useRef(null);

  const handleTabChange = (tab) => {
    if (!jobId) return;
    if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
    viewTimerRef.current = setTimeout(() => {
      void withAuth((token) => touchAnalysisViewed(token, jobId, tab));
    }, 800);
  };

  const handleGenerateInterview = async () => {
    if (!jobId || generatingInterview) return;
    setGeneratingInterview(true);
    try {
      const result = await withAuth((token) => generateInterviewQuestions(token, jobId));
      setInterviewQuestions(result.questions);
    } catch {
      // leave the generate button in place so the user can retry
    } finally {
      setGeneratingInterview(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    let cancelled = false;

    const refresh = async () => {
      try {
        const latest = await withAuth((token) => getAnalysis(token, jobId));
        if (!cancelled) {
          setJob(latest);
          setInterviewQuestions(latest.interviewQuestions ?? null);
        }
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
          <Link to="/dashboard" className="text-heading dark:text-heading-dark no-underline">
            Dashboard
          </Link>
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
              {job.status === "completed" && <RepoStatsStrip repository={job.repository} />}
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

          {job.status === "completed" && job.analysis && (
            <AnalysisTabs
              analysis={job.analysis}
              languages={job.repository.languages}
              initialTab={job.lastViewedTab}
              onTabChange={handleTabChange}
              interviewQuestions={interviewQuestions}
              onGenerateInterview={handleGenerateInterview}
              generatingInterview={generatingInterview}
            />
          )}

          {job.status === "completed" && <ChatWidget jobId={jobId} />}
        </section>
      )}
    </main>
  );
}
