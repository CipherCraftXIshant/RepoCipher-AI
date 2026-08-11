const { GoogleGenAI, Type } = require("@google/genai");
const { env } = require("../config/env");

const client = new GoogleGenAI({ apiKey: env.geminiApiKey });

const ANALYSIS_SYSTEM_INSTRUCTION =
  "You are a senior software engineer producing a detailed onboarding dashboard for a GitHub repository. " +
  "Given the repository metadata, language breakdown, file tree, README, and root manifest file, analyze the " +
  "project in depth: what it does, its tech stack, its architecture and request/data flow, its key entry " +
  "point files, its dependencies, its important directories, and how to set it up and run it locally. " +
  "Be concise and factual — do not speculate about anything not evidenced by the provided context. " +
  "Only report dependency names and versions that actually appear in the provided manifest file; do not " +
  "invent version numbers.";

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
        },
        required: ["path", "note"],
      },
    },
    setup: {
      type: Type.STRING,
      description: "Install and run instructions in markdown, derived from the README and manifest scripts.",
    },
  },
  required: ["overview", "stack", "architecture", "entryPoints", "dependencies", "directories", "setup"],
  propertyOrdering: ["overview", "stack", "architecture", "entryPoints", "dependencies", "directories", "setup"],
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
      maxOutputTokens: 8192,
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

module.exports = { analyzeRepository };
