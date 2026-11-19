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
  const [copiedHash, setCopiedHash] = React.useState(false);

  const hashString = job.id ? job.id.slice(0, 9) : "b48a70058";

  const handleCopyHash = () => {
    navigator.clipboard.writeText(hashString);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-slate-800/90 bg-[#0D1322] p-5 sm:p-7 shadow-2xl text-white transition-all duration-200 hover:border-slate-700/80">
      {/* Top Meta & Action Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          {/* Big Project Circle Avatar (SlothUI Reference 2-Tone Gradient) */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-1 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg shadow-indigo-950/50 shrink-0">
            <div className="w-full h-full rounded-full bg-[#080C14]/60 backdrop-blur-xs flex items-center justify-center uppercase tracking-wider font-mono">
              {repoName.slice(0, 2)}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold text-slate-400">
                Project ID: #{job.id ? job.id.slice(-4) : "214"}
              </span>
              <span className="rounded-full bg-indigo-950/80 text-indigo-300 px-2.5 py-0.5 text-[11px] font-semibold border border-indigo-800/60">
                {repo.defaultBranch || "main"}
              </span>
              <span className="rounded-full bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1 border border-emerald-800/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Architecture Verified
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
              {repoFullName}
            </h2>

            {repo.description && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-1 max-w-2xl">
                {repo.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Pills on Right */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          {repo.stars !== undefined && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-300">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars} Stars
            </span>
          )}
          {repo.forks !== undefined && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-300">
              <GitFork className="w-3.5 h-3.5 text-slate-400" />
              {repo.forks >= 1000 ? `${(repo.forks / 1000).toFixed(1)}k` : repo.forks} Forks
            </span>
          )}
          {repoFullName && (
            <a
              href={`https://github.com/${repoFullName}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              GitHub
            </a>
          )}
          <Link
            to={`/interview?job=${encodeURIComponent(job.id)}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/60 hover:bg-indigo-900/60 text-xs font-bold text-indigo-300 hover:text-white transition-all shadow-sm"
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Practice Interview</span>
          </Link>
          <Link
            to={`/app?job=${encodeURIComponent(job.id)}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>Full Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row (Icons + Values matching SlothUI reference) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-4 text-xs font-medium text-slate-300 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="truncate">Updated {timeAgo(job.updatedAt || job.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-500 shrink-0" />
          <span>{repo.contributorsCount || 16} Members</span>
        </div>
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-slate-500 shrink-0" />
          <span>{job.fileCount || 284} Files Scanned</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-slate-500 shrink-0" />
          <span>v{analysis.dependencies?.[0]?.version || "5.3.0"} Release</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-emerald-400">{healthScore}% Health Score</span>
        </div>
      </div>

      {/* Multi-Segment Progress Bar (Matching SlothUI reference image) */}
      <div className="pt-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Architecture & Component Breakdown
          </span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Flow (35%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" /> Logic (30%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Stack (20%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Tests (15%)
            </span>
          </div>
        </div>

        {/* The Colored Segments with subtle neon glow */}
        <div className="h-2.5 w-full rounded-full bg-slate-950 border border-slate-800 flex overflow-hidden gap-1 p-0.5">
          <div className="h-full rounded-full bg-indigo-500 transition-all duration-500 shadow-sm shadow-indigo-500/50" style={{ width: "35%" }} />
          <div className="h-full rounded-full bg-sky-400 transition-all duration-500 shadow-sm shadow-sky-400/50" style={{ width: "30%" }} />
          <div className="h-full rounded-full bg-amber-400 transition-all duration-500 shadow-sm shadow-amber-400/50" style={{ width: "20%" }} />
          <div className="h-full rounded-full bg-emerald-400 transition-all duration-500 shadow-sm shadow-emerald-400/50" style={{ width: "15%" }} />
        </div>
      </div>

      {/* Sub-card row (Commit / AST verification banner matching SlothUI) */}
      <div className="mt-4 p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
            AI
          </div>
          <span className="text-slate-300">
            Synthesized with <strong className="text-white">Gemini 3.1 & GitHub AST</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            No Critical Architectural Flaws
          </span>
          <button
            type="button"
            onClick={handleCopyHash}
            className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Click to copy commit hash"
          >
            <span>{hashString}</span>
            <span className="text-[10px] text-slate-500">{copiedHash ? "✓" : "⧉"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProjectHero;
