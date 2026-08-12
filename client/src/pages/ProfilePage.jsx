import React, { useRef, useState } from "react";
import { ApiError, uploadAvatar } from "../api";
import { useAuth } from "../auth/AuthContext";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import {
  Upload,
  Key,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Trash2,
  Lock,
  Menu,
} from "lucide-react";

export function ProfilePage() {
  const { user, setUser, withAuth, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Settings mock state
  const [githubToken, setGithubToken] = useState("ghp_****************************");
  const [geminiApiKey, setGeminiApiKey] = useState("AIzaSy**************************");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await withAuth((token) => uploadAvatar(token, file));
      setUser(result.user);
      setSuccess("Profile photo updated successfully!");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSuccess("Settings and API preferences saved.");
    setTimeout(() => setSuccess(null), 3000);
  };

  const userName = user?.displayName || user?.name || "Ishant Sharma";
  const userEmail = user?.email || "ishant@repocipher.ai";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50/60 flex text-slate-900 font-sans antialiased selection:bg-primary-100 selection:text-primary-900">
      {/* Persistent Left Sidebar */}
      <Sidebar
        user={user || { name: userName, email: userEmail, plan: "Free Plan" }}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Settings Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Account & Developer Settings
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Manage your personal profile, AI quotas, API keys, and workspace preferences.
                </p>
              </div>
            </div>

            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              Sign out
            </Button>
          </div>

          {/* Feedback banners */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* 1. Profile Overview Card */}
          <Card className="border-slate-200/90 shadow-card">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Profile Details
              </CardTitle>
              <CardDescription>
                Your public identity and avatar across RepoCipher AI.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar section */}
              <div className="relative group flex flex-col items-center">
                <Avatar className="h-24 w-24 ring-4 ring-slate-100 shadow-md">
                  <AvatarImage src={user?.avatarUrl} alt={userName} />
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-2xl font-bold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>

                <Button
                  variant="outline"
                  size="xs"
                  className="mt-3 gap-1 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                  loading={uploading}
                >
                  <Upload className="w-3 h-3" />
                  {uploading ? "Uploading..." : "Change Photo"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handleFileChange}
                />
              </div>

              {/* Information Fields */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Display Name
                  </label>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800">
                    {userName}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 flex items-center justify-between">
                    <span>{userEmail}</span>
                    <Badge variant="success" className="text-[10px]">Verified</Badge>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Current Role
                  </label>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800">
                    Lead Software Architect
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Plan Tier
                  </label>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 flex items-center justify-between">
                    <span>Free Community Plan</span>
                    <Badge variant="default" className="text-[10px]">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Usage & Token Quota */}
          <Card className="border-slate-200/90 shadow-card">
            <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-600 fill-primary-600" />
                  Monthly Token & AI Usage
                </CardTitle>
                <CardDescription>
                  Your current tier consumption resets in 18 days.
                </CardDescription>
              </div>
              <Badge variant="default" className="text-xs font-semibold">
                15 / 50 Analyses Used
              </Badge>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-700">Repository Analyses (30% used)</span>
                  <span className="text-slate-900">15 of 50 repos</span>
                </div>
                <Progress value={30} className="h-2.5" />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-700">AI Chat & Architecture Queries</span>
                  <span className="text-slate-900">124 of 500 prompts</span>
                </div>
                <Progress value={24.8} className="h-2.5" />
              </div>

              {/* Upgrade Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="font-bold text-sm flex items-center justify-center sm:justify-start gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary-300" />
                    Unlock Unlimited Repositories & Private Codebases
                  </div>
                  <p className="text-xs text-primary-200 max-w-md">
                    Upgrade to RepoCipher Pro for deep AST indexing, private GitHub orgs, and priority Gemini 1.5 Pro inference.
                  </p>
                </div>
                <Button variant="default" size="sm" className="bg-white hover:bg-slate-100 text-slate-900 font-bold whitespace-nowrap shadow-sm">
                  Upgrade to Pro ($19/mo)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 3. Developer Keys & Integrations */}
          <Card className="border-slate-200/90 shadow-card">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Key className="w-4 h-4 text-slate-600" />
                API Keys & Integrations
              </CardTitle>
              <CardDescription>
                Bring your own keys to raise rate limits and analyze private repositories.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSavePreferences} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    GitHub Personal Access Token (PAT)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full pl-3.5 pr-10 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl text-sm font-mono text-slate-900"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Used for fetching public/private repo trees with up to 5,000 requests/hr.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Custom Google Gemini API Key (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxx"
                      className="w-full pl-3.5 pr-10 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl text-sm font-mono text-slate-900"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Leave blank to use our managed high-speed Gemini service.
                  </span>
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="default" size="sm" className="font-semibold">
                    Save Key Configuration
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 4. Danger Zone */}
          <Card className="border-rose-200 bg-rose-50/20 shadow-card">
            <CardHeader className="border-b border-rose-100 pb-4">
              <CardTitle className="text-sm font-bold text-rose-800 uppercase tracking-wider flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-600" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-rose-600/80">
                Irreversible actions on your analyses and account data.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Delete Account & Analysis History</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Permanently erase your saved repository audits, architecture graphs, and auth credentials.
                </p>
              </div>

              <Button
                variant="destructive"
                size="sm"
                className="whitespace-nowrap font-semibold"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
                    logout();
                  }
                }}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;
