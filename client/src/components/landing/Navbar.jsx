import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { IconClose, IconMenu, IconSparkle } from "../ui/Icons";
import { useScrolled } from "../../lib/hooks";
import { NAV_LINKS } from "./data";

export function Navbar({ isAuthenticated }) {
  const scrolled = useScrolled(8);
  const [open, setOpen] = useState(false);

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
        scrolled ? "bg-bg-dark/70 backdrop-blur-xl border-b border-white/10" : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-300 mx-auto flex items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-lg text-heading-dark no-underline shrink-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-[9px] bg-accent-dark text-[#0b0710]">
            <IconSparkle />
          </span>
          RepoCipher AI
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className="text-sm text-text-dark hover:text-heading-dark transition-colors duration-150 no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <Button to="/app" variant="secondary" size="md">
              Open app
            </Button>
          ) : (
            <>
              <Link to="/login" className="text-sm text-text-dark hover:text-heading-dark transition-colors duration-150 no-underline px-2">
                Log in
              </Link>
              <Button to="/signup" variant="primary" size="md" showArrow>
                Get started
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-heading-dark"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-bg-dark/95 backdrop-blur-xl px-6 py-5 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className="text-sm text-text-dark hover:text-heading-dark transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
            {isAuthenticated ? (
              <Button to="/app" variant="secondary" size="md" onClick={() => setOpen(false)}>
                Open app
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-sm text-text-dark hover:text-heading-dark transition-colors no-underline"
                >
                  Log in
                </Link>
                <Button to="/signup" variant="primary" size="md" showArrow onClick={() => setOpen(false)}>
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
