import { IconSparkle } from "../ui/Icons";

function scrollToAnchor(e, href) {
  const target = document.querySelector(href);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-8">
      <div className="max-w-300 mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div>
          <span className="flex items-center gap-2.5 font-semibold text-heading-dark">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent-dark text-[#0b0710]">
              <IconSparkle />
            </span>
            RepoCipher AI
          </span>
          <p className="text-sm text-text-dark mt-2">Understand the codebase before you touch it.</p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-dark">
          <a href="#analysis-demo" onClick={(e) => scrollToAnchor(e, "#analysis-demo")} className="hover:text-heading-dark transition-colors no-underline">
            Product
          </a>
          <a href="#preview" onClick={(e) => scrollToAnchor(e, "#preview")} className="hover:text-heading-dark transition-colors no-underline">
            Docs
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-heading-dark transition-colors no-underline">
            GitHub
          </a>
          <span className="text-text-dark/40 cursor-default">Privacy</span>
          <span className="text-text-dark/40 cursor-default">Terms</span>
        </nav>
      </div>
    </footer>
  );
}
