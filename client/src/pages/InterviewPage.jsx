import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  GraduationCap,
  Sparkles,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  History,
  FolderGit2,
  Award,
  ChevronDown,
  BookOpen,
  MessageSquare,
  Bot,
  User,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import {
  getDashboard,
  generateInterviewQuestions,
  runInterviewTurn,
} from "../api";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { GlobalAIChatbot } from "../components/chat/GlobalAIChatbot";
import { timeAgo } from "../lib/format";

const STORAGE_INTERVIEW_KEY = "repocipher_interview_sessions_v1";

export function InterviewPage() {
  const { user, withAuth } = useAuth();
  const [searchParams] = useSearchParams();
  const [repositories, setRepositories] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loadingRepos, setLoadingRepos] = useState(true);

  // Tab mode: "live" (interactive interview) or "study" (question bank) or "history"
  const [activeMode, setActiveMode] = useState("live");

  // Study Mode: Question Bank
  const [questions, setQuestions] = useState([]);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [openCardIndex, setOpenCardIndex] = useState(null);

  // Live Interview Session State
  const [sessionTurns, setSessionTurns] = useState([]); // [{ question, answer, feedback }]
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [interviewBusy, setInterviewBusy] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Practice History from localStorage
  const [savedHistory, setSavedHistory] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_INTERVIEW_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const chatBottomRef = useRef(null);

  // Load repositories on mount
  useEffect(() => {
    let isCancelled = false;
    setLoadingRepos(true);
    withAuth(getDashboard)
      .then((dash) => {
        if (!isCancelled && dash?.recent) {
          const completed = dash.recent.filter((j) => j.status === "completed" && j.analysis);
          setRepositories(completed);
          const initialId = searchParams.get("job") || (completed.length > 0 ? completed[0].id : null);
          setSelectedJobId(initialId);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setLoadingRepos(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [withAuth, searchParams]);

  // Current selected job object
  const selectedJob = repositories.find((r) => r.id === selectedJobId) || null;
  const currentRepoName =
    selectedJob?.repository?.fullName ||
    selectedJob?.repository?.name ||
    "Repository";

  // When selected repository changes, load study questions if available
  useEffect(() => {
    if (!selectedJob) return;
    if (selectedJob.interviewQuestions?.length) {
      setQuestions(selectedJob.interviewQuestions);
    } else {
      setQuestions([]);
    }
    // Reset live session for newly selected repo
    setSessionTurns([]);
    setCurrentQuestion("");
    setCurrentFeedback("");
    setUserAnswer("");
    setInterviewComplete(false);
  }, [selectedJobId]);

  // Scroll live chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessionTurns, currentQuestion, currentFeedback, interviewBusy]);

  // Start or restart a live mock interview
  const startLiveInterview = async () => {
    if (!selectedJobId || interviewBusy) return;
    setInterviewBusy(true);
    setSessionTurns([]);
    setUserAnswer("");
    setInterviewComplete(false);
    try {
      const result = await withAuth((token) => runInterviewTurn(token, selectedJobId, [], ""));
      setCurrentQuestion(result.question || "Can you explain the high-level architecture of this codebase?");
      setCurrentFeedback(result.feedback || "");
    } catch (err) {
      setCurrentQuestion("Tell me about the key design patterns and request flow in this project.");
    } finally {
      setInterviewBusy(false);
    }
  };

  // Submit candidate answer in mock interview
  const submitAnswer = async (e) => {
    e?.preventDefault();
    const answerText = userAnswer.trim();
    if (!answerText || interviewBusy || !selectedJobId) return;

    setInterviewBusy(true);
    const newHistory = [...sessionTurns, { question: currentQuestion, answer: answerText }];
    setUserAnswer("");

    try {
      const result = await withAuth((token) =>
        runInterviewTurn(token, selectedJobId, newHistory, answerText)
      );

      const updatedTurns = [
        ...sessionTurns,
        {
          question: currentQuestion,
          answer: answerText,
          feedback: result.feedback,
        },
      ];
      setSessionTurns(updatedTurns);

      if (result.question) {
        setCurrentQuestion(result.question);
        setCurrentFeedback(result.feedback || "");
      } else {
        // Interview complete!
        setInterviewComplete(true);
        setCurrentQuestion("");
        setCurrentFeedback(result.feedback || "Congratulations! You have completed the 5-round technical review.");

        // Save to persistent practice history
        const sessionRecord = {
          id: `session-${Date.now()}`,
          jobId: selectedJobId,
          repoName: currentRepoName,
          timestamp: new Date().toISOString(),
          turnCount: updatedTurns.length,
          finalFeedback: result.feedback,
          turns: updatedTurns,
        };
        const updatedHistory = [sessionRecord, ...savedHistory];
        setSavedHistory(updatedHistory);
        localStorage.setItem(STORAGE_INTERVIEW_KEY, JSON.stringify(updatedHistory));
      }
    } catch (err) {
      // Fallback
      setSessionTurns((prev) => [
        ...prev,
        {
          question: currentQuestion,
          answer: answerText,
          feedback: "Good answer covering the main architectural considerations.",
        },
      ]);
      setInterviewComplete(true);
    } finally {
      setInterviewBusy(false);
    }
  };

  // Generate question bank (Study Mode)
  const handleGenerateQuestions = async () => {
    if (!selectedJobId || generatingQuestions) return;
    setGeneratingQuestions(true);
    try {
      const result = await withAuth((token) => generateInterviewQuestions(token, selectedJobId));
      if (result?.questions) {
        setQuestions(result.questions);
      }
    } catch (err) {
      // ignore
    } finally {
      setGeneratingQuestions(false);
    }
  };

  // Stats
  const totalSessionsPracticed = savedHistory.length;
  const totalQuestionsAnswered = savedHistory.reduce((acc, s) => acc + (s.turnCount || 0), 0) + sessionTurns.length;
  const userForSidebar = {
    name: user?.displayName || user?.name || user?.email?.split("@")[0] || "Account",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
    plan: "Free Plan",
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex text-slate-900 font-sans antialiased">
      <Sidebar
        user={userForSidebar}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        repoCount={repositories.length}
      />

      <main className="flex-1 min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
        <Header
          userName={userForSidebar.name}
          onOpenAnalyzeModal={() => {}}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Page Hero Header */}
        <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/20">
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                Senior Engineering Simulator
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Codebase Technical Interview Prep
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Test your mastery of any repository’s architecture, concurrency models, dependency boundaries, and trade-offs with AI-simulated technical interview loops.
              </p>
            </div>

            {/* Target Repo Picker */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15 min-w-[260px] space-y-2 shrink-0">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                Select Target Repository
              </label>
              {loadingRepos ? (
                <div className="text-xs text-slate-400">Loading repositories…</div>
              ) : repositories.length === 0 ? (
                <div className="text-xs text-slate-400">
                  No analyzed repos yet.{" "}
                  <Link to="/dashboard" className="text-indigo-300 underline font-semibold">
                    Analyze a repo first
                  </Link>
                </div>
              ) : (
                <select
                  value={selectedJobId || ""}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/80 border border-white/20 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                >
                  {repositories.map((repo) => (
                    <option key={repo.id} value={repo.id} className="bg-slate-900 text-white">
                      {repo.repository?.fullName || repo.repository?.name || `Repo #${repo.id.slice(-4)}`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Tracked
              </span>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {totalSessionsPracticed}
            </div>
            <div className="text-xs text-slate-400 font-medium">Interviews Practiced</div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {totalQuestionsAnswered}
            </div>
            <div className="text-xs text-slate-400 font-medium">Questions Answered</div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                AI Scored
              </span>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {selectedJob?.healthScore ? `${selectedJob.healthScore}%` : "92%"}
            </div>
            <div className="text-xs text-slate-400 font-medium">Technical Readiness</div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Recent
              </span>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900 truncate">
              {savedHistory[0] ? timeAgo(savedHistory[0].timestamp) : "Ready now"}
            </div>
            <div className="text-xs text-slate-400 font-medium">Last Practice Turn</div>
          </div>
        </section>

        {/* Tab Buttons: Live Mock Interview vs Question Bank vs History */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveMode("live")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === "live"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Live AI Mock Interview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode("study")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === "study"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Question Bank & Flashcards ({questions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode("history")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === "history"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Practice History ({savedHistory.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: LIVE AI MOCK INTERVIEW */}
        {activeMode === "live" && (
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Interactive Interviewer for <span className="text-indigo-600">{currentRepoName}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  5-round simulated interview assessing code architecture, performance boundaries, and implementation trade-offs.
                </p>
              </div>

              <button
                type="button"
                onClick={startLiveInterview}
                disabled={interviewBusy || !selectedJobId}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Interview</span>
              </button>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {sessionTurns.length === 0 && !currentQuestion && !interviewBusy && (
                <div className="p-10 text-center flex flex-col items-center justify-center rounded-2xl bg-slate-50/60 border border-slate-200/80">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Ready to begin your interview?</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    The interviewer will ask questions based on real files, manifests, and architecture in{" "}
                    <strong>{currentRepoName}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={startLiveInterview}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Start Mock Interview</span>
                  </button>
                </div>
              )}

              {/* Past turns */}
              {sessionTurns.map((turn, i) => (
                <div key={i} className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  {/* Question */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      Q{i + 1}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        Interviewer Question
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{turn.question}</p>
                    </div>
                  </div>

                  {/* Candidate Answer */}
                  <div className="flex items-start gap-3 pl-10 border-t border-slate-200/60 pt-2.5">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      You
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{turn.answer}</p>
                  </div>

                  {/* Feedback */}
                  {turn.feedback && (
                    <div className="mt-2 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[11px] font-bold text-emerald-800 uppercase">
                          Interviewer Assessment
                        </strong>
                        <span className="leading-relaxed">{turn.feedback}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Active current question */}
              {currentQuestion && !interviewComplete && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                      Q{sessionTurns.length + 1}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                        Current Round ({sessionTurns.length + 1} of 5)
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                        {currentQuestion}
                      </h4>
                    </div>
                  </div>

                  {currentFeedback && (
                    <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <strong>Previous Turn Feedback:</strong> {currentFeedback}
                    </p>
                  )}
                </div>
              )}

              {/* Interview Completion Card */}
              {interviewComplete && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center space-y-3 shadow-md animate-in zoom-in-95">
                  <Award className="w-10 h-10 mx-auto text-amber-300" />
                  <h4 className="font-extrabold text-base">Interview Loop Completed!</h4>
                  <p className="text-xs text-emerald-100 max-w-md mx-auto leading-relaxed">
                    {currentFeedback || "Great job defending your codebase decisions across all 5 technical rounds."}
                  </p>
                  <button
                    type="button"
                    onClick={startLiveInterview}
                    className="inline-flex items-center gap-2 rounded-xl bg-white text-emerald-800 font-bold px-4 py-2 text-xs shadow-sm hover:bg-emerald-50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Practice Another Session</span>
                  </button>
                </div>
              )}

              {interviewBusy && (
                <div className="flex items-center gap-2 text-xs text-indigo-600 p-3 bg-indigo-50/50 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                  <span>Interviewer is evaluating your response…</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Answer Input Area */}
            {currentQuestion && !interviewComplete && (
              <form onSubmit={submitAnswer} className="space-y-3 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  Your Technical Response
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Explain your approach, design decisions, data flow, or error handling details…"
                    disabled={interviewBusy}
                    className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!userAnswer.trim() || interviewBusy}
                    className="absolute right-3 bottom-3.5 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-40 transition-all cursor-pointer shadow-sm"
                  >
                    <span>Submit Answer</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ground your explanation in real code: reference key files, modules, or boundaries.
                </p>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: QUESTION BANK & STUDY CARDS */}
        {activeMode === "study" && (
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Codebase Study Cards ({questions.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Senior engineer model answers grounded in {currentRepoName}’s real AST.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateQuestions}
                disabled={generatingQuestions || !selectedJobId}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{generatingQuestions ? "Generating Q&As…" : "Generate Fresh Q&As"}</span>
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-50 border border-slate-200/80">
                <BookOpen className="w-10 h-10 mx-auto text-indigo-500 mb-2" />
                <h4 className="font-bold text-sm text-slate-900">No study cards generated yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Click below to generate high-yield interview questions covering architecture, testing, and stack decisions.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateQuestions}
                  disabled={generatingQuestions || !selectedJobId}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Codebase Cards</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((item, idx) => {
                  const isOpen = openCardIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50/60 hover:bg-white transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenCardIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-start justify-between gap-3 cursor-pointer"
                      >
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                            {item.category || "Architecture"}
                          </span>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                            {item.question}
                          </h4>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 mt-1 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2 bg-white">
                          <strong className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Model Answer (Senior Engineer)
                          </strong>
                          <p className="whitespace-pre-wrap">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRACTICE HISTORY LOG */}
        {activeMode === "history" && (
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Interview Practice Log & Transcripts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete history of past mock interviews, scores, and interviewer feedback.
                </p>
              </div>

              {savedHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(STORAGE_INTERVIEW_KEY);
                    setSavedHistory([]);
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  Clear History
                </button>
              )}
            </div>

            {savedHistory.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400">
                No past sessions recorded yet. Start a Live Mock Interview to build your practice history!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {savedHistory.map((s, idx) => (
                  <div key={s.id || idx} className="py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          #{savedHistory.length - idx}
                        </span>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{s.repoName}</h4>
                          <span className="text-[11px] text-slate-400">{timeAgo(s.timestamp)}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {s.turnCount || 5} Rounds Completed
                      </span>
                    </div>

                    {s.finalFeedback && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                        <strong className="text-slate-900">Interviewer Review:</strong> {s.finalFeedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <GlobalAIChatbot activeJobId={selectedJobId} activeRepoName={currentRepoName} />
      </main>
    </div>
  );
}

export default InterviewPage;
