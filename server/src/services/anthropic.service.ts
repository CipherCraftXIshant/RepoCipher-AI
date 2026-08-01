import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env";
import type { GithubRepoMetadata } from "../utils/github";

const client = new Anthropic({ apiKey: env.anthropicApiKey });

export interface RepositorySummaryInput {
  metadata: GithubRepoMetadata;
  filePaths: string[];
  readme: string | null;
}

export async function summarizeRepository(input: RepositorySummaryInput): Promise<string> {
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

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    system:
      "You are a senior software engineer producing a concise onboarding summary for a GitHub repository. " +
      "Given the repository metadata, file tree, and README, explain: (1) what the project does, " +
      "(2) the tech stack, (3) the overall architecture / notable directories, and (4) where a new " +
      "contributor should start reading. Format as markdown with headers. Be concise and factual — " +
      "do not speculate about anything not evidenced by the file tree or README.",
    messages: [{ role: "user", content: userContent }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Anthropic response contained no text content");
  }
  return textBlock.text;
}
