import { useEffect, useRef, useState } from "react";
import { IconAlert, IconArrowRight, IconGithub, IconLoader } from "../ui/Icons";
import { DEFAULT_DEMO_REPO, parseRepoInput } from "./data";

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
      setError("Enter a public GitHub repo, e.g. github.com/facebook/react");
      return;
    }

    setError(null);
    setSubmitting(true);
    timeoutRef.current = setTimeout(() => {
      setSubmitting(false);
      onAnalyze(`${parsed.owner}/${parsed.repo}`);
    }, 650);
  };

  const fillExample = () => {
    setValue(`github.com/${DEFAULT_DEMO_REPO}`);
    setError(null);
  };

  return (
    <div className="max-w-160 mx-auto">
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col sm:flex-row items-stretch gap-2.5 p-2.5 rounded-2xl bg-white/3 border transition-shadow duration-200 ${
          error ? "border-danger/60" : "border-white/10 focus-within:border-accent-dark/60 focus-within:shadow-[0_0_0_4px_rgb(192_132_252/0.12)]"
        }`}
      >
        <div className="flex items-center gap-2.5 flex-1 px-3.5">
          <IconGithub className="text-text-dark shrink-0" width={18} height={18} />
          <input
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="github.com/owner/repo"
            value={value}
            disabled={submitting}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            aria-label="GitHub repository URL"
            aria-invalid={Boolean(error)}
            className="w-full bg-transparent border-0 outline-none py-2.5 text-[15px] text-heading-dark placeholder:text-text-dark/60 [font:inherit]"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !value.trim()}
          className="group shrink-0 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-accent-dark text-[#0b0710] font-medium text-[15px] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap"
        >
          {submitting ? (
            <>
              <IconLoader width={16} height={16} />
              Analyzing…
            </>
          ) : (
            <>
              Analyze Repo
              <IconArrowRight width={16} height={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-3 text-[13px] text-text-dark">
        {error ? (
          <span className="flex items-center gap-1.5 text-danger" role="alert">
            <IconAlert width={14} height={14} />
            {error}
          </span>
        ) : (
          <span>Public repositories • No cloning required</span>
        )}
        <button
          type="button"
          onClick={fillExample}
          className="text-accent-dark hover:underline underline-offset-2 cursor-pointer bg-transparent border-0 p-0 [font:inherit]"
        >
          Try github.com/{DEFAULT_DEMO_REPO}
        </button>
      </div>
    </div>
  );
}
