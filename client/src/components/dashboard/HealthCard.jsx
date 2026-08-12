import React from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Progress } from "../ui/Progress";
import { Badge } from "../ui/Badge";

export function HealthCard({ health }) {
  if (!health) return null;

  return (
    <Card className="border-slate-200/90 shadow-card hover:border-slate-300 transition-all duration-200 group">
      <Link
        to={`/repository/${health.repoId || "repocipher-ai"}`}
        className="block no-underline text-inherit"
      >
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                Repository Health Audit
              </CardTitle>
              <Badge variant="success" className="text-[10px] font-bold">
                {health.grade || "Excellent"}
              </Badge>
            </div>
            <div className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-2">
              <span>{health.repoName}</span>
              <span className="text-xs font-normal text-slate-400">· Comprehensive AI Evaluation</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 group-hover:text-primary-700">
            <span>Detailed Breakdown</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-4 space-y-5">
          {/* Overall Health Score Bar */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Overall Health Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900">{health.overallScore}</span>
                <span className="text-xs font-medium text-slate-400">/ 100</span>
              </div>
            </div>
            <Progress value={health.overallScore} className="h-2.5" />
          </div>

          {/* Sub-scores as individual mini progress bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {health.subScores.map((sub) => (
              <div
                key={sub.name}
                className="p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/60 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {sub.name}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{sub.score}</span>
                </div>
                <Progress value={sub.score} className="h-1.5" />
                {sub.label && (
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {sub.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
