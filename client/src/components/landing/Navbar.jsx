import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { IconClose, IconMenu, IconSparkle } from "../ui/Icons";
import { useScrolled } from "../../lib/hooks";
import { useTheme } from "../../lib/theme";
import { NAV_LINKS } from "./data";
import { Sun, Moon } from "lucide-react";

export function Navbar({ isAuthenticated }) {
  const scrolled = useScrolled(8);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleAnchorClick = (e, href) => {
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    setOpen(false);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-white no-underline shrink-0 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <IconSparkle />
          </div>
          <span className="tracking-tight flex items-center gap-1.5">
            RepoCipher
            <span className="inline-flex items-center rounded-md bg-primary-50 dark:bg-primary-950 px-1.5 py-0.5 text-[10px] font-bold text-primary-600 dark:text-primary-400 border border-primary-200/60 dark:border-primary-800/60">
              AI
            </span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right CTA + Theme Toggle */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80 transition-all cursor-pointer focus:outline-none"
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 animate-spin-once" />
            )}
          </button>

          {isAuthenticated ? (
            <Button to="/app" variant="secondary" size="md">
              Open app
            </Button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 no-underline px-2"
              >
                Log in
              </Link>
              <Button to="/signup" variant="default" size="md" showArrow className="shadow-sm font-semibold">
                Get started
              </Button>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-150">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            {isAuthenticated ? (
              <Button to="/app" variant="secondary" size="md" onClick={() => setOpen(false)}>
                Open app
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors no-underline"
                >
                  Log in
                </Link>
                <Button to="/signup" variant="default" size="md" showArrow onClick={() => setOpen(false)}>
                  Get started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
