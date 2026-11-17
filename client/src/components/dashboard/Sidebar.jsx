import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderGit2,
  Activity,
  Settings,
  HelpCircle,
  Zap,
  X,
  Code2,
  Search,
  Sparkles,
  LogOut,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { useAuth } from "../../auth/AuthContext";

export function Sidebar({ mobileOpen = false, onClose, user, repoCount = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showPromo, setShowPromo] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {}
  };

  const mainNav = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: location.pathname === "/dashboard" || location.pathname === "/",
      badge: null,
    },
    {
      name: "My Repositories",
      href: "/app",
      icon: FolderGit2,
      active: location.pathname === "/app",
      badge: repoCount > 0 ? repoCount : null,
    },
    {
      name: "Architecture Maps",
      href: "/app?tab=architecture",
      icon: Code2,
      active: location.search.includes("tab=architecture"),
      badge: "AI",
    },
    {
      name: "Security & Health",
      href: "/app?tab=risks",
      icon: ShieldCheck,
      active: location.search.includes("tab=risks"),
      badge: null,
    },
  ];

  const generalNav = [
    {
      name: "Settings & Profile",
      href: "/profile",
      icon: Settings,
      active: location.pathname === "/profile",
    },
    {
      name: "Documentation",
      href: "https://github.com",
      icon: HelpCircle,
      external: true,
      active: false,
    },
  ];

  const userName = user?.displayName || user?.name || "Ishant";
  const userPlan = user?.plan || "Free Plan";
  const initial = userName.charAt(0).toUpperCase();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 sm:p-5 select-none bg-white">
      {/* Top Section */}
      <div className="space-y-5">
        {/* Brand / Logo */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 text-decoration-none group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 transition-transform duration-200 group-hover:scale-105">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-tight flex items-center gap-1.5">
                RepoCipher
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200/60">
                  AI
                </span>
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Codebase Intelligence
              </span>
            </div>
          </Link>

          {mobileOpen && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Sidebar Search Bar (Reference matching) */}
        <div className="px-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search repos, docs…"
              className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-400 font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Navigation Group: MAIN */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Platform
          </div>
          <nav className="mt-1 space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 no-underline",
                    item.active
                      ? "bg-indigo-50 text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      item.active ? "text-indigo-600" : "text-slate-400"
                    )}
                  />
                  <span>{item.name}</span>
                  {item.badge !== null && (
                    <span
                      className={cn(
                        "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                        item.active
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Navigation Group: GENERAL */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Preferences
          </div>
          <nav className="mt-1 space-y-1">
            {generalNav.map((item) => {
              const Icon = item.icon;
              return item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150 no-underline"
                >
                  <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>{item.name}</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 no-underline",
                    item.active
                      ? "bg-indigo-50 text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      item.active ? "text-indigo-600" : "text-slate-400"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Upsell Promo Card (Direct reference to SlothUI sidebar banner!) */}
        {showPromo && (
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-4 text-white shadow-lg shadow-indigo-950/20 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPromo(false)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-2.5">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <h4 className="text-xs font-bold tracking-tight">RepoCipher Pro</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Unlimited repository AST indexing, deep diagrams & unlimited AI chats.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="rounded-lg bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors"
              >
                Go Pro
              </button>
              <button
                type="button"
                onClick={() => setShowPromo(false)}
                className="text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: User Block with Logout */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl hover:bg-slate-50 transition-colors">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 min-w-0 flex-1 no-underline"
          >
            <Avatar className="h-9 w-9 ring-2 ring-indigo-100 ring-offset-1">
              <AvatarImage src={user?.avatarUrl} alt={userName} />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-xs">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 truncate">
                {userName}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {userPlan}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white min-h-screen sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
