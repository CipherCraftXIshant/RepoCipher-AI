import { useRef } from "react";
import { Link } from "react-router-dom";
import { Code2, Sparkles } from "lucide-react";

export function AuthLayout({ title, description, children, footer }) {
  const layerRefs = useRef([]);

  const moveScene = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    layerRefs.current.forEach((layer, index) => {
      if (!layer) return;
      const depth = (index + 1) * 12;
      layer.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
    });
  };

  return (
    <main onPointerMove={moveScene} className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#080C14] text-white px-4 py-10 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div ref={(node) => { layerRefs.current[0] = node; }} className="absolute -left-32 -top-28 h-[30rem] w-[30rem] rounded-full bg-indigo-600/15 blur-[120px] transition-transform duration-300 ease-out" />
        <div ref={(node) => { layerRefs.current[1] = node; }} className="absolute -bottom-40 -right-20 h-[34rem] w-[34rem] rounded-full bg-violet-600/15 blur-[130px] transition-transform duration-300 ease-out" />
        <div ref={(node) => { layerRefs.current[2] = node; }} className="absolute left-[58%] top-[12%] h-44 w-44 rounded-full bg-sky-600/10 blur-[80px] transition-transform duration-300 ease-out" />
        <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(#6366f1_0.75px,transparent_0.75px)] [background-size:24px_24px]" />
      </div>

      <section className="relative w-full max-w-[440px]">
        <div className="rounded-[1.75rem] border border-slate-800 bg-[#0D1322]/95 p-6 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-9">
          <Link to="/" className="mx-auto inline-flex items-center gap-2.5 text-base font-bold tracking-tight text-white no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25"><Code2 className="h-5 w-5" /></span>
            RepoCipher <span className="rounded-md bg-indigo-950/80 border border-indigo-700/60 px-1.5 py-0.5 text-[10px] font-bold text-indigo-300">AI</span>
          </Link>

          <div className="mb-6 mt-8 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400"><Sparkles className="h-5 w-5" /></div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">{description}</p>
          </div>

          {children}
        </div>

        {footer && <div className="mt-5 text-center text-sm text-slate-400">{footer}</div>}
        <div className="mt-5 text-center"><Link to="/" className="text-xs font-medium text-slate-500 no-underline transition-colors hover:text-indigo-400">Back to home</Link></div>
      </section>
    </main>
  );
}
