import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, FolderGit2, MessageSquare, Plus, Sparkles } from "lucide-react";
import { getDashboard, createAnalysis } from "../api";
import { useAuth } from "../auth/AuthContext";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { AnalyzeRepoModal } from "../components/dashboard/AnalyzeRepoModal";
import { timeAgo } from "../lib/format";

const EMPTY_STATS = { repoCount: 0, totalAnalyses: 0, chatCount: 0, avgHealth: null };

export function DashboardPage() {
  const { user, withAuth } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [analyzeModalOpen, setAnalyzeModalOpen] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      const result = await withAuth(getDashboard);
      setData(result);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load your dashboard.");
    }
  }, [withAuth]);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const handleAnalyze = async (url) => {
    try {
      const result = await withAuth((token) => createAnalysis(token, url));
      setAnalyzeModalOpen(false);
      navigate(`/app?job=${encodeURIComponent(result.jobId)}`);
    } catch (err) {
      setError(err.message || "Could not start repository analysis.");
      throw err;
    }
  };

  const stats = data?.stats ?? EMPTY_STATS;
  const jobs = data?.recent ?? [];
  const userForSidebar = {
    name: user?.displayName || user?.name || user?.email?.split("@")[0] || "Account",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
    plan: "Free Plan",
  };
  const statCards = [
    ["Repositories", stats.repoCount, FolderGit2],
    ["Analyses", stats.totalAnalyses, Sparkles],
    ["AI Chats", stats.chatCount, MessageSquare],
    ["Average health", stats.avgHealth == null ? "—" : `${stats.avgHealth}%`, Activity],
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 flex text-slate-900 font-sans antialiased">
      <Sidebar user={userForSidebar} mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <main className="flex-1 min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
        <Header userName={userForSidebar.name} onOpenAnalyzeModal={() => setAnalyzeModalOpen(true)} onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}
        <section aria-label="Overview metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Icon className="h-4 w-4 text-primary-600" /><div className="mt-3 text-2xl font-bold">{value}</div><div className="mt-1 text-xs uppercase tracking-wide text-slate-500">{label}</div></div>)}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
            <div><h2 className="font-semibold">Your repository analyses</h2><p className="mt-1 text-sm text-slate-500">Live results from your account</p></div>
            <button onClick={() => setAnalyzeModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"><Plus className="h-4 w-4" /> Analyze repository</button>
          </div>
          {data === null && !error ? <p className="p-6 text-sm text-slate-500">Loading your analyses…</p> : jobs.length === 0 ? <div className="p-8 text-center"><p className="font-medium">No repositories analyzed yet</p><p className="mt-1 text-sm text-slate-500">Start with a public GitHub repository.</p></div> : <div className="divide-y divide-slate-100">{jobs.map((job) => {
            const repo = job.repository || {};
            const stack = (job.analysis?.stack || []).slice(0, 4).map((item) => item.name);
            return <Link key={job.id} to={`/app?job=${encodeURIComponent(job.id)}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-slate-50 no-underline text-inherit">
              <div className="min-w-0"><div className="font-semibold truncate">{repo.fullName || `${repo.owner || ""}/${repo.name || "Repository"}`}</div><div className="mt-1 text-xs text-slate-500">{job.status === "completed" ? `${job.fileCount ?? "—"} files scanned` : job.status} · {timeAgo(job.updatedAt || job.createdAt)}</div>{stack.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{stack.map((name) => <span key={name} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{name}</span>)}</div>}</div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${job.status === "completed" ? "bg-emerald-50 text-emerald-700" : job.status === "failed" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{job.status}</span>
            </Link>;
          })}</div>}
        </section>
        <AnalyzeRepoModal open={analyzeModalOpen} onOpenChange={setAnalyzeModalOpen} onAnalyze={handleAnalyze} />
      </main>
    </div>
  );
}

export default DashboardPage;
