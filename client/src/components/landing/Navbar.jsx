import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { IconClose, IconMenu, IconSparkle } from "../ui/Icons";
import { useScrolled } from "../../lib/hooks";
import { useTheme } from "../../lib/theme";
import { NAV_LINKS } from "./data";
import { Moon, Sun } from "lucide-react";

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

  const linkColor = scrolled
    ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white"
    : "text-slate-300 hover:bg-white/10 hover:text-white";
  const controlStyle = scrolled
    ? "border-slate-200/80 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
    : "border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10 hover:text-white";

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${scrolled ? "border-slate-200/80 bg-white/85 shadow-xs dark:border-slate-800/80 dark:bg-slate-950/85" : "border-white/[0.08] bg-[#080d1b]/65"}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-10" aria-label="Main navigation">
        <Link to="/" className={`group flex shrink-0 items-center gap-2.5 text-lg font-bold no-underline ${scrolled ? "text-slate-900 dark:text-white" : "text-white"}`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-950/30 transition-transform duration-200 group-hover:scale-105"><IconSparkle /></span>
          <span className="flex items-center gap-1.5 tracking-tight">RepoCipher<span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${scrolled ? "border-primary-200/60 bg-primary-50 text-primary-600 dark:border-primary-800/60 dark:bg-primary-950 dark:text-primary-400" : "border-white/10 bg-white/10 text-indigo-200"}`}>AI</span></span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur md:flex lg:gap-2">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} onClick={(e) => handleAnchorClick(e, link.href)} className={`rounded-full px-3 py-2 text-[13px] font-medium transition-colors no-underline ${linkColor}`}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button type="button" onClick={toggleTheme} className={`rounded-xl border p-2 transition-colors ${controlStyle}`} aria-label="Toggle theme" title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className={`h-4 w-4 ${scrolled ? "text-slate-700" : "text-slate-200"}`} />}
          </button>
          {isAuthenticated ? (
            <Button to="/app" variant={scrolled ? "secondary" : "default"} size="md" className={!scrolled ? "bg-white text-slate-950 hover:bg-slate-100" : ""}>Open app</Button>
          ) : (
            <>
              <Link to="/login" className={`px-3 py-2 text-sm font-semibold transition-colors no-underline ${scrolled ? "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" : "text-slate-300 hover:text-white"}`}>Log in</Link>
              <Button to="/signup" variant="default" size="md" showArrow className="font-semibold shadow-sm shadow-indigo-950/30">Get started</Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={toggleTheme} className={`rounded-xl border p-2 transition-colors ${controlStyle}`} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className={`h-4 w-4 ${scrolled ? "text-slate-700" : "text-slate-200"}`} />}
          </button>
          <button type="button" className={`flex h-9 w-9 items-center justify-center rounded-xl border ${controlStyle}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-navigation" className={`animate-in slide-in-from-top-2 border-t px-5 py-5 duration-150 md:hidden ${scrolled ? "border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95" : "border-white/10 bg-[#080d1b]/95"}`}>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} onClick={(e) => handleAnchorClick(e, link.href)} className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors no-underline ${linkColor}`}>
                {link.label}
              </a>
            ))}
          </div>
          <div className={`mt-4 flex flex-col gap-3 border-t pt-4 ${scrolled ? "border-slate-200 dark:border-slate-800" : "border-white/10"}`}>
            {isAuthenticated ? (
              <Button to="/app" variant={scrolled ? "secondary" : "default"} className={!scrolled ? "bg-white text-slate-950 hover:bg-slate-100" : ""} onClick={() => setOpen(false)}>Open app</Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className={`px-3 py-2 text-sm font-semibold no-underline ${scrolled ? "text-slate-600 dark:text-slate-300" : "text-slate-300"}`}>Log in</Link>
                <Button to="/signup" variant="default" showArrow onClick={() => setOpen(false)}>Get started</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
