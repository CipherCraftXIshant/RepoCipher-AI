import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { IconSparkle } from "../ui/Icons";

const PRODUCT_LINKS = [
  { label: "Interactive demo", href: "#analysis-demo" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Product preview", href: "#preview" },
];

function scrollToAnchor(e, href) {
  const target = document.querySelector(href);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-0 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2.5 text-base font-bold text-slate-900 no-underline dark:text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white"><IconSparkle /></span>
              RepoCipher AI
            </Link>
            <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">Understand the codebase before you touch it. Turn a public GitHub repository into a map you can actually use.</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Works with public GitHub repositories
            </span>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900 dark:text-white">Explore</h2>
            <ul className="mt-4 space-y-3">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.label}><a href={item.href} onClick={(e) => scrollToAnchor(e, item.href)} className="text-sm text-slate-500 no-underline transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900 dark:text-white">Your workspace</h2>
            <ul className="mt-4 space-y-3">
              <li><Link to="/app" className="text-sm text-slate-500 no-underline transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300">Analyze a repository</Link></li>
              <li><Link to="/dashboard" className="text-sm text-slate-500 no-underline transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300">Dashboard</Link></li>
              <li><Link to="/profile" className="text-sm text-slate-500 no-underline transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300">Profile settings</Link></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-sky-50 p-5 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-slate-900">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">New to a codebase?</h2>
            <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">Start with the architecture, key files, and setup notes.</p>
            <Link to="/app" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 no-underline transition-colors hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-white">Open RepoCipher <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} RepoCipher AI. All rights reserved.</p>
          <p>Made for developers finding their way around unfamiliar code.</p>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="inline-flex items-center gap-1.5 font-medium text-slate-600 no-underline transition-colors hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-300">Back to top <ArrowUp className="h-3.5 w-3.5" /></a>
        </div>
      </div>
    </footer>
  );
}
