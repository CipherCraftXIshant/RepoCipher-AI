import { useEffect, useRef, useState } from "react";
import { getChatMessages, sendChatMessage } from "../../api";
import { useAuth } from "../../auth/AuthContext";
import { MARKDOWN_COMPONENTS } from "../../lib/markdown";
import { IconLoader } from "../ui/Icons";
import ReactMarkdown from "react-markdown";

export function ChatPanel({ jobId }) {
  const { withAuth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingHistory(true);
    withAuth((token) => getChatMessages(token, jobId))
      .then((result) => {
        if (!cancelled) setMessages(result.messages);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load chat history.");
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });
    return () => {
      cancelled = true;
    };
  }, [jobId, withAuth]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setError(null);
    setInput("");
    setMessages((prev) => [...prev, { id: `pending-${Date.now()}`, role: "user", content }]);

    try {
      const result = await withAuth((token) => sendChatMessage(token, jobId, content));
      setMessages((prev) => [...prev.filter((m) => !m.id.startsWith("pending-")), result.userMessage, result.modelMessage]);
    } catch {
      setError("The bot couldn't respond. Please try again.");
      setMessages((prev) => prev.filter((m) => !m.id.startsWith("pending-")));
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">
        {loadingHistory && <p className="text-sm text-text dark:text-text-dark">Loading conversation…</p>}

        {!loadingHistory && messages.length === 0 && (
          <p className="text-sm text-text dark:text-text-dark">
            Ask anything about this repository — architecture, setup, dependencies, anything covered in the analysis.
          </p>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-accent-bg dark:bg-accent-bg-dark border border-accent-border dark:border-accent-border-dark text-heading dark:text-heading-dark"
                  : "border border-border dark:border-border-dark text-text dark:text-text-dark"
              }`}
            >
              {m.role === "model" ? (
                <ReactMarkdown components={MARKDOWN_COMPONENTS}>{m.content}</ReactMarkdown>
              ) : (
                <p>{m.content}</p>
              )}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="rounded-xl px-3.5 py-2.5 border border-border dark:border-border-dark">
              <IconLoader width={14} height={14} className="text-text dark:text-text-dark" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && <p className="text-danger text-sm mt-2">{error}</p>}

      <form className="flex gap-2 mt-4 pt-4 border-t border-border dark:border-border-dark" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask about this repository…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          className="flex-1 [font:inherit] text-sm px-3.5 py-2.5 rounded-lg border border-border dark:border-border-dark bg-bg dark:bg-bg-dark text-heading dark:text-heading-dark focus:outline-none focus:border-accent-border dark:focus:border-accent-border-dark"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="[font:inherit] text-sm px-4 py-2.5 rounded-lg border border-accent-border dark:border-accent-border-dark bg-accent-bg dark:bg-accent-bg-dark text-heading dark:text-heading-dark cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-default"
        >
          Send
        </button>
      </form>
    </div>
  );
}
