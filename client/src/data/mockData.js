/**
 * Typed mock dataset for RepoCipher AI Dashboard.
 * Structured cleanly to easily plug into live backend APIs or state stores later.
 */

export const mockUser = {
  name: "Ishant",
  fullName: "Ishant Sharma",
  email: "ishant@repocipher.ai",
  plan: "Free Plan",
  avatarUrl: "",
  role: "Lead Developer",
};

export const mockStats = [
  {
    id: "repos",
    label: "Repositories",
    value: "12",
    numericValue: 12,
    trend: "+2 this week",
    trendType: "positive",
    iconName: "FolderGit2",
  },
  {
    id: "analyses",
    label: "Analyses",
    value: "38",
    numericValue: 38,
    trend: "+14% vs last mo",
    trendType: "positive",
    iconName: "Sparkles",
  },
  {
    id: "chats",
    label: "AI Chats",
    value: "7",
    numericValue: 7,
    trend: "+3 new today",
    trendType: "positive",
    iconName: "MessageSquare",
  },
  {
    id: "health",
    label: "Avg Health",
    value: "84",
    numericValue: 84,
    unit: "%",
    trend: "+5 pts",
    trendType: "positive",
    iconName: "Activity",
  },
];

export const mockContinueRepos = [
  {
    id: "repocipher-ai",
    repoName: "repoCipher-ai",
    fullName: "ciphercraft/repoCipher-ai",
    status: "active",
    statusLabel: "Ready",
    stack: ["React", "Node.js", "MongoDB", "Express"],
    lastViewed: "Authentication Architecture",
    lastAnalyzed: "2 hours ago",
    healthScore: 91,
    stars: 142,
    forks: 18,
    lastBranch: "main",
  },
  {
    id: "ecommerce-api",
    repoName: "ecommerce-api",
    fullName: "ciphercraft/ecommerce-api",
    status: "completed",
    statusLabel: "Ready",
    stack: ["Spring Boot", "PostgreSQL", "Redis", "Docker"],
    lastViewed: "Payment Webhooks & Idempotency",
    lastAnalyzed: "Yesterday",
    healthScore: 86,
    stars: 89,
    forks: 12,
    lastBranch: "dev",
  },
  {
    id: "chat-app",
    repoName: "chat-app",
    fullName: "ciphercraft/chat-app",
    status: "completed",
    statusLabel: "Ready",
    stack: ["MERN", "Socket.IO", "Tailwind", "Vite"],
    lastViewed: "Websocket Connection Resilience",
    lastAnalyzed: "5 days ago",
    healthScore: 76,
    stars: 34,
    forks: 5,
    lastBranch: "main",
  },
];

export const mockRecentRepos = [
  {
    id: "repocipher-ai",
    name: "repoCipher-ai",
    fullName: "ciphercraft/repoCipher-ai",
    stack: ["React", "Node", "Mongo"],
    analyzed: "2 hours ago",
    healthScore: 91,
    status: "Ready",
    visibility: "Public",
  },
  {
    id: "ecommerce-api",
    name: "ecommerce-api",
    fullName: "ciphercraft/ecommerce-api",
    stack: ["Spring Boot", "SQL"],
    analyzed: "Yesterday",
    healthScore: 86,
    status: "Ready",
    visibility: "Public",
  },
  {
    id: "portfolio",
    name: "portfolio",
    fullName: "ciphercraft/portfolio",
    stack: ["Next.js"],
    analyzed: "3 days ago",
    healthScore: 94,
    status: "Ready",
    visibility: "Public",
  },
  {
    id: "chat-app",
    name: "chat-app",
    fullName: "ciphercraft/chat-app",
    stack: ["MERN"],
    analyzed: "5 days ago",
    healthScore: 76,
    status: "Ready",
    visibility: "Public",
  },
  {
    id: "auth-service",
    name: "auth-service",
    fullName: "ciphercraft/auth-service",
    stack: ["FastAPI", "Python", "Redis"],
    analyzed: "1 week ago",
    healthScore: 88,
    status: "Ready",
    visibility: "Private",
  },
];

export const mockActivity = [
  {
    id: "act-1",
    timestamp: "2h ago",
    action: "Analyzed repository",
    repoName: "repoCipher-ai",
    type: "analyze",
  },
  {
    id: "act-2",
    timestamp: "3h ago",
    action: "Generated architecture diagram",
    repoName: "repoCipher-ai",
    type: "diagram",
  },
  {
    id: "act-3",
    timestamp: "4h ago",
    action: "Asked 12 questions in Repo Chat",
    repoName: "repoCipher-ai",
    type: "chat",
  },
  {
    id: "act-4",
    timestamp: "Yesterday",
    action: "Analyzed repository",
    repoName: "ecommerce-api",
    type: "analyze",
  },
  {
    id: "act-5",
    timestamp: "3 days ago",
    action: "Exported onboarding doc",
    repoName: "portfolio",
    type: "export",
  },
];

export const mockInsights = {
  repoName: "repoCipher-ai",
  repoId: "repocipher-ai",
  issueCount: 3,
  headline: "3 potential issues found in repoCipher-ai",
  items: [
    {
      id: "ins-1",
      title: "Missing error handling in 4 API routes",
      severity: "high",
      tag: "Reliability",
      description: "Routes under auth & queue dispatching lack structured catch handlers.",
    },
    {
      id: "ins-2",
      title: "2 environment variables are undocumented",
      severity: "medium",
      tag: "Config",
      description: "JWT_REFRESH_TTL_DAYS and CLOUDFLARE_R2_PUBLIC_URL missing in .env.example.",
    },
    {
      id: "ins-3",
      title: "Product controller has duplicated logic",
      severity: "low",
      tag: "Refactor",
      description: "Query normalization is duplicated across search and filter controllers.",
    },
  ],
};

export const mockHealth = {
  repoName: "repoCipher-ai",
  repoId: "repocipher-ai",
  overallScore: 91,
  grade: "Excellent",
  summary: "High architectural coherence with robust modular separation.",
  subScores: [
    { name: "Architecture", score: 94, max: 100, label: "Excellent" },
    { name: "Code Quality", score: 88, max: 100, label: "Very Good" },
    { name: "Documentation", score: 82, max: 100, label: "Good" },
    { name: "Security", score: 91, max: 100, label: "Strong" },
    { name: "Testing", score: 76, max: 100, label: "Moderate" },
  ],
};
