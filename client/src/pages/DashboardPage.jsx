import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, createAnalysis, deleteAnalysis, getDashboard } from "../api";
import { useAuth } from "../auth/AuthContext";
import { ANALYSIS_TABS } from "../components/dashboard/AnalysisTabs";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconFolder,
  IconLoader,
  IconMore,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconSparkle,
  IconTrash,
} from "../components/ui/Icons";
import { timeAgo } from "../lib/format";

const TAB_LABEL = Object.fromEntries(ANALYSIS_TABS.map((t) => [t.id, t.label]));

const STATUS_BADGE = {
  completed: "text-good border-good/30 bg-good/10",
  failed: "text-danger border-danger/30 bg-danger/10",
  pending: "text-accent dark:text-accent-dark border-accent-border dark:border-accent-border-dark bg-accent-bg dark:bg-accent-bg-dark",
  fetching: "text-accent dark:text-accent-dark border-accent-border dark:border-accent-border-dark bg-accent-bg dark:bg-accent-bg-dark",
  analyzing: "text-accent dark:text-accent-dark border-accent-border dark:border-accent-border-dark bg-accent-bg dark:bg-accent-bg-dark",
};

const STATUS_LABEL = {
  completed: "Completed",
  failed: "Failed",
  pending: "Queued",
  fetching: "Fetching",
  analyzing: "Analyzing",
};

function healthBadgeClass(score) {
  if (score === null || score === undefined) return "text-text dark:text-text-dark border-border dark:border-border-dark";
  if (score >= 70) return "text-good border-good/30 bg-good/10";
  if (score >= 40) return "text-accent dark:text-accent-dark border-accent-border dark:border-accent-border-dark bg-accent-bg dark:bg-accent-bg-dark";
  return "text-danger border-danger/30 bg-danger/10";
}

function StatTile({ label, value }) {
  return (
    <div className="flex-1 min-w-[110px] p-4 rounded-xl border border-border dark:border-border-dark bg-bg dark:bg-bg-dark">
      <div className="text-2xl font-medium text-heading dark:text-heading-dark tabular-nums">{value ?? "—"}</div>
      <div className="text-[13px] text-text dark:text-text-dark mt-0.5">{label}</div>
    </div>
  );
}

