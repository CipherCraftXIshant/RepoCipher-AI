const { GoogleGenAI, Type } = require("@google/genai");
const { env } = require("../config/env");

const client = new GoogleGenAI({ apiKey: env.geminiApiKey });

const ANALYSIS_SYSTEM_INSTRUCTION =
  "You are a senior software engineer producing a detailed onboarding dashboard for a GitHub repository. " +
  "Given the repository metadata, language breakdown, file tree, README, and root manifest file, analyze the " +
  "project in depth: what it does, its tech stack, its architecture and request/data flow, its key entry " +
  "point files, its dependencies, its important directories (including notable individual files within each), " +
  "how to set it up and run it locally, and any code-quality or risk observations (e.g. missing tests, missing " +
  "CI, thin error handling, outdated-looking dependencies, unclear structure). " +
  "Be concise and factual — do not speculate about anything not evidenced by the provided context. " +
  "Only report dependency names and versions that actually appear in the provided manifest file; do not " +
  "invent version numbers. Only raise a risk if it is actually evidenced by the file tree, README, or manifest — " +
  "an empty risks list is fine for a well-maintained project.";

const ANALYSIS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overview: {
      type: Type.STRING,
      description: "2-4 paragraph plain-English explanation of what the project does and how it's put together, in markdown.",
    },
    stack: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
        },
        required: ["name", "role"],
      },
    },
    architecture: {
      type: Type.ARRAY,
      description: "Ordered list of components describing the request/data flow, e.g. Browser -> API -> Service -> Database.",
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["label", "description"],
      },
    },
    entryPoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          path: { type: Type.STRING },
          note: { type: Type.STRING },
        },
        required: ["path", "note"],
      },
    },
    dependencies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          version: { type: Type.STRING },
          role: { type: Type.STRING },
        },
        required: ["name", "role"],
      },
    },
    directories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          path: { type: Type.STRING },
          note: { type: Type.STRING },
          files: {
            type: Type.ARRAY,
            description: "Notable individual files inside this directory worth calling out, if any.",
            items: {
              type: Type.OBJECT,
              properties: {
                path: { type: Type.STRING },
                note: { type: Type.STRING },
              },
              required: ["path", "note"],
            },
          },
        },
        required: ["path", "note"],
      },
    },
    setup: {
      type: Type.STRING,
      description: "Install and run instructions in markdown, derived from the README and manifest scripts.",
    },
    risks: {
      type: Type.ARRAY,
      description: "Code quality, testing, or security observations grounded in the provided context. Empty if nothing stands out.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          severity: { type: Type.STRING, description: "One of: info, warning, risk." },
          description: { type: Type.STRING },
        },
        required: ["title", "severity", "description"],
      },
    },
  },
  required: ["overview", "stack", "architecture", "entryPoints", "dependencies", "directories", "setup", "risks"],
  propertyOrdering: ["overview", "stack", "architecture", "entryPoints", "dependencies", "directories", "setup", "risks"],
};

