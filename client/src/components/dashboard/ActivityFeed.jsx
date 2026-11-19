import React from "react";
import { Clock, CheckCircle2, MessageSquare, Network, FileDown, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Link } from "react-router-dom";

const ACTIVITY_ICONS = {
  analyze: Sparkles,
  diagram: Network,
  chat: MessageSquare,
  export: FileDown,
};

export function ActivityFeed({ activities = [] }) {
  return (
    <div className="rounded-3xl border border-slate-800/90 bg-[#0D1322] text-white shadow-2xl h-full flex flex-col justify-between overflow-hidden">
      <div>
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Recent Activity
            </h3>
            <span className="text-[11px] font-medium text-slate-500">Live stream</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 pt-4">
          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {activities.map((act) => {
              const Icon = ACTIVITY_ICONS[act.type] || CheckCircle2;
              return (
                <div key={act.id} className="relative group">
                  {/* Dot marker with subtle icon */}
                  <div className="absolute -left-6 top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-900 border-2 border-indigo-500 text-indigo-400 shadow-sm transition-transform group-hover:scale-110">
                    <Icon className="w-2.5 h-2.5 text-indigo-400" />
                  </div>

                  <div className="flex flex-col text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-white leading-snug">
                        {act.action}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 shrink-0">
                        {act.timestamp}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-1.5 text-slate-400">
                      <span className="text-[11px]">Repository:</span>
                      <Link
                        to={`/app?repo=${encodeURIComponent(act.repoName)}`}
                        className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-2 decoration-indigo-400/40"
                      >
                        {act.repoName}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-900/40 border-t border-slate-800/80 text-center">
        <span className="text-[11px] font-medium text-slate-500">
          Showing activity from the last 7 days
        </span>
      </div>
    </div>
  );
}
