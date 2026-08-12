import React from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Link } from "react-router-dom";

export function InsightsPanel({ insights }) {
  if (!insights) return null;

  return (
    <Card className="h-full border-slate-200/90 shadow-card flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header with warning badge */}
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 bg-amber-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <CardTitle className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                AI Code Insights
              </CardTitle>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              {insights.issueCount} Findings
            </span>
          </div>

          <div className="mt-2 text-sm font-semibold text-slate-800">
            {insights.headline}
          </div>
        </CardHeader>

        {/* Issue list */}
        <CardContent className="p-4 sm:p-5 pt-4 space-y-3">
          {insights.items.map((item) => {
            const severityColor =
              item.severity === "high"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : item.severity === "medium"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-slate-100 text-slate-700 border-slate-200";

            return (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 transition-all duration-150 space-y-1 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-900 leading-snug group-hover:text-primary-700 transition-colors">
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
                  <p className="text-[11px] text-slate-500 pl-3.5 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </div>

      {/* Footer Link */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
        <Link
          to={`/app?repo=${encodeURIComponent(insights.repoName || "repoCipher-ai")}&tab=insights`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors no-underline"
        >
          <span>View insights</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
