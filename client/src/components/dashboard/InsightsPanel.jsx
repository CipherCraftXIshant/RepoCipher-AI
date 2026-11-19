import React from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Link } from "react-router-dom";

export function InsightsPanel({ insights }) {
  if (!insights) return null;

  return (
    <div className="rounded-3xl border border-slate-800/90 bg-[#0D1322] text-white shadow-2xl h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header with warning badge */}
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-800/80 bg-amber-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-800/60 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                AI Architecture & Code Insights
              </h3>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/60">
              {insights.issueCount} Findings
            </span>
          </div>

          <div className="mt-2 text-sm font-semibold text-white">
            {insights.headline}
          </div>
        </div>

        {/* Issue list */}
        <div className="p-4 sm:p-5 pt-4 space-y-3">
          {insights.items.map((item) => {
            const severityColor =
              item.severity === "high"
                ? "bg-rose-950/80 text-rose-300 border-rose-800/60"
                : item.severity === "medium"
                ? "bg-amber-950/80 text-amber-300 border-amber-800/60"
                : "bg-sky-950/80 text-sky-300 border-sky-800/60";

            return (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-150 space-y-1 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-xs font-semibold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border shrink-0 ${severityColor}`}
                  >
                    {item.severity}
                  </span>
                </div>
                {item.description && (
                  <p className="text-[11px] text-slate-400 pl-3.5 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      <div className="p-3 bg-slate-900/40 border-t border-slate-800/80 text-center">
        <Link
          to={`/app?repo=${encodeURIComponent(insights.repoName || "repoCipher-ai")}&tab=insights`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors no-underline"
        >
          <span>View complete findings in audit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
