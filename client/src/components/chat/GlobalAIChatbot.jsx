import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  FolderGit2,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { MARKDOWN_COMPONENTS } from "../../lib/markdown";
import { useAuth } from "../../auth/AuthContext";
import { getChatMessages, sendChatMessage, sendGeneralChatMessage, getDashboard } from "../../api";

const PROMPT_SUGGESTIONS = [
  { icon: "⚡", text: "Explain the architecture & data flow" },
  { icon: "🛡️", text: "What are the key security & code risks?" },
  { icon: "🚀", text: "How do I install & run this locally?" },
  { icon: "🔍", text: "What are the main entry point files?" },
];

export function GlobalAIChatbot({ activeJobId = null, activeRepoName = null }) {
  const { user, withAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(activeJobId);
  const [repositories, setRepositories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync selectedJobId if parent changes it
  useEffect(() => {
    if (activeJobId) {
      setSelectedJobId(activeJobId);
    }
  }, [activeJobId]);

  // Load available repositories from dashboard for context selector
  useEffect(() => {
    if (!user) return;
    let isCancelled = false;
    withAuth(getDashboard)
      .then((dash) => {
        if (!isCancelled && dash?.recent) {
          const completedRepos = dash.recent.filter((j) => j.status === "completed");
          setRepositories(completedRepos);
          // Auto select if none currently selected
          if (!selectedJobId && completedRepos.length > 0) {
            setSelectedJobId(completedRepos[0].id);
          }
        }
      })
      .catch(() => {});
    return () => {
      isCancelled = true;
    };
  }, [user, withAuth]);

  // Load chat history when selectedJobId changes
  useEffect(() => {
    if (!selectedJobId || !user) {
      setMessages([]);
      return;
    }
    let isCancelled = false;
    setLoadingHistory(true);
    withAuth((token) => getChatMessages(token, selectedJobId))
      .then((res) => {
        if (!isCancelled) {
          setMessages(res.messages || []);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setMessages([]);
        }
      })
      .finally(() => {
        if (!isCancelled) setLoadingHistory(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [selectedJobId, user, withAuth]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, sending, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || sending) return;

    setInput("");
    setError(null);
    setSending(true);

    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      if (selectedJobId) {
        const result = await withAuth((token) => sendChatMessage(token, selectedJobId, text));
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          result.userMessage,
          result.modelMessage,
        ]);
      } else {
        const history = messages.map((m) => ({ role: m.role, content: m.content }));
        const result = await withAuth((token) => sendGeneralChatMessage(token, text, history));
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          result.userMessage,
          result.modelMessage,
        ]);
      }
    } catch (err) {
      setError(err?.message || "Failed to get AI response. Please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentRepoObj = repositories.find((r) => r.id === selectedJobId);
  const currentRepoName =
    currentRepoObj?.repository?.fullName ||
    currentRepoObj?.repository?.name ||
    activeRepoName ||
    (selectedJobId ? "Selected Repository" : "General AI Mode");

  return (
    <>
      {/* Floating Circular FAB Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Ask RepoCipher AI Copilot"
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 p-1.5 pl-4 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 border border-white/20 cursor-pointer"
        >
          <span className="text-xs font-semibold tracking-wide pr-1 hidden sm:inline-block">
            Ask AI Copilot
          </span>
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-700" />
          </div>
        </button>
      )}

      {/* Floating AI Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-3xl bg-[#0B0F19] border border-slate-800 shadow-2xl shadow-black/80 overflow-hidden transition-all duration-300 text-white ${
            isExpanded
              ? "w-[94vw] sm:w-[680px] h-[85vh] max-h-[850px]"
              : "w-[92vw] sm:w-[440px] h-[640px] max-h-[calc(100vh-4rem)]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-slate-950 via-[#0B0F19] to-indigo-950 text-white border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-950/50">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0B0F19]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight truncate text-white">RepoCipher AI Copilot</h3>
                  <span className="rounded-full bg-indigo-500/30 text-indigo-300 px-2 py-0.2 text-[10px] font-semibold uppercase tracking-wider">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {selectedJobId ? `Context: ${currentRepoName}` : "General Architecture Copilot"}
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => setIsExpanded((v) => !v)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Switcher Bar */}
          <div className="px-4 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2 text-slate-300 min-w-0">
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="text-[11px] font-medium text-slate-400 shrink-0">
                Target Repo:
              </span>
              <select
                value={selectedJobId || ""}
                onChange={(e) => setSelectedJobId(e.target.value || null)}
                className="bg-transparent font-semibold text-slate-200 focus:outline-none cursor-pointer truncate max-w-[210px]"
              >
                <option value="" className="bg-slate-900 text-white">General AI Mode (No specific repo)</option>
                {repositories.map((repo) => (
                  <option key={repo.id} value={repo.id} className="bg-slate-900 text-white">
                    {repo.repository?.fullName || repo.repository?.name || `Repo #${repo.id.slice(-4)}`}
                  </option>
                ))}
              </select>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="text-[11px] text-slate-400 hover:text-white transition-colors"
                title="Clear current view"
              >
                Clear
              </button>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-[#0B0F19]">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full text-xs text-slate-400 py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading codebase conversation…</span>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full py-6 px-2">
                <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center mb-3 shadow-lg">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  RepoCipher AI Copilot
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  {selectedJobId
                    ? `I have indexed the architecture and file structure for ${currentRepoName}. Ask me anything about its design, endpoints, or setup!`
                    : "Ask me any software architecture, debugging, git, or codebase question!"}
                </p>

                {/* Prompt suggestion pills */}
                <div className="mt-5 w-full space-y-1.5 text-left">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    Suggested Questions
                  </span>
                  {PROMPT_SUGGESTIONS.map((item) => (
                    <button
                      key={item.text}
                      type="button"
                      onClick={() => handleSendMessage(item.text)}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-indigo-950/50 hover:border-indigo-700/60 transition-all text-left text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span className="truncate">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id || i}
                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-xl bg-indigo-950 border border-indigo-800/60 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`relative group max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        isUser
                          ? "bg-indigo-600 text-white rounded-tr-sm shadow-md"
                          : "bg-slate-900/90 text-slate-100 rounded-tl-sm border border-slate-800"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="prose prose-xs prose-invert max-w-none text-slate-100">
                          <ReactMarkdown components={MARKDOWN_COMPONENTS}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}

                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.content, msg.id || i)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                          title="Copy message"
                        >
                          {copiedId === (msg.id || i) ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Sending indicator */}
            {sending && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-950 border border-indigo-800/60 text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                  <span>RepoCipher AI is analyzing…</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0B0F19] border-t border-slate-800 shrink-0"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedJobId
                    ? `Ask anything about ${currentRepoName}…`
                    : "Ask about codebase structure, setup, risks…"
                }
                disabled={sending}
                className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                aria-label="Send message"
                className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all cursor-pointer shrink-0 shadow-sm shadow-indigo-600/30"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-500">
              <span>Press Enter to send</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Powered by Gemini
              </span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default GlobalAIChatbot;