function buildRepoContext({ metadata, filePaths, readme, languages, manifest }) {
  const treeListing = filePaths.slice(0, 1500).join("\n");
  const truncationNote =
    filePaths.length > 1500 ? `\n... and ${filePaths.length - 1500} more files` : "";

  const languageListing = languages && Object.keys(languages).length
    ? Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .map(([name, bytes]) => `${name}: ${bytes}`)
        .join(", ")
    : null;

  return [
    `Repository: ${metadata.fullName}`,
    metadata.description ? `Description: ${metadata.description}` : null,
    `Default branch: ${metadata.defaultBranch}`,
    languageListing ? `\nLanguages (bytes by language):\n${languageListing}` : null,
    "",
    "File tree:",
    treeListing + truncationNote,
    readme ? `\nREADME contents:\n${readme.slice(0, 12000)}` : null,
    manifest ? `\nRoot manifest file contents:\n${manifest.slice(0, 4000)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function analyzeRepository(input) {
  const userContent = buildRepoContext(input);

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userContent,
    config: {
      systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
      maxOutputTokens: 12288,
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_RESPONSE_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini response contained no text content");
  }
  return JSON.parse(text);
}

const CHAT_SYSTEM_INSTRUCTION =
  "You are RepoCipher's assistant for a specific GitHub repository. Answer the user's questions using the " +
  "analysis context provided below, which was generated from the repository's real file tree, README, manifest, " +
  "and metadata. If the answer isn't covered by that context, say you don't have that information rather than " +
  "guessing. Keep answers focused and use markdown (code spans, short lists) where it helps readability.";

function buildAnalysisContext({ metadata, analysis }) {
  const lines = [
    `Repository: ${metadata.fullName}`,
    metadata.description ? `Description: ${metadata.description}` : null,
    "",
    "=== Analysis ===",
    `Overview:\n${analysis.overview ?? "N/A"}`,
    analysis.stack?.length ? `\nStack:\n${analysis.stack.map((s) => `- ${s.name}: ${s.role}`).join("\n")}` : null,
    analysis.architecture?.length
      ? `\nArchitecture flow:\n${analysis.architecture.map((a) => `- ${a.label}: ${a.description}`).join("\n")}`
      : null,
    analysis.entryPoints?.length
      ? `\nEntry points:\n${analysis.entryPoints.map((e) => `- ${e.path}: ${e.note}`).join("\n")}`
      : null,
    analysis.dependencies?.length
      ? `\nDependencies:\n${analysis.dependencies.map((d) => `- ${d.name}${d.version ? ` (${d.version})` : ""}: ${d.role}`).join("\n")}`
      : null,
    analysis.directories?.length
      ? `\nKey directories:\n${analysis.directories
          .map((d) => `- ${d.path}: ${d.note}${d.files?.length ? `\n  ${d.files.map((f) => `${f.path}: ${f.note}`).join("\n  ")}` : ""}`)
          .join("\n")}`
      : null,
    analysis.setup ? `\nSetup:\n${analysis.setup}` : null,
    analysis.risks?.length
      ? `\nKnown risks/notes:\n${analysis.risks.map((r) => `- [${r.severity}] ${r.title}: ${r.description}`).join("\n")}`
      : null,
  ];
  return lines.filter(Boolean).join("\n");
}

async function chatAboutRepository({ metadata, analysis, history, message }) {
  const contextPreamble = buildAnalysisContext({ metadata, analysis });

  const contents = [
    { role: "user", parts: [{ text: `Repository context for this conversation:\n\n${contextPreamble}` }] },
    { role: "model", parts: [{ text: "Understood — I'll answer using that context." }] },
    ...history.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
    { role: "user", parts: [{ text: message }] },
  ];

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      maxOutputTokens: 2048,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini response contained no text content");
  }
  return text;
}

const INTERVIEW_SYSTEM_INSTRUCTION =
  "You are a senior engineer preparing someone to be interviewed about this specific codebase — e.g. before a " +
  "technical interview at the company that owns it, or before defending it as a project. Using the analysis " +
  "context provided, write realistic interview questions a skilled interviewer would ask about this repository's " +
  "specific stack, architecture, and design decisions, each with a concise model answer grounded in the given " +
  "context. Avoid generic textbook questions unrelated to what's actually in this repo. Cover a mix of " +
  "categories: Architecture, Stack & Tooling, Code Quality & Testing, and Trade-offs & Decisions.";

const INTERVIEW_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "One of: Architecture, Stack & Tooling, Code Quality & Testing, Trade-offs & Decisions." },
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ["category", "question", "answer"],
      },
    },
  },
  required: ["questions"],
};

async function generateInterviewQuestions({ metadata, analysis }) {
  const contextPreamble = buildAnalysisContext({ metadata, analysis });

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Repository context:\n\n${contextPreamble}`,
    config: {
      systemInstruction: INTERVIEW_SYSTEM_INSTRUCTION,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
      responseSchema: INTERVIEW_RESPONSE_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini response contained no text content");
  }
  return JSON.parse(text).questions;
}

module.exports = { analyzeRepository, chatAboutRepository, generateInterviewQuestions };
