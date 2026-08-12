import { useState } from "react";
import { IconClose, IconMessage } from "../ui/Icons";
import { ChatPanel } from "./ChatPanel";

export function ChatWidget({ jobId }) {
  const [open, setOpen] = useState(false);

  if (!jobId) return null;

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[min(24rem,calc(100vw-3rem))] h-[min(37.5rem,calc(100vh-8rem))] rounded-2xl border border-border dark:border-border-dark bg-bg dark:bg-bg-dark shadow-card dark:shadow-card-dark flex flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-border dark:border-border-dark shrink-0">
            <span className="text-sm font-medium text-heading dark:text-heading-dark">Repo Chat</span>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="p-1 rounded-md text-text dark:text-text-dark hover:text-heading dark:hover:text-heading-dark cursor-pointer"
            >
              <IconClose width={16} height={16} />
            </button>
          </div>
          <div className="flex-1 min-h-0 p-4">
            <ChatPanel jobId={jobId} />
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label={open ? "Close repo chat" : "Open repo chat"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center bg-accent dark:bg-accent-dark text-white shadow-card dark:shadow-card-dark cursor-pointer"
      >
        {open ? <IconClose width={22} height={22} /> : <IconMessage width={22} height={22} />}
      </button>
    </>
  );
}
