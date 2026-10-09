import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ApiError,
  createAnalysis,
  generateInterviewQuestions,
  runInterviewTurn,
  getAnalysis,
  touchAnalysisViewed,
} from "../api";
import { useAuth } from "../auth/AuthContext";
import { Sidebar } from "../components/dashboard/Sidebar";
import { AnalysisTabs } from "../components/dashboard/AnalysisTabs";
import { ChatWidget } from "../components/chat/ChatWidget";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  Sparkles,
  GitBranch,
  Star,
  Clock,
  AlertCircle,
  FolderGit2,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Menu,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { timeAgo } from "../lib/format";
import { subscribeToJob } from "../socket";

const STEPS = ["pending", "fetching", "analyzing", "completed"];

const STEP_DETAILS = {
  pending: { label: "Queued in Redis pipeline", desc: "Worker allocated" },
  fetching: { label: "Ingesting GitHub AST & README", desc: "Fetching file tree" },
  analyzing: { label: "Gemini AI Architecture Synthesis", desc: "Mapping dependencies & risks" },
  completed: { label: "Analysis Ready", desc: "Insights indexed" },
  failed: { label: "Analysis Encountered Error", desc: "Execution halted" },
};

function ProgressPipeline({ status }) {
  const activeIndex = status === "failed" ? STEPS.length : STEPS.indexOf(status);

  return (
    <Card className="p-6 border-slate-200/90 shadow-card bg-white overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              AI Analysis In Progress
            </h3>
            <p className="text-xs text-slate-500">
              Generating full architecture topology and code risk audit.
            </p>
          </div>
        </div>
        <Badge variant="default" className="animate-pulse">
          {status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
        {STEPS.map((step, i) => {
          const isDone = i < activeIndex;
          const isActive = i === activeIndex;
          const isFailed = status === "failed" && i === activeIndex - 1;
          const info = STEP_DETAILS[step] || { label: step, desc: "" };

          return (
            <div
              key={step}
              className={`p-4 rounded-xl border transition-all duration-200 relative ${
                isDone
                  ? "bg-emerald-50/50 border-emerald-200/80 text-emerald-900"
                  : isActive
                  ? "bg-primary-50/70 border-primary-300 ring-2 ring-primary-500/20 text-primary-900"
                  : isFailed
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-slate-50 border-slate-100 text-slate-400 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Step {i + 1}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
                ) : null}
              </div>
              <div className="font-semibold text-xs leading-snug">{info.label}</div>
              <div className="text-[11px] text-slate-500 mt-1">{info.desc}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function AnalyzerPage() {
  const { user, withAuth } = useAuth();
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState(() => searchParams.get("repo") || "");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [jobId, setJobId] = useState(() => searchParams.get("job"));
  const [job, setJob] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState(null);
  const [generatingInterview, setGeneratingInterview] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
      // Leave generate button in place to retry
    } finally {
      setGeneratingInterview(false);
    }
  };

  const handleInterviewTurn = (history, answer = "") =>
    withAuth((token) => runInterviewTurn(token, jobId, history, answer));

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
        // Transient fetch error
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

  // If URL was provided in query string upon mount, trigger analysis
  useEffect(() => {
    const queryRepo = searchParams.get("repo");
    if (queryRepo && !jobId && !submitting && !job) {
      void handleTriggerRepo(queryRepo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTriggerRepo = async (repoUrl) => {
    setSubmitting(true);
    setFormError(null);
    setJob(null);
    setJobId(null);

    try {
      const result = await withAuth((token) => createAnalysis(token, repoUrl.trim()));
      setJobId(result.jobId);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please check repository URL.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim() || submitting) return;
    void handleTriggerRepo(url);
  };

  const reset = () => {
    setJobId(null);
    setJob(null);
    setFormError(null);
    setUrl("");
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex text-slate-900 font-sans antialiased selection:bg-primary-100 selection:text-primary-900">
      {/* Persistent Left Sidebar */}
      <Sidebar
        user={user}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Analyzer Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 no-underline"
                  >
                    Dashboard
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-primary-600">
                    Repository Explorer
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                  {job?.repository?.fullName || "Analyze Repository"}
                </h1>
              </div>
            </div>

            {job && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={reset}
                  variant="outline"
                  size="sm"
                  className="font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Analyze Another
                </Button>
              </div>
            )}
          </div>

          {/* Search / Ingestion Input Form */}
          {!jobId && (
            <Card className="border-slate-200/90 shadow-card bg-white p-6 sm:p-8">
              <div className="max-w-2xl mx-auto text-center space-y-4">
                <div className="inline-flex p-3 rounded-2xl bg-primary-50 text-primary-600 mb-2">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Enter any GitHub repository URL
                </h2>
                <p className="text-sm text-slate-500 max-w-lg mx-auto">
                  RepoCipher AI pulls repository manifests, READMEs, and structure to generate instant architecture blueprints.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 pt-2">
                  <div className="relative flex-1">
                    <FolderGit2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="https://github.com/facebook/react or owner/repo"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={submitting}
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting || !url.trim()}
                    loading={submitting}
                    variant="default"
                    size="lg"
                    className="font-semibold shadow-md shadow-primary-500/10 whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Inspect Codebase
                  </Button>
                </form>

                {formError && (
                  <p className="text-xs text-rose-500 font-semibold mt-2 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {formError}
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Active Job State */}
          {jobId && job && (
            <div className="space-y-6">
              {/* Repository Banner Card */}
              <Card className="border-slate-200/90 shadow-card bg-white p-5 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {job.repository.fullName}
                      </h2>
                      {job.repository.htmlUrl && (
                        <a
                          href={job.repository.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 no-underline font-medium"
                        >
                          <span>GitHub</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {job.healthScore && (
                        <Badge variant="success" className="font-bold text-xs">
                          {job.healthScore}% Health
                        </Badge>
                      )}
                    </div>

                    {job.repository.description && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
                        {job.repository.description}
                      </p>
                    )}

                    {/* Stats pills */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      {job.repository.stars !== undefined && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          {job.repository.stars} stars
                        </span>
                      )}
                      {job.repository.forks !== undefined && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80">
                          <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                          {job.repository.forks} forks
                        </span>
                      )}
                      {job.repository.pushedAt && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Updated {timeAgo(job.repository.pushedAt)}
                        </span>
                      )}
                      {job.repository.license && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {job.repository.license}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Progress Pipeline if still running */}
              {job.status !== "completed" && job.status !== "failed" && (
                <ProgressPipeline status={job.status} />
              )}

              {/* Failure notification */}
              {job.status === "failed" && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Analysis failed: {job.error || "Unable to parse repository tree."}</span>
                </div>
              )}

              {/* Completed Analysis Explorer */}
              {job.status === "completed" && job.analysis && (
                <div className="space-y-6">
                  <AnalysisTabs
                    analysis={job.analysis}
                    languages={job.repository.languages}
                    initialTab={job.lastViewedTab}
                    onTabChange={handleTabChange}
                    interviewQuestions={interviewQuestions}
                    onGenerateInterview={handleGenerateInterview}
                    generatingInterview={generatingInterview}
                    onInterviewTurn={handleInterviewTurn}
                  />

                  {/* Interactive AI Codebase Chat Widget */}
                  <ChatWidget jobId={jobId} />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AnalyzerPage;
