import React, { useState } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { StatsGrid } from "../components/dashboard/StatCard";
import { ContinueSection } from "../components/dashboard/ContinueCard";
import { RepoTable } from "../components/dashboard/RepoTable";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { InsightsPanel } from "../components/dashboard/InsightsPanel";
import { HealthCard } from "../components/dashboard/HealthCard";
import { AnalyzeRepoModal } from "../components/dashboard/AnalyzeRepoModal";
import {
  mockUser,
  mockStats,
  mockContinueRepos,
  mockRecentRepos,
  mockActivity,
  mockInsights,
  mockHealth,
} from "../data/mockData";
import { useAuth } from "../auth/AuthContext";

export function DashboardPage() {
  // If user is logged in through AuthContext, adopt their name / profile
  const auth = useAuth?.() || {};
  const currentUser = auth.user
    ? {
        name: auth.user.displayName || auth.user.name || mockUser.name,
        email: auth.user.email || mockUser.email,
        plan: mockUser.plan,
        avatarUrl: auth.user.avatarUrl || mockUser.avatarUrl,
      }
    : mockUser;

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [analyzeModalOpen, setAnalyzeModalOpen] = useState(false);
  const [recentRepos, setRecentRepos] = useState(mockRecentRepos);

  const handleAnalyze = (url) => {
    // Add newly analyzed repo to local state if desired
    const repoMatch = url.match(/github\.com\/([^/]+\/[^/]+)/) || [null, url];
    const repoName = repoMatch[1]?.split("/")[1] || "new-repository";
    const fullName = repoMatch[1] || url;

    const newEntry = {
      id: `repo-${Date.now()}`,
      name: repoName,
      fullName: fullName,
      stack: ["Detected via AI"],
      analyzed: "Just now",
      healthScore: 92,
      status: "Ready",
      visibility: "Public",
    };

    setRecentRepos((prev) => [newEntry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex text-slate-900 font-sans antialiased selection:bg-primary-100 selection:text-primary-900">
      {/* 1. Left Sidebar */}
      <Sidebar
        user={currentUser}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* 2. Top Header with Time-Aware Greeting & CTA */}
          <Header
            userName={currentUser.name}
            onOpenAnalyzeModal={() => setAnalyzeModalOpen(true)}
            onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          />

          {/* 3. Quick Stats Row */}
          <section aria-label="Overview Metrics">
            <StatsGrid stats={mockStats} />
          </section>

          {/* 4. "Continue where you left off" — Most Prominent Section */}
          <ContinueSection repos={mockContinueRepos} />

          {/* 5. Recent Repositories Table / Search History */}
          <section id="repositories" className="scroll-mt-6">
            <RepoTable
              repos={recentRepos}
              onDelete={(repo) =>
                setRecentRepos((prev) => prev.filter((r) => r.id !== repo.id))
              }
            />
          </section>

          {/* 6. Two-Column Split: Recent Activity + AI Insights */}
          <section id="activity" className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-6">
            <ActivityFeed activities={mockActivity} />
            <InsightsPanel insights={mockInsights} />
          </section>

          {/* 7. Repository Health Card with Mini-Progress Bars */}
          <section aria-label="Repository Health Evaluation">
            <HealthCard health={mockHealth} />
          </section>
        </main>
      </div>

      {/* Modal Dialog for "+ Analyze Repository" */}
      <AnalyzeRepoModal
        open={analyzeModalOpen}
        onOpenChange={setAnalyzeModalOpen}
        onAnalyze={handleAnalyze}
      />
    </div>
  );
}

export default DashboardPage;
