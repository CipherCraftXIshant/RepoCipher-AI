import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Eye } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export function ContinueCard({ repo }) {
  return (
    <Card className="p-4 sm:p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-card-hover transition-all duration-200 group bg-white relative">
      <div className="space-y-3">
        {/* Top: Repo name and Status dot */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-semibold text-sm sm:text-base text-slate-900 group-hover:text-primary-600 transition-colors">
              {repo.repoName}
            </span>
          </div>

          {repo.healthScore && (
            <Badge variant="success" className="text-[11px] font-semibold">
              {repo.healthScore}% Health
            </Badge>
          )}
        </div>

        {/* Tech Stack tags */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {repo.stack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-600 text-[11px] font-medium border border-slate-200/50"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Details: Last viewed & Last analyzed */}
        <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400">Last viewed:</span>
            <span className="font-medium text-slate-700 truncate">{repo.lastViewed}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400">Last analyzed:</span>
            <span className="font-medium text-slate-700">{repo.lastAnalyzed}</span>
          </div>
        </div>
      </div>

      {/* Button CTA */}
      <div className="mt-4 pt-2">
        <Button
          as={Link}
          to={`/app?repo=${encodeURIComponent(repo.fullName || repo.repoName)}`}
          variant="outline"
          size="sm"
          className="w-full justify-between font-semibold group-hover:bg-primary-50 group-hover:text-primary-700 group-hover:border-primary-200 transition-all"
        >
          <span>Continue Analysis</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </Card>
  );
}

export function ContinueSection({ repos = [] }) {
  if (!repos.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600" />
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Continue where you left off
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {repos.length} active workspace{repos.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {repos.map((repo) => (
          <ContinueCard key={repo.id} repo={repo} />
        ))}
      </div>
    </section>
  );
}
