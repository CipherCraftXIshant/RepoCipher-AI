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
    <Card className="h-full border-slate-200/90 shadow-card flex flex-col justify-between">
      <div>
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-primary-600" />
              Recent Activity
            </CardTitle>
            <span className="text-[11px] font-medium text-slate-400">Live stream</span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-4">
          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200/70">
            {activities.map((act) => {
              const Icon = ACTIVITY_ICONS[act.type] || CheckCircle2;
              return (
                <div key={act.id} className="relative group">
                  {/* Dot marker with subtle icon */}
                  <div className="absolute -left-6 top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white border-2 border-primary-500 text-primary-600 shadow-xs transition-transform group-hover:scale-110">
                    <Icon className="w-2.5 h-2.5 text-primary-600" />
                  </div>

                  <div className="flex flex-col text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800 leading-snug">
                        {act.action}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 shrink-0">
                        {act.timestamp}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-1.5 text-slate-500">
                      <span className="text-[11px]">Repository:</span>
                      <Link
                        to={`/app?repo=${encodeURIComponent(act.repoName)}`}
                        className="font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2 decoration-primary-200"
                      >
                        {act.repoName}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </div>

      <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
        <span className="text-[11px] font-medium text-slate-400">
          Showing activity from the last 7 days
        </span>
      </div>
    </Card>
  );
}
