import { ArrowUpRight, Boxes, GitBranch, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { IconSparkle } from "../ui/Icons";

const HIGHLIGHTS = [
  { icon: GitBranch, text: "See how the app is wired together" },
  { icon: Boxes, text: "Find the files worth reading first" },
  { icon: Sparkles, text: "Get a plain-English project brief" },
];

export function AuthLayout({ title, description, children, footer }) {
  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(480px,0.9fr)]">
      <aside className="relative isolate overflow-hidden bg-[#0a1020] px-6 py-7 text-white sm:px-10 lg:flex lg:min-h-screen lg:flex-col lg:justify-between lg:px-12 lg:py-10 xl:px-16">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_10%_0%,rgba(99,102,241,0.35),transparent_50%),radial-gradient(ellipse_at_90%_90%,rgba(14,165,233,0.18),transparent_45%)]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:48px_48px]" />

        <Link to="/" className="inline-flex w-fit items-center gap-2.5 text-base font-bold text-white no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500"><IconSparkle /></span>
          RepoCipher <span className="rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-indigo-200">AI</span>
        </Link>

        <div className="hidden max-w-xl py-12 lg:block">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">A better first day in any repo</p>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">Get the lay of the codebase before your first commit.</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">RepoCipher turns a public GitHub repository into a clear map of its stack, architecture, and key files.</p>
          <ul className="mt-9 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-200"><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-cyan-200"><Icon className="h-4 w-4" /></span>{text}</li>
            ))}
          </ul>
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <div className="flex items-center justify-between text-xs text-slate-400"><span>REPOSITORY MAP</span><span className="text-emerald-300">Ready to explore</span></div>
            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-200">
              <span className="rounded-lg border border-indigo-300/20 bg-indigo-300/10 px-3 py-2">GitHub repo</span><span className="h-px flex-1 bg-gradient-to-r from-indigo-300/60 to-cyan-300/60" /><span className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2">Codebase guide</span><ArrowUpRight className="h-4 w-4 text-cyan-200" />
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-400 lg:mt-0">Understand the codebase before you touch it.</p>
      </aside>

      <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:min-h-screen lg:px-12">
        <div className="w-full max-w-md">
          <header className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </header>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/[0.04] sm:p-8">
            {children}
          </div>
          {footer && <div className="mt-5 text-center text-sm text-slate-500">{footer}</div>}
          <div className="mt-6 flex justify-center">
            <Link to="/" className="text-xs font-medium text-slate-500 no-underline transition-colors hover:text-slate-900">Back to RepoCipher</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
