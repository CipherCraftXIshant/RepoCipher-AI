import { useState } from "react";
import { IconFile, IconFolder } from "../ui/Icons";
import { FILE_TREE } from "./data";

function TreeRow({ item, depth, active, onSelect }) {
  const Icon = item.type === "dir" ? IconFolder : IconFile;
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      style={{ paddingLeft: `${depth * 1.1 + 0.75}rem` }}
      className={`w-full flex items-center gap-2 py-1.5 pr-2 rounded-lg text-left text-[13px] font-mono transition-colors duration-150 cursor-pointer ${
        active
          ? "bg-accent-dark/15 text-accent-dark"
          : "text-text-dark hover:text-heading-dark hover:bg-white/5"
      }`}
    >
      <Icon width={14} height={14} className="shrink-0" />
      <span className="truncate">
        {item.name}
        {item.type === "dir" && "/"}
      </span>
    </button>
  );
}

export function FileTreeExplorer() {
  const [selected, setSelected] = useState(FILE_TREE[0].children.find((c) => c.type === "file") ?? FILE_TREE[0]);

  return (
    <div className="grid md:grid-cols-[1fr_1.1fr] gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
      <div className="flex flex-col gap-1" role="tree" aria-label="Repository file tree">
        {FILE_TREE.map((group) => (
          <div key={group.name}>
            <TreeRow item={group} depth={0} active={selected.name === group.name} onSelect={setSelected} />
            <div className="ml-3 border-l border-white/10">
              {group.children.map((item) => (
                <TreeRow key={item.name} item={item} depth={1} active={selected.name === item.name} onSelect={setSelected} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 flex flex-col justify-center">
        <code key={selected.name} className="fade-in text-accent-dark font-mono text-sm">
          {selected.name}
          {selected.type === "dir" && "/"}
        </code>
        <p key={`${selected.name}-note`} className="fade-in text-text-dark text-[15px] mt-3 leading-relaxed">
          {selected.note}
        </p>
      </div>
    </div>
  );
}
