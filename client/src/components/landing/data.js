import {
  IconBox,
  IconBranch,
  IconDatabase,
  IconFile,
  IconGithub,
  IconLayers,
  IconMessage,
  IconServer,
  IconSparkle,
} from "../ui/Icons";

export const DEFAULT_DEMO_REPO = "facebook/react";

/** Sequential steps shown during the simulated "analyzing" effect. */
export const ANALYSIS_STEPS = [
  "Reading repository structure",
  "Detecting framework & language",
  "Mapping dependencies",
  "Finding entry points",
  "Generating architecture",
  "Preparing onboarding guide",
];

export const STACK_BADGES = [
  { name: "React", role: "UI layer" },
  { name: "TypeScript", role: "Language" },
  { name: "Node.js", role: "Runtime" },
  { name: "PostgreSQL", role: "Database" },
  { name: "Redis", role: "Cache / queue" },
];

export const ARCHITECTURE_FLOW = ["Browser", "API Gateway", "Services", "Database"];

export const ENTRY_POINTS = [
  { path: "src/main.tsx", note: "Boots the app, mounts React, and wires the router." },
  { path: "src/App.tsx", note: "Top-level layout, global providers, and the route table." },
  { path: "server/index.ts", note: "HTTP entry point — middleware and route mounting." },
];

export const DEPENDENCIES = [
  { name: "react", version: "19.2.8", role: "UI rendering" },
  { name: "express", version: "4.21.2", role: "HTTP server" },
  { name: "mongoose", version: "8.9.5", role: "Database ODM" },
  { name: "bullmq", version: "5.34.4", role: "Background job queue" },
  { name: "socket.io", version: "4.8.1", role: "Realtime updates" },
];

export const AI_SUMMARY_PARAGRAPHS = [
  "This is a full-stack TypeScript application with a React client and an Express API server, backed by PostgreSQL for persistence and Redis for caching and background jobs.",
  "The client is organized by feature under src/, with a thin services layer that isolates API calls from UI components. The server follows a controller → service → model structure, with route handlers kept intentionally slim.",
  "Start reading at src/App.tsx on the client and server/index.ts on the server — together they show every route the app exposes.",
];

/** Tabbed insight data shared by the analysis demo and the findings section. */
export const INSIGHT_TABS = [
  {
    id: "stack",
    label: "Stack Detection",
    icon: IconBranch,
    description: "Frameworks, languages, and infrastructure detected from manifests and config files.",
  },
  {
    id: "architecture",
    label: "Architecture",
    icon: IconLayers,
    description: "How requests flow through the system, from client to data layer.",
  },
  {
    id: "entry-points",
    label: "Entry Points",
    icon: IconFile,
    description: "The handful of files that show you how the whole app boots.",
  },
  {
    id: "dependencies",
    label: "Dependencies",
    icon: IconBox,
    description: "Key third-party packages and the role each one plays.",
  },
  {
    id: "summary",
    label: "AI Summary",
    icon: IconSparkle,
    description: "A plain-English explanation of what this repository does and how it's put together.",
  },
];

export const FILE_TREE = [
  {
    type: "dir",
    name: "src",
    note: "Client application source.",
    children: [
      { type: "dir", name: "components", note: "Reusable UI building blocks shared across pages." },
      { type: "dir", name: "services", note: "API calls and business logic, isolated from the UI." },
      { type: "dir", name: "hooks", note: "Shared stateful logic reused across components." },
      { type: "dir", name: "pages", note: "Top-level route components, one per URL." },
      { type: "dir", name: "utils", note: "Small, pure helper functions with no side effects." },
      { type: "file", name: "App.tsx", note: "Application entry point. Initializes routing and global providers." },
    ],
  },
  {
    type: "dir",
    name: "server",
    note: "API and background workers.",
    children: [
      { type: "dir", name: "routes", note: "Maps URLs to controller functions." },
      { type: "dir", name: "controllers", note: "Request/response handling — thin by design." },
      { type: "dir", name: "services", note: "Business logic, external API calls, and queue producers." },
      { type: "dir", name: "models", note: "Database schemas and query helpers." },
      { type: "file", name: "index.ts", note: "HTTP entry point. Wires middleware, routes, and error handling." },
    ],
  },
];

export const CHAT_EXCHANGE = {
  question: "Where does authentication happen?",
  answer:
    "Authentication is handled in two places: middleware that verifies JWTs on protected routes, and an auth service that issues and refreshes tokens on login.",
  files: ["src/middleware/auth.ts", "src/services/authService.ts"],
};

export const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Paste your repository",
    body: "Drop in any public GitHub URL — owner/repo or a full link. No cloning, no setup.",
    icon: IconGithub,
  },
  {
    n: "02",
    title: "RepoCipher understands it",
    body: "We pull the file tree and README, detect the stack, and map how the pieces connect.",
    icon: IconSparkle,
  },
  {
    n: "03",
    title: "Explore your codebase with AI",
    body: "Get an onboarding doc, key entry points, and a chat interface to ask follow-up questions.",
    icon: IconMessage,
  },
];

export const TRUST_METRICS = [
  { value: "90 sec", label: "Average first read", note: "Time from URL to onboarding doc, demo runs." },
  { value: "100%", label: "Structure coverage", note: "Full file tree pulled in a single pass." },
  { value: "0 min", label: "Local setup required", note: "No cloning, no environment to configure." },
];

export const NAV_LINKS = [
  { label: "Product", href: "#analysis-demo" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Docs", href: "#preview" },
];

export const PRODUCT_SIDEBAR = [
  { id: "overview", label: "Overview", icon: IconSparkle },
  { id: "architecture", label: "Architecture", icon: IconLayers },
  { id: "files", label: "Files", icon: IconFile },
  { id: "dependencies", label: "Dependencies", icon: IconBox },
  { id: "chat", label: "AI Chat", icon: IconMessage },
];

export const ARCHITECTURE_NODES = {
  client: { label: "Client", icon: IconGithub },
  api: { label: "API Server", icon: IconServer },
  serviceA: { label: "Auth Service", icon: IconLayers },
  serviceB: { label: "Ingestion Service", icon: IconLayers },
  database: { label: "Database", icon: IconDatabase },
};

/** Very small owner/repo parser — accepts full GitHub URLs or the short form. */
export function parseRepoInput(raw) {
  const value = raw.trim().replace(/\/+$/, "");
  if (!value) return null;

  const urlMatch = value.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)/i);
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] };

  const shortMatch = value.match(/^([\w.-]+)\/([\w.-]+)$/);
  if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] };

  return null;
}
