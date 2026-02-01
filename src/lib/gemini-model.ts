import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "@/config";
import { HttpError } from "./error";

export function getAiModel() {
  try {
    const ai = new GoogleGenerativeAI(config.googleGeminiApiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    return model;
  } catch (error: any) {
    throw new HttpError(
      `Failed to initialize Gemini model: ${error.message}`,
      500,
    );
  }
}
