import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderGit2,
  FileCode2,
  ExternalLink,
  RotateCcw,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { timeAgo } from "../../lib/format";

export function ModernRepoList({ jobs = [], onOpenAnalyzeModal }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const repo = job.repository || {};
    const name = repo.fullName || repo.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="rounded-3xl border border-slate-800/90 bg-[#0D1322] overflow-hidden shadow-2xl text-white">
      {/* Explorer Header */}
      <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center shrink-0">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white tracking-tight">
              Repository Index & File Histories
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {jobs.length} repositories indexed · Live architecture maps & AST ready
            </p>
          </div>
        </div>

        {/* Search Filter */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter repositories…"
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* SlothUI File Tree Header Bar (Commit summary) */}
      {jobs.length > 0 && (
        <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5 overflow-hidden">
              <div className="inline-block h-5 w-5 rounded-full ring-2 ring-[#0D1322] bg-gradient-to-tr from-indigo-500 to-purple-600 text-[9px] font-bold text-white flex items-center justify-center">
                RC
              </div>
              <div className="inline-block h-5 w-5 rounded-full ring-2 ring-[#0D1322] bg-gradient-to-tr from-emerald-500 to-teal-600 text-[9px] font-bold text-white flex items-center justify-center">
                AI
              </div>
            </div>
            <span className="font-medium text-slate-300">
              AST parser and Gemini 3.1 indexed repository modules
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
            <span>HEAD~0</span>
            <span>·</span>
            <span>{jobs.length} Repositories</span>
          </div>
        </div>
      )}

      {/* Explorer Content */}
      {jobs.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center mb-3 shadow-lg">
            <FolderGit2 className="w-7 h-7" />
          </div>
          <h4 className="font-bold text-white text-sm">No repositories analyzed yet</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Enter a public GitHub repository URL to generate instant architecture blueprints and AI insights.
          </p>
          <button
            type="button"
            onClick={onOpenAnalyzeModal}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Your First Repo</span>
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500">
          No repositories matching "{searchTerm}"
        </div>
      ) : (
        <div className="divide-y divide-slate-800/60">
          {filteredJobs.map((job) => {
            const repo = job.repository || {};
            const analysis = job.analysis || {};
            const fullName = repo.fullName || `${repo.owner || "owner"}/${repo.name || "repo"}`;
            const stack = (analysis.stack || []).slice(0, 4).map((item) => item.name);
            const isCompleted = job.status === "completed";
            const isFailed = job.status === "failed";

            return (
              <div
                key={job.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6 hover:bg-slate-800/40 transition-all duration-150"
              >
                {/* Repo Info */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 group-hover:border-indigo-700/60 group-hover:text-indigo-400 flex items-center justify-center shrink-0 transition-colors">
                    <FileCode2 className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/app?job=${encodeURIComponent(job.id)}`}
                        className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors truncate no-underline"
                      >
                        {fullName}
                      </Link>
                      <span className="text-[10px] font-semibold bg-slate-950 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800">
                        {repo.defaultBranch || "main"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>
                        {isCompleted
                          ? `${job.fileCount ?? "—"} files scanned`
                          : isFailed
                          ? "Analysis failed"
                          : "Analyzing codebase…"}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {timeAgo(job.updatedAt || job.createdAt)}
                      </span>
                    </div>

                    {/* Stack tags */}
                    {stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {stack.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center rounded-md bg-slate-950 text-slate-300 px-2 py-0.5 text-[11px] font-medium border border-slate-800"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-300 text-xs font-semibold border border-emerald-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {job.healthScore ? `${job.healthScore}% Health` : "Analyzed"}
                    </span>
                  )}
                  {isFailed && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/70 text-rose-300 text-xs font-semibold border border-rose-800/60">
                      Failed
                    </span>
                  )}
                  {!isCompleted && !isFailed && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/70 text-amber-300 text-xs font-semibold border border-amber-800/60 animate-pulse">
                      In Progress
                    </span>
                  )}

                  <Link
                    to={`/interview?job=${encodeURIComponent(job.id)}`}
                    className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/60 text-xs font-semibold text-indigo-300 hover:text-white transition-colors"
                  >
                    <span>Interview</span>
                  </Link>

                  <Link
                    to={`/app?job=${encodeURIComponent(job.id)}`}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800/80 group-hover:border-slate-700"
                    title="Open codebase analysis"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ModernRepoList;
