import { RepoInput } from "./RepoInput";
import {
  ArrowDown,
  ArrowRight,
  Braces,
  Check,
  CircleDot,
  FileCode2,
  GitBranch,
  Layers3,
  LockKeyhole,
  Sparkles,
  Waypoints,
} from "lucide-react";

const FILES = [
  { name: "app/", icon: Layers3, tone: "text-violet-300" },
  { name: "router.ts", icon: FileCode2, tone: "text-sky-300" },
  { name: "middleware.ts", icon: Braces, tone: "text-emerald-300" },
];

export function Hero({ onAnalyze }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#080d1b] text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(99,102,241,0.34),transparent_42%),radial-gradient(ellipse_at_88%_48%,rgba(14,165,233,0.2),transparent_36%),linear-gradient(125deg,#080d1b_12%,#10152b_55%,#0a1421)]" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
        <div className="absolute -left-32 top-36 h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/15 blur-[110px]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.04fr_0.96fr] lg:gap-12 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-indigo-100 shadow-lg shadow-indigo-950/20 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Your codebase, mapped in minutes
            <span className="ml-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300">Public repos</span>
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-[1.06] tracking-[-0.045em] sm:text-6xl lg:text-[4.35rem]">
            Start with the map.
            <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-sky-200 to-cyan-300 bg-clip-text text-transparent">
              Not a thousand files.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Drop in a public GitHub repo. RepoCipher explains the stack, traces how the pieces fit, and gives you a clear place to start reading.
          </p>

          <div className="mt-8 max-w-2xl [&_form]:border-white/10 [&_form]:bg-slate-950/70 [&_form]:shadow-2xl [&_form]:shadow-indigo-950/40 [&_input]:text-white [&_input]:placeholder:text-slate-500 [&_button[type=submit]]:bg-indigo-500 [&_button[type=submit]]:hover:bg-indigo-400">
            <RepoInput onAnalyze={onAnalyze} />
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-400">
            <span className="inline-flex items-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5 text-emerald-300" />Public repos only</span>
            <span className="inline-flex items-center gap-1.5"><GitBranch className="h-3.5 w-3.5 text-sky-300" />No clone or setup</span>
            <span className="inline-flex items-center gap-1.5"><Waypoints className="h-3.5 w-3.5 text-violet-300" />Architecture and entry points</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[590px] lg:ml-auto">
          <div aria-hidden="true" className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-indigo-500/20 via-sky-400/10 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0d1425]/90 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" /></div>
                <span className="text-xs font-medium text-slate-300">Repository overview</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.08] px-2.5 py-1 text-[10px] font-semibold text-emerald-200"><CircleDot className="h-3 w-3" />Sample analysis</span>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] p-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/50 text-slate-100"><GitBranch className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-white">vercel / next.js</div><div className="mt-0.5 text-xs text-slate-400">A framework for the web</div></div>
                <span className="hidden rounded-md bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-300 sm:block">TypeScript</span>
              </div>

              <div className="mt-5 grid grid-cols-[0.82fr_1fr] gap-3 sm:gap-4">
                <div className="rounded-xl border border-white/[0.08] bg-[#090f1d]/80 p-3.5 sm:p-4">
                  <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Project map</div>
                  <div className="space-y-3">
                    {FILES.map(({ name, icon: Icon, tone }, i) => (
                      <div key={name} className={`flex items-center gap-2 text-xs ${i === 0 ? "text-white" : "pl-3 text-slate-400"}`}>
                        <Icon className={`h-3.5 w-3.5 ${tone}`} />{name}
                      </div>
                    ))}
                    <div className="ml-[7px] h-3 border-l border-dashed border-slate-700" />
                    <div className="flex items-center gap-2 text-xs text-slate-400"><FileCode2 className="h-3.5 w-3.5 text-amber-200" />server.ts</div>
                  </div>
                  <div className="mt-5 border-t border-white/[0.07] pt-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Detected stack</div>
                    <div className="mt-2 flex flex-wrap gap-1.5"><span className="rounded-md bg-sky-400/10 px-2 py-1 text-[10px] text-sky-200">React</span><span className="rounded-md bg-amber-300/10 px-2 py-1 text-[10px] text-amber-100">Node.js</span></div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-indigo-300/15 bg-gradient-to-br from-indigo-400/[0.12] via-[#11182b] to-cyan-400/[0.07] p-3.5 sm:p-4">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-400/10 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-200"><Sparkles className="h-3.5 w-3.5" />Onboarding brief</div>
                    <p className="mt-3 text-sm font-semibold leading-5 text-white">A quick path through the codebase</p>
                    <p className="mt-2 text-[11px] leading-5 text-slate-300">Start at the server entry point, follow the request into the router, then explore the app directory.</p>
                    <div className="mt-4 space-y-2.5 border-t border-white/[0.08] pt-3">
                      {["Request flow mapped", "Key files highlighted", "Setup steps collected"].map((item) => <div key={item} className="flex items-center gap-2 text-[10px] text-slate-300"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300"><Check className="h-2.5 w-2.5" /></span>{item}</div>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                <div><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">From repo URL</div><div className="mt-1 text-xs font-medium text-slate-200">To a confident first contribution</div></div>
                <ArrowRight className="h-4 w-4 text-cyan-300" />
              </div>
            </div>
          </div>
          <a href="#analysis-demo" className="mx-auto mt-6 flex w-fit items-center gap-2 text-xs font-medium text-slate-400 no-underline transition-colors hover:text-white">
            Explore the interactive demo <ArrowDown className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
