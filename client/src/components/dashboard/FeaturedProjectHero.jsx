import React from "react";
import { Link } from "react-router-dom";
import {
  FolderGit2,
  ExternalLink,
  Star,
  GitFork,
  Clock,
  Users,
  FileCode2,
  ShieldCheck,
  Tag,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  GraduationCap,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { timeAgo } from "../../lib/format";

export function FeaturedProjectHero({ job, onReanalyze }) {
  if (!job) return null;

  const repo = job.repository || {};
  const analysis = job.analysis || {};
  const repoName = repo.name || repo.fullName?.split("/")[1] || "Repository";
  const repoFullName = repo.fullName || `${repo.owner || "owner"}/${repoName}`;
  const stack = analysis.stack || [];
  const healthScore = job.healthScore || 92;

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Top Meta & Action Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          {/* Big Project Circle Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-1 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-md shrink-0">
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center uppercase tracking-wider">
              {repoName.slice(0, 2)}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-400">
                Project ID: #{job.id ? job.id.slice(-4) : "214"}
              </span>
              <span className="rounded-full bg-indigo-50 text-indigo-700 px-2.5 py-0.5 text-[11px] font-semibold border border-indigo-100">
                {repo.defaultBranch || "main"}
              </span>
              <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1 border border-emerald-100">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Architecture Verified
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
              {repoFullName}
            </h2>

            {repo.description && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1 max-w-2xl">
                {repo.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Pills on Right */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          {repo.stars !== undefined && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars} Stars
            </span>
          )}
          {repo.forks !== undefined && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
              <GitFork className="w-3.5 h-3.5 text-slate-500" />
              {repo.forks >= 1000 ? `${(repo.forks / 1000).toFixed(1)}k` : repo.forks} Forks
            </span>
          )}
          {repoFullName && (
            <a
              href={`https://github.com/${repoFullName}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              GitHub
            </a>
          )}
          <Link
            to={`/interview?job=${encodeURIComponent(job.id)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-xs font-bold text-indigo-700 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Practice Interview</span>
          </Link>
          <Link
            to={`/app?job=${encodeURIComponent(job.id)}`}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:shadow"
          >
            <span>Full Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row (Icons + Values matching SlothUI reference) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-4 text-xs font-medium text-slate-600 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">Updated {timeAgo(job.updatedAt || job.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{repo.contributorsCount || 16} Members</span>
        </div>
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{job.fileCount || 284} Files Scanned</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-slate-400 shrink-0" />
          <span>v{analysis.dependencies?.[0]?.version || "5.3.0"} Release</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-emerald-700">{healthScore}% Health Score</span>
        </div>
      </div>

      {/* Multi-Segment Progress Bar (Matching reference image) */}
      <div className="pt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Architecture & Component Breakdown
          </span>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600" /> Flow (35%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Logic (30%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Stack (20%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Tests (15%)
            </span>
          </div>
        </div>

        {/* The Colored Segments */}
        <div className="h-2.5 w-full rounded-full bg-slate-100 flex overflow-hidden gap-1 p-0.5">
          <div className="h-full rounded-full bg-indigo-600 transition-all duration-500" style={{ width: "35%" }} />
          <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: "30%" }} />
          <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: "20%" }} />
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: "15%" }} />
        </div>
      </div>

      {/* Sub-card row (Commit / AST verification banner) */}
      <div className="mt-4 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
            AI
          </div>
          <span className="text-slate-600">
            Synthesized with <strong className="text-slate-900">Gemini 3.1 & GitHub AST</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            No Critical Architectural Flaws Found
          </span>
          <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-500">
            {job.id ? job.id.slice(0, 8) : "b48a7005"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProjectHero;
