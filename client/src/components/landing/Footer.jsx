import { IconSparkle } from "../ui/Icons";

function scrollToAnchor(e, href) {
  const target = document.querySelector(href);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 mt-16 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div>
          <span className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-600 text-white">
              <IconSparkle />
            </span>
            RepoCipher AI
          </span>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Understand the codebase before you touch it.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
          <a
            href="#analysis-demo"
            onClick={(e) => scrollToAnchor(e, "#analysis-demo")}
            className="hover:text-slate-900 dark:hover:text-white transition-colors no-underline"
          >
            Product
          </a>
          <a
            href="#preview"
            onClick={(e) => scrollToAnchor(e, "#preview")}
            className="hover:text-slate-900 dark:hover:text-white transition-colors no-underline"
          >
            Docs
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 dark:hover:text-white transition-colors no-underline"
          >
            GitHub
          </a>
          <span className="text-slate-400 dark:text-slate-600 cursor-default">Privacy</span>
          <span className="text-slate-400 dark:text-slate-600 cursor-default">Terms</span>
        </nav>
      </div>
    </footer>
  );
}
