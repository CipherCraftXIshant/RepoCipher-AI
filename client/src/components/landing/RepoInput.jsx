import { useEffect, useRef, useState } from "react";
import { IconAlert, IconArrowRight, IconGithub, IconLoader } from "../ui/Icons";
import { DEFAULT_DEMO_REPO, parseRepoInput } from "./data";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function RepoInput({ onAnalyze }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    const parsed = parseRepoInput(value);
    if (!parsed) {
      setError("Enter a valid public GitHub repo, e.g. github.com/facebook/react");
      return;
    }

    setError(null);
    setSubmitting(true);
    timeoutRef.current = setTimeout(() => {
      setSubmitting(false);
      onAnalyze(`${parsed.owner}/${parsed.repo}`);
    }, 650);
  };

  const fillExample = (repo = DEFAULT_DEMO_REPO) => {
    setValue(`github.com/${repo}`);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900/90 border transition-all duration-200 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 ${
          error
            ? "border-rose-400 ring-2 ring-rose-400/20"
            : "border-slate-200 dark:border-slate-800 focus-within:border-primary-500 dark:focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/15"
        }`}
      >
        <div className="flex items-center gap-3 flex-1 px-4 py-1">
          <IconGithub className="text-slate-400 dark:text-slate-500 shrink-0" width={20} height={20} />
          <input
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="github.com/owner/repo or paste URL..."
            value={value}
            disabled={submitting}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            aria-label="GitHub repository URL"
            aria-invalid={Boolean(error)}
            className="w-full bg-transparent border-0 outline-none py-2 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !value.trim()}
          className="group shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all duration-150 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap"
        >
          {submitting ? (
            <>
              <IconLoader width={16} height={16} />
              Analyzing Repo...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze Repo
              <IconArrowRight width={16} height={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Helper / Popular links */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        {error ? (
          <span className="flex items-center gap-1.5 text-rose-500 font-semibold" role="alert">
            <IconAlert width={14} height={14} />
            {error}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Instant AI onboarding breakdown
          </span>
        )}

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Try:</span>
          {[
            { label: "facebook/react", repo: "facebook/react" },
            { label: "vercel/next.js", repo: "vercel/next.js" },
            { label: "expressjs/express", repo: "expressjs/express" },
          ].map((item) => (
            <button
              key={item.repo}
              type="button"
              onClick={() => fillExample(item.repo)}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
