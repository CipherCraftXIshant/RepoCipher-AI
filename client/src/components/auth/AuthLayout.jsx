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
    <main onPointerMove={moveScene} className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f7fb] px-4 py-10 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div ref={(node) => { layerRefs.current[0] = node; }} className="absolute -left-32 -top-28 h-[30rem] w-[30rem] rounded-full bg-violet-200/70 blur-[100px] transition-transform duration-300 ease-out" />
        <div ref={(node) => { layerRefs.current[1] = node; }} className="absolute -bottom-40 -right-20 h-[34rem] w-[34rem] rounded-full bg-sky-200/70 blur-[110px] transition-transform duration-300 ease-out" />
        <div ref={(node) => { layerRefs.current[2] = node; }} className="absolute left-[58%] top-[12%] h-44 w-44 rounded-full bg-fuchsia-100/70 blur-[70px] transition-transform duration-300 ease-out" />
        <div className="absolute inset-0 opacity-[0.32] [background-image:radial-gradient(#a5a5b5_0.65px,transparent_0.65px)] [background-size:24px_24px]" />
      </div>

      <section className="relative w-full max-w-[440px]">
        <div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_-34px_rgba(52,48,91,0.32)] backdrop-blur-xl sm:p-9">
          <Link to="/" className="mx-auto inline-flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900 no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20"><Code2 className="h-5 w-5" /></span>
            RepoCipher <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">AI</span>
          </Link>

          <div className="mb-6 mt-8 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><Sparkles className="h-5 w-5" /></div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
          </div>

          {children}
        </div>

        {footer && <div className="mt-5 text-center text-sm text-slate-600">{footer}</div>}
        <div className="mt-5 text-center"><Link to="/" className="text-xs font-medium text-slate-500 no-underline transition-colors hover:text-indigo-700">Back to home</Link></div>
      </section>
    </main>
  );
}