function RepoMenu({ job, onDelete, onReanalyze, busy }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label="Repository actions"
        className="p-2 rounded-lg border border-border dark:border-border-dark text-text dark:text-text-dark cursor-pointer disabled:opacity-50"
        onClick={() => setOpen((v) => !v)}
        disabled={busy}
      >
        <IconMore width={16} height={16} />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-lg border border-border dark:border-border-dark bg-bg dark:bg-bg-dark shadow-card dark:shadow-card-dark overflow-hidden">
            <button
              type="button"
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left text-heading dark:text-heading-dark hover:bg-accent-bg dark:hover:bg-accent-bg-dark cursor-pointer"
              onClick={() => {
                setOpen(false);
                onReanalyze(job);
              }}
            >
              <IconRefresh width={14} height={14} />
              Re-analyze
            </button>
            <button
              type="button"
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left text-danger hover:bg-danger/10 cursor-pointer"
              onClick={() => {
                setOpen(false);
                onDelete(job);
              }}
            >
              <IconTrash width={14} height={14} />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function DashboardPage() {
  const { user, withAuth } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [busyJobId, setBusyJobId] = useState(null);

  const loadDashboard = async () => {
    try {
      const result = await withAuth((token) => getDashboard(token));
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load your dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRecent = useMemo(() => {
    if (!data?.recent) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data.recent;
    return data.recent.filter((job) => job.repository?.fullName?.toLowerCase().includes(q));
  }, [data, query]);

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete the analysis for ${job.repository.fullName}? This can't be undone.`)) return;
    setBusyJobId(job.id);
    try {
      await withAuth((token) => deleteAnalysis(token, job.id));
      setData((prev) => (prev ? { ...prev, recent: prev.recent.filter((j) => j.id !== job.id) } : prev));
    } catch {
      setError("Could not delete that analysis. Please try again.");
    } finally {
      setBusyJobId(null);
    }
  };

  const handleReanalyze = async (job) => {
    setBusyJobId(job.id);
    try {
      await withAuth((token) => createAnalysis(token, job.repository.fullName));
      await loadDashboard();
    } catch {
      setError("Could not start a new analysis. Please try again.");
    } finally {
      setBusyJobId(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark md:flex">
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border dark:border-border-dark px-4 py-6 gap-1">
        <Link to="/" className="font-semibold text-lg text-heading dark:text-heading-dark no-underline px-2 mb-6">
          RepoCipher
        </Link>
        {[
          { href: "#top", label: "Dashboard", icon: IconSparkle },
          { href: "#repositories", label: "Repositories", icon: IconFolder },
          { href: "#activity", label: "Activity", icon: IconClock },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-text dark:text-text-dark hover:text-heading dark:hover:text-heading-dark hover:bg-accent-bg/50 dark:hover:bg-accent-bg-dark/50 no-underline"
          >
            <item.icon width={16} height={16} />
            {item.label}
          </a>
        ))}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-text dark:text-text-dark hover:text-heading dark:hover:text-heading-dark hover:bg-accent-bg/50 dark:hover:bg-accent-bg-dark/50 no-underline mt-auto"
        >
          <IconSettings width={16} height={16} />
          Settings
        </Link>
      </aside>

      <main id="top" className="flex-1 max-w-4xl mx-auto px-6 py-10 md:py-12">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
          <div>
            <h1 className="text-xl lg:text-2xl font-medium text-heading dark:text-heading-dark leading-[118%] tracking-[-0.24px]">
              Welcome back, {user?.displayName ?? user?.email}
            </h1>
            <p className="text-text dark:text-text-dark mt-1">Continue exploring your repositories.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <IconSearch width={15} height={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text dark:text-text-dark" />
              <input
                type="text"
                placeholder="Search repositories…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="[font:inherit] text-sm pl-9 pr-3.5 py-2.5 rounded-lg border border-border dark:border-border-dark bg-bg dark:bg-bg-dark text-heading dark:text-heading-dark focus:outline-none focus:border-accent-border dark:focus:border-accent-border-dark w-48"
              />
            </div>
            <Link
              to="/app"
              className="[font:inherit] text-sm px-4 py-2.5 rounded-lg border border-accent-border dark:border-accent-border-dark bg-accent-bg dark:bg-accent-bg-dark text-heading dark:text-heading-dark no-underline whitespace-nowrap"
            >
              + Analyze
            </Link>
          </div>
        </div>

        {loading && <p className="text-text dark:text-text-dark">Loading your dashboard…</p>}
        {error && <p className="text-danger mb-4">{error}</p>}

        {!loading && data && (
          <>
            <div className="flex flex-wrap gap-3 mb-8">
              <StatTile label="Repos" value={data.stats.repoCount} />
              <StatTile label="Analyses" value={data.stats.totalAnalyses} />
              <StatTile label="Chats" value={data.stats.chatCount} />
              <StatTile label="Avg. Health" value={data.stats.avgHealth !== null ? `${data.stats.avgHealth}%` : "—"} />
            </div>

            {data.continue && (
              <section className="mb-10">
                <h2 className="text-sm font-medium text-text dark:text-text-dark uppercase tracking-wide mb-3">
                  Continue where you left off
                </h2>
                <Link
                  to={`/app?job=${data.continue.id}`}
                  className="flex items-center justify-between gap-4 p-5 rounded-xl border border-accent-border dark:border-accent-border-dark bg-accent-bg dark:bg-accent-bg-dark no-underline group"
                >
                  <div>
                    <div className="font-medium text-heading dark:text-heading-dark">{data.continue.repository.fullName}</div>
                    <div className="text-[13px] text-text dark:text-text-dark mt-1">
                      Last viewed: {TAB_LABEL[data.continue.lastViewedTab] ?? "Overview"}
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-heading dark:text-heading-dark whitespace-nowrap">
                    Continue Analysis
                    <IconArrowRight width={15} height={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </section>
            )}

            <section id="repositories" className="mb-10 scroll-mt-6">
              <h2 className="text-sm font-medium text-text dark:text-text-dark uppercase tracking-wide mb-3">
                Recent repositories
              </h2>
              {filteredRecent.length === 0 ? (
                <p className="text-sm text-text dark:text-text-dark">
                  {query ? "No repositories match your search." : "No repositories analyzed yet."}
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {filteredRecent.map((job) => {
                    const stackNames = job.analysis?.stack?.slice(0, 3).map((s) => s.name) ?? [];
                    return (
                      <div
                        key={job.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border dark:border-border-dark bg-bg dark:bg-bg-dark"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-heading dark:text-heading-dark truncate">
                              {job.repository.fullName}
                            </span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-full border ${STATUS_BADGE[job.status]}`}>
                              {STATUS_LABEL[job.status]}
                            </span>
                            {job.healthScore !== null && job.healthScore !== undefined && (
                              <span className={`text-[11px] px-2 py-0.5 rounded-full border ${healthBadgeClass(job.healthScore)}`}>
                                {job.healthScore}% health
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap mt-1.5">
                            {stackNames.length > 0 && (
                              <span className="text-[13px] text-text dark:text-text-dark">{stackNames.join(" · ")}</span>
                            )}
                            <span className="text-[13px] text-text/70 dark:text-text-dark/70">
                              {stackNames.length > 0 ? "· " : ""}
                              {timeAgo(job.updatedAt)}
                            </span>
                          </div>
                        </div>

                        {busyJobId === job.id ? (
                          <IconLoader width={16} height={16} className="text-text dark:text-text-dark shrink-0" />
                        ) : (
                          <>
                            <Link
                              to={`/app?job=${job.id}`}
                              className="[font:inherit] text-sm px-3.5 py-2 rounded-lg border border-border dark:border-border-dark text-heading dark:text-heading-dark no-underline whitespace-nowrap shrink-0"
                            >
                              Open Analysis
                            </Link>
                            <RepoMenu job={job} onDelete={handleDelete} onReanalyze={handleReanalyze} busy={busyJobId !== null} />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section id="activity" className="scroll-mt-6">
              <h2 className="text-sm font-medium text-text dark:text-text-dark uppercase tracking-wide mb-3">
                Recent activity
              </h2>
              {data.activity.length === 0 ? (
                <p className="text-sm text-text dark:text-text-dark">No activity yet — analyze a repository to get started.</p>
              ) : (
                <div className="flex flex-col gap-5">
                  {data.activity.map((group) => (
                    <div key={group.day}>
                      <div className="text-[13px] font-medium text-text dark:text-text-dark mb-2">{group.day}</div>
                      <ul className="flex flex-col gap-1.5">
                        {group.events.map((event, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-heading dark:text-heading-dark">
                            <IconCheck width={14} height={14} className="text-good shrink-0" />
                            {event.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
