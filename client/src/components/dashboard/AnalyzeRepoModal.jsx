import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { IconGithub } from "../ui/Icons";
import { useNavigate } from "react-router-dom";
import { parseGithubUrl } from "../../lib/github";

export function AnalyzeRepoModal({ open, onOpenChange, onAnalyze }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const parsed = parseGithubUrl(url);
  const isValid = Boolean(parsed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/facebook/react)");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (onAnalyze) {
        await onAnalyze(url.trim());
      } else {
        navigate(`/app?repo=${encodeURIComponent(url.trim())}`);
      }
      setUrl("");
      onOpenChange(false);
    } catch (err) {
      setError(err.message || "Could not start analysis. Please try again.");
    } finally {
      setLoading(false);
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
        <div className="flex items-center gap-2 mb-1 text-indigo-400">
          <div className="p-2.5 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 shadow-md">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <DialogTitle>Analyze a Repository</DialogTitle>
        <DialogDescription>
          Paste any public GitHub repository URL to generate instant Principal Architect blueprints, code quality audits, and interactive interview simulations.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="github-repo-url"
            className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2"
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
              placeholder="https://github.com/facebook/react or owner/repo"
              className="w-full pl-10 pr-10 py-3 bg-slate-950 hover:bg-slate-900/90 focus:bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              autoFocus
            />
            {url.trim() && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5 font-medium bg-rose-950/60 border border-rose-800/60 p-2.5 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              {error}
            </p>
          )}

          {/* Quick example tags */}
          <div className="mt-4">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">
              Popular architectures to try:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "shadcn/ui", url: "https://github.com/shadcn-ui/ui" },
                { name: "facebook/react", url: "https://github.com/facebook/react" },
                { name: "expressjs/express", url: "https://github.com/expressjs/express" },
                { name: "pallets/flask", url: "https://github.com/pallets/flask" },
              ].map((sample) => (
                <button
                  type="button"
                  key={sample.name}
                  onClick={() => handleQuickSelect(sample.url)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium transition-all cursor-pointer"
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
            className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            size="md"
            disabled={!isValid || loading}
            loading={loading}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            Analyze Repository
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
