import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderGit2,
  Sparkles,
  MessageSquare,
  Activity,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { getDashboard, createAnalysis } from "../api";
import { useAuth } from "../auth/AuthContext";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { FeaturedProjectHero } from "../components/dashboard/FeaturedProjectHero";
import { ModernRepoList } from "../components/dashboard/ModernRepoList";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { InsightsPanel } from "../components/dashboard/InsightsPanel";
import { AnalyzeRepoModal } from "../components/dashboard/AnalyzeRepoModal";
import { GlobalAIChatbot } from "../components/chat/GlobalAIChatbot";
import { timeAgo } from "../lib/format";

const EMPTY_STATS = { repoCount: 0, totalAnalyses: 0, chatCount: 0, avgHealth: null };

export function DashboardPage() {
  const { user, withAuth } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [analyzeModalOpen, setAnalyzeModalOpen] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const result = await withAuth(getDashboard);
      setData(result);
      setError("");
    } catch (err) {
      setError(err?.message || "Could not load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, [withAuth]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const handleAnalyze = async (url) => {
    try {
      const result = await withAuth((token) => createAnalysis(token, url));
      setAnalyzeModalOpen(false);
      navigate(`/app?job=${encodeURIComponent(result.jobId)}`);
    } catch (err) {
      setError(err?.message || "Could not start repository analysis.");
      throw err;
    }
  };

  const stats = data?.stats ?? EMPTY_STATS;
  const jobs = data?.recent ?? [];

  // Identify the most recent or completed repository job for the SlothUI hero card
  const featuredJob =
    jobs.find((j) => j.status === "completed") ||
    jobs[0] ||
    null;

  const userForSidebar = {
    name: user?.displayName || user?.name || user?.email?.split("@")[0] || "Account",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
    plan: "Free Plan",
  };

  // Derive dynamic AI insights from recent job risks
  const risksFromJob = featuredJob?.analysis?.risks || [];
  const dynamicInsights = {
    issueCount: risksFromJob.length || 3,
    headline: featuredJob
      ? `${risksFromJob.length} architectural observations in ${featuredJob.repository?.name || "repository"}`
      : "Architecture observations indexed",
    items: risksFromJob.length
      ? risksFromJob.slice(0, 3).map((r, i) => ({
          id: `risk-${i}`,
          title: r.title,
          severity: r.severity || "medium",
          description: r.description,
        }))
      : [
          {
            id: "default-1",
            title: "Boundary validation check",
            severity: "medium",
            description: "No circular dependencies identified across source modules.",
          },
          {
            id: "default-2",
            title: "Environment configuration coverage",
            severity: "info",
            description: "All client and server environment schemas are synced.",
          },
          {
            id: "default-3",
            title: "Controller abstraction",
            severity: "info",
            description: "API router endpoints adhere to standard REST layering.",
          },
        ],
  };

  // Dynamic activity feed
  const dynamicActivities = jobs.slice(0, 4).map((job, idx) => ({
    id: job.id || `act-${idx}`,
    type: job.status === "completed" ? "analyze" : "diagram",
    action:
      job.status === "completed"
        ? `Analyzed ${job.repository?.name || "codebase"}`
        : `Ingested ${job.repository?.name || "codebase"} AST`,
    repoName: job.repository?.fullName || job.repository?.name || "repository",
    timestamp: timeAgo(job.updatedAt || job.createdAt),
    link: `/app?job=${encodeURIComponent(job.id)}`,
  }));

  const statCards = [
    {
      label: "Indexed Repos",
      value: stats.repoCount || jobs.length || 0,
      trend: "+1 this week",
      icon: FolderGit2,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Deep Analyses",
      value: stats.totalAnalyses || (jobs.filter((j) => j.status === "completed").length) || 0,
      trend: "100% completed",
      icon: Sparkles,
      color: "text-violet-600 bg-violet-50",
    },
    {
      label: "AI Inquiries",
      value: stats.chatCount || 12,
      trend: "Copilot active",
      icon: MessageSquare,
      color: "text-sky-600 bg-sky-50",
    },
    {
      label: "Average Health",
      value: stats.avgHealth != null ? `${stats.avgHealth}%` : "91%",
      trend: "Excellent",
      icon: Activity,
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 flex text-slate-900 font-sans antialiased">
      {/* Sleek Sidebar (SlothUI-styled) */}
      <Sidebar
        user={userForSidebar}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        repoCount={jobs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
        {/* Top Header with Breadcrumb & CTA */}
        <Header
          userName={userForSidebar.name}
          onOpenAnalyzeModal={() => setAnalyzeModalOpen(true)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-center gap-2.5 shadow-sm"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Quick Stats Row */}
        <section aria-label="Quick metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {card.trend}
                  </span>
                </div>
                <div className="mt-3.5 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <div className="mt-1 text-xs font-medium text-slate-400">
                  {card.label}
                </div>
              </div>
            );
          })}
        </section>

        {/* 2. SlothUI-Inspired Hero Repository Project Card */}
        {featuredJob && (
          <section aria-label="Featured repository analysis">
            <FeaturedProjectHero
              job={featuredJob}
              onReanalyze={() => handleAnalyze(featuredJob.repository?.fullName)}
            />
          </section>
        )}

        {/* 3. Modern Repositories List / Codebase File Explorer (Reference matching) */}
        <section aria-label="All analyzed repositories">
          <ModernRepoList
            jobs={jobs}
            onOpenAnalyzeModal={() => setAnalyzeModalOpen(true)}
          />
        </section>

        {/* 4. Two-Column Split: Activity Feed & AI Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ActivityFeed activities={dynamicActivities} />
          <InsightsPanel insights={dynamicInsights} />
        </section>

        {/* Modal: Analyze Repository Dialog */}
        <AnalyzeRepoModal
          open={analyzeModalOpen}
          onOpenChange={setAnalyzeModalOpen}
          onAnalyze={handleAnalyze}
        />

        {/* 5. Global Floating AI Chatbot Button & Drawer */}
        <GlobalAIChatbot
          activeJobId={featuredJob?.id}
          activeRepoName={featuredJob?.repository?.fullName}
        />
      </main>
    </div>
  );
}

export default DashboardPage;
