import { IconFile, IconSparkle } from "../ui/Icons";
import { CHAT_EXCHANGE } from "./data";

export function ChatPreview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <div className="max-w-100 px-4 py-2.5 rounded-2xl rounded-tr-sm bg-accent-dark text-[#0b0710] text-[14px]">
          {CHAT_EXCHANGE.question}
        </div>
      </div>

      <div className="flex justify-start">
        <div className="max-w-110 flex gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 shrink-0 text-accent-dark">
            <IconSparkle width={13} height={13} />
          </span>
          <div className="flex flex-col gap-3">
            <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white/[0.05] border border-white/10 text-[14px] text-heading-dark leading-relaxed">
              {CHAT_EXCHANGE.answer}
            </div>
            <div className="flex flex-wrap gap-2">
              {CHAT_EXCHANGE.files.map((file) => (
                <span
                  key={file}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-[12px] font-mono text-text-dark"
                >
                  <IconFile width={12} height={12} />
                  {file}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="self-start text-[13px] font-medium text-accent-dark hover:underline underline-offset-2 cursor-pointer bg-transparent border-0 p-0"
            >
              View files →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
