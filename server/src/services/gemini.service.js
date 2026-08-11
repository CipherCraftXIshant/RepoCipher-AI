const { GoogleGenAI } = require("@google/genai");
const { env } = require("../config/env");

const client = new GoogleGenAI({ apiKey: env.geminiApiKey });

const SYSTEM_INSTRUCTION =
  "You are a senior software engineer producing a concise onboarding summary for a GitHub repository. " +
  "Given the repository metadata, file tree, and README, explain: (1) what the project does, " +
  "(2) the tech stack, (3) the overall architecture / notable directories, and (4) where a new " +
  "contributor should start reading. Format as markdown with headers. Be concise and factual — " +
  "do not speculate about anything not evidenced by the file tree or README.";

async function summarizeRepository(input) {
  const { metadata, filePaths, readme } = input;

  const treeListing = filePaths.slice(0, 500).join("\n");
  const truncationNote =
    filePaths.length > 500 ? `\n... and ${filePaths.length - 500} more files` : "";

  const userContent = [
    `Repository: ${metadata.fullName}`,
    metadata.description ? `Description: ${metadata.description}` : null,
    `Default branch: ${metadata.defaultBranch}`,
    "",
    "File tree:",
    treeListing + truncationNote,
    readme ? `\nREADME contents:\n${readme.slice(0, 8000)}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userContent,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      maxOutputTokens: 4096,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini response contained no text content");
  }
  return text;
}

module.exports = { summarizeRepository };
