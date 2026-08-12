import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderGit2,
  Activity,
  Settings,
  HelpCircle,
  Zap,
  X,
  Code2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Badge } from "../ui/Badge";

export function Sidebar({ mobileOpen = false, onClose, user }) {
  const location = useLocation();

  const mainNav = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: location.pathname === "/dashboard" || location.pathname === "/",
    },
    {
      name: "My Repositories",
      href: "/app",
      icon: FolderGit2,
      active: location.pathname === "/app",
    },
    {
      name: "Activity",
      href: "#activity",
      icon: Activity,
      active: false,
    },
  ];

  const generalNav = [
    {
      name: "Settings",
      href: "/profile",
      icon: Settings,
      active: location.pathname === "/profile",
    },
    {
      name: "Help & Docs",
      href: "https://github.com",
      icon: HelpCircle,
      external: true,
      active: false,
    },
  ];

  const userName = user?.name || user?.displayName || "Ishant";
  const userPlan = user?.plan || "Free Plan";
  const initial = userName.charAt(0).toUpperCase();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 sm:p-5 select-none">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand / Logo */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 text-decoration-none group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 leading-tight flex items-center gap-1.5">
                RepoCipher
                <span className="inline-flex items-center rounded-md bg-primary-50 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700 border border-primary-200/60">
                  AI
                </span>
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Codebase Intelligence
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
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

        {/* Navigation Group: MAIN */}
        <div className="space-y-1">
          <div className="px-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Main
          </div>
          <nav className="mt-2 space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 no-underline",
                    item.active
                      ? "bg-primary-50/80 text-primary-700 font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      item.active ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  <span>{item.name}</span>
                  {item.active && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-600" />
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
          <div className="px-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            General
          </div>
          <nav className="mt-2 space-y-1">
            {generalNav.map((item) => {
              const Icon = item.icon;
              return item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150 no-underline"
                >
                  <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>{item.name}</span>
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 no-underline",
                    item.active
                      ? "bg-primary-50/80 text-primary-700 font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      item.active ? "text-primary-600" : "text-slate-400"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Upgrade / Pro teaser card */}
        <div className="rounded-xl border border-primary-100 bg-primary-50/40 p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-900">
            <Zap className="h-3.5 w-3.5 text-primary-600 fill-primary-600" />
            <span>AI Codebase Tokens</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Free tier: 15 / 50 repository queries used this month.
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary-100">
            <div className="h-full w-[30%] bg-primary-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* Bottom Section: User Block */}
      <div className="pt-4">
        <div className="h-px bg-slate-100 mb-3" />
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50 no-underline"
        >
          <Avatar className="h-9 w-9 ring-2 ring-primary-100 ring-offset-1">
            <AvatarImage src={user?.avatarUrl} alt={userName} />
            <AvatarFallback className="bg-primary-100 text-primary-700 font-bold text-xs">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-sm font-semibold text-slate-900 truncate">
                {userName}
              </span>
              <Badge variant="default" className="text-[10px] px-1.5 py-0">
                {userPlan}
              </Badge>
            </div>
            <span className="text-[11px] text-slate-400 truncate">
              {user?.email || "ishant@repocipher.ai"}
            </span>
          </div>
        </Link>
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
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-popover z-50 flex flex-col animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
