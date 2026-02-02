import { HttpError } from "@/lib/error";
import { getAiModel } from "@/lib/gemini-model";

export const sendAiMessage = async (
  message: string,
  previousHistory: any[],
  prompt: string,
) => {
  let chatSession;
  try {
    const model = getAiModel();

    chatSession = model.startChat({
      history: previousHistory.length > 0 ? previousHistory : [],
    });

    // Send the current prompt as the user message
    const result = await chatSession.sendMessageStream(prompt);

    return result;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new HttpError(
      `Failed to send message to AI: ${error.message || "Unknown error"}`,
      500,
    );
  }
};
