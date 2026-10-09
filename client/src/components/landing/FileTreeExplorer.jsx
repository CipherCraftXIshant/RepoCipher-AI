import { useState } from "react";
import { IconFile, IconFolder } from "../ui/Icons";
import { FILE_TREE } from "./data";
import { Code2 } from "lucide-react";

function TreeRow({ item, depth, active, onSelect }) {
  const Icon = item.type === "dir" ? IconFolder : IconFile;
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      style={{ paddingLeft: `${depth * 1.1 + 0.75}rem` }}
      className={`w-full flex items-center gap-2.5 py-2 pr-3 rounded-xl text-left text-xs font-mono transition-all duration-150 cursor-pointer ${
        active
          ? "bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 font-semibold border border-primary-200/80 dark:border-primary-800/80"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
      }`}
    >
      <Icon width={15} height={15} className={`shrink-0 ${active ? "text-primary-600 dark:text-primary-400" : "text-slate-400"}`} />
      <span className="truncate">
        {item.name}
        {item.type === "dir" && "/"}
      </span>
    </button>
  );
}

export function FileTreeExplorer() {
  const [selected, setSelected] = useState(
    FILE_TREE[0].children.find((c) => c.type === "file") ?? FILE_TREE[0]
  );

  return (
    <div className="grid md:grid-cols-[1fr_1.2fr] gap-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50">
      <div className="flex flex-col gap-1.5" role="tree" aria-label="Repository file tree">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 px-2">
          Repository File Tree
        </div>
        {FILE_TREE.map((group) => (
          <div key={group.name} className="space-y-1">
            <TreeRow item={group} depth={0} active={selected.name === group.name} onSelect={setSelected} />
            <div className="ml-3 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1">
              {group.children.map((item) => (
                <TreeRow key={item.name} item={item} depth={1} active={selected.name === item.name} onSelect={setSelected} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 p-6 flex flex-col justify-center space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400">
            <Code2 className="w-4 h-4" />
          </div>
          <code key={selected.name} className="fade-in text-xs sm:text-sm font-bold font-mono text-primary-700 dark:text-primary-300">
            {selected.name}
            {selected.type === "dir" && "/"}
          </code>
        </div>
        <p key={`${selected.name}-note`} className="fade-in text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {selected.note}
        </p>
      </div>
    </div>
  );
}
