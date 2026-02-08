import Anthropic from "@anthropic-ai/sdk";
import { config } from "@/config";
import { HttpError } from "./error";

const CLAUDE_MODEL = "claude-3-haiku-20240307";


export function getClaudeModel(): Anthropic {
  try {
    if (!config.claudeApiKey) {
      throw new Error("CLAUDE_API_KEY is not set in environment");
    }
    return new Anthropic({ apiKey: config.claudeApiKey });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new HttpError(
      `Failed to initialize Claude client: ${message}`,
      500,
    );
  }
}


export function getClaudeModelId(): string {
  return CLAUDE_MODEL;
}
