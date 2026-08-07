import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { AnalysisDemo } from "../components/landing/AnalysisDemo";
import { ArchitectureShowcase } from "../components/landing/ArchitectureShowcase";
import { FileTreeExplorer } from "../components/landing/FileTreeExplorer";
import { FinalCTA } from "../components/landing/FinalCTA";
import { FindingsTabs } from "../components/landing/FindingsTabs";
import { Footer } from "../components/landing/Footer";
import { Hero } from "../components/landing/Hero";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Navbar } from "../components/landing/Navbar";
import { ProductPreview } from "../components/landing/ProductPreview";
import { TrustMetrics } from "../components/landing/TrustMetrics";

export function LandingPage() {
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";
  const [trigger, setTrigger] = useState(null);

  const handleAnalyze = (repo) => {
    setTrigger((prev) => ({ repo, key: (prev?.key ?? 0) + 1 }));
    document.querySelector("#analysis-demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-bg-dark text-text-dark min-h-svh relative">
      <div aria-hidden="true" className="fixed inset-0 bg-noise pointer-events-none" />

      <Navbar isAuthenticated={isAuthenticated} />

      <main className="relative">
        <Hero onAnalyze={handleAnalyze} />

        <section className="px-6 pb-24 sm:pb-28">
          <div className="max-w-220 mx-auto">
            <Reveal>
              <AnalysisDemo trigger={trigger} />
            </Reveal>
          </div>
        </section>

        <section className="px-6 pb-24 sm:pb-28 bg-dot-grid mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]">
          <div className="max-w-220 mx-auto">
            <Reveal>
              <SectionHeading
                eyebrow="See it work"
                title="Every file, explained on click"
                subtitle="Explore a realistic repository tree — select any file or folder to see what RepoCipher would tell you about it."
              />
            </Reveal>
            <Reveal delay={80}>
              <FileTreeExplorer />
            </Reveal>
          </div>
        </section>

        <section id="features" className="px-6 pb-24 sm:pb-28">
          <div className="max-w-220 mx-auto">
            <Reveal>
              <SectionHeading
                eyebrow="What RepoCipher finds"
                title="A full picture, not just a summary"
                subtitle="Five categories of insight, generated automatically from the repository's structure and code."
              />
            </Reveal>
            <Reveal delay={80}>
              <FindingsTabs />
            </Reveal>
          </div>
        </section>

        <section className="px-6 pb-24 sm:pb-28">
          <div className="max-w-220 mx-auto">
            <Reveal>
              <SectionHeading
                eyebrow="Architecture"
                title="How the pieces connect"
                subtitle="RepoCipher traces the request path — from client to database — so you don't have to reverse-engineer it by hand."
              />
            </Reveal>
            <Reveal delay={80}>
              <ArchitectureShowcase />
            </Reveal>
          </div>
        </section>

        <section id="preview" className="px-6 pb-24 sm:pb-28">
          <div className="max-w-220 mx-auto">
            <Reveal>
              <SectionHeading
                eyebrow="Inside the product"
                title="Your repository, as a dashboard"
                subtitle="Overview, architecture, files, dependencies, and an AI chat that already knows the codebase."
              />
            </Reveal>
            <Reveal delay={80}>
              <ProductPreview />
            </Reveal>
          </div>
        </section>

        <section id="how-it-works" className="px-6 pb-24 sm:pb-28">
          <div className="max-w-220 mx-auto">
            <Reveal>
              <SectionHeading eyebrow="How it works" title="From URL to understanding, in three steps" />
            </Reveal>
            <HowItWorks />
          </div>
        </section>

        <section className="px-6 pb-24 sm:pb-28">
          <div className="max-w-220 mx-auto">
            <TrustMetrics />
          </div>
        </section>

        <section className="px-6 pb-24 sm:pb-28">
          <div className="max-w-220 mx-auto">
            <Reveal>
              <FinalCTA isAuthenticated={isAuthenticated} />
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
