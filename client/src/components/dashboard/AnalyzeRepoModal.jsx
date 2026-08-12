import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { IconGithub } from "../ui/Icons";
import { useNavigate } from "react-router-dom";

export function AnalyzeRepoModal({ open, onOpenChange, onAnalyze }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Basic validation for GitHub URL or owner/repo format
  const isValidGitHubUrl = (input) => {
    const trimmed = input.trim();
    if (!trimmed) return false;
    // matches https://github.com/owner/repo or github.com/owner/repo or owner/repo
    const fullUrlRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\/.*)?$/;
    const shorthandRegex = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
    return fullUrlRegex.test(trimmed) || shorthandRegex.test(trimmed);
  };

  const isValid = isValidGitHubUrl(url);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/facebook/react)");
      return;
    }

    setError("");
    setLoading(true);

    if (onAnalyze) {
      onAnalyze(url);
      setLoading(false);
      setUrl("");
      onOpenChange(false);
    } else {
      setTimeout(() => {
        setLoading(false);
        onOpenChange(false);
        navigate(`/app?repo=${encodeURIComponent(url.trim())}`);
      }, 400);
    }
  };

  const handleQuickSelect = (exampleUrl) => {
    setUrl(exampleUrl);
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose onClick={() => onOpenChange(false)} />
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1 text-primary-600">
          <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
        <DialogTitle>Analyze a Repository</DialogTitle>
        <DialogDescription>
          Paste any public GitHub repo to get AI architecture breakdowns, health audits, and interactive chat.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="github-repo-url"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            GitHub Repository URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IconGithub className="w-4 h-4" />
            </div>
            <input
              id="github-repo-url"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder="https://github.com/user/repository"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              autoFocus
            />
            {url.trim() && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </p>
          )}

          {/* Quick example tags */}
          <div className="mt-3">
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Popular samples to try:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: "shadcn/ui", url: "https://github.com/shadcn-ui/ui" },
                { name: "facebook/react", url: "https://github.com/facebook/react" },
                { name: "expressjs/express", url: "https://github.com/expressjs/express" },
              ].map((sample) => (
                <button
                  type="button"
                  key={sample.name}
                  onClick={() => handleQuickSelect(sample.url)}
                  className="text-[11px] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors cursor-pointer"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            size="md"
            disabled={!isValid || loading}
            loading={loading}
          >
            <Sparkles className="w-4 h-4" />
            Analyze Repository
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
