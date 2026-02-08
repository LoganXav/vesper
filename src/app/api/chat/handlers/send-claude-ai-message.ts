import { HttpError } from "@/lib/error";
import { getClaudeModel, getClaudeModelId } from "@/lib/claude-model";

type HistoryEntry = { role: string; parts: { text: string }[] };

/**
 * Sends the current prompt to Claude and returns a stream compatible with the
 * chat route (same shape as sendGeminiAiMessage: { stream } with chunks that have .text()).
 */
export async function sendClaudeAiMessage(
  systemInstruction: string | undefined,
  previousHistory: HistoryEntry[],
  prompt: string,
) {
  try {
    const client = getClaudeModel();
    const modelId = getClaudeModelId();

    const messages: { role: "user" | "assistant"; content: string }[] =
      previousHistory.map((h) => ({
        role: (h.role === "model" ? "assistant" : "user") as "user" | "assistant",
        content: h.parts?.[0]?.text ?? "",
      }));

    messages.push({ role: "user", content: prompt });

    const stream = await client.messages.create({
      model: modelId,
      max_tokens: 1024,
      messages,
      temperature: 0.1,
      stream: true,
      system: systemInstruction ?? undefined,
    });

    async function* toTextChunks() {
      for await (const event of stream) {
        if (event.type !== "content_block_delta") continue;
        const delta = event.delta as { type?: string; text?: string };
        if (delta?.type === "text_delta" && typeof delta.text === "string" && delta.text.length > 0) {
          yield { text: () => delta.text };
        }
      }
    }

    return { stream: toTextChunks() };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Claude API Error:", error);
    throw new HttpError(
      `Failed to send message to AI: ${message}`,
      500,
    );
  }
}
