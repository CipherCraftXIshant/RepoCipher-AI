import { Button } from "../ui/Button";

export function FinalCTA({ isAuthenticated }) {
  return (
    <div className="relative text-center py-16 sm:py-20 px-6 rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-90 rounded-full bg-accent-dark/15 blur-[110px]"
      />
      <div className="relative">
        <h2 className="text-2xl sm:text-4xl font-medium text-heading-dark tracking-[-0.8px] mb-3 text-balance">
          Stop onboarding by reading every file.
        </h2>
        <p className="text-text-dark text-lg mb-8">Let AI explain the codebase first.</p>
        <Button to={isAuthenticated ? "/app" : "/signup"} variant="primary" size="lg" showArrow>
          Analyze a repository
        </Button>
      </div>
    </div>
  );
}
