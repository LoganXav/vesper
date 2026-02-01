import { auth } from "@/lib/auth";
import { HttpError } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";
import { getChatHandler } from "../repository/get-chat";
import { updateChatHandler } from "../repository/update-chat";
import { deleteChatHandler } from "../repository/delete-chat";
import { ChatMessage } from "@/types";
import { getDocumentHandler } from "../../documents/repository/get-document";
import { prepareChatContextHandler } from "../handlers/prepare-chat-context";
import { buildChatPromptHandler } from "../handlers/build-chat-prompt";
import { getAiModel } from "@/lib/gemini-model";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const chatId = request.nextUrl.pathname.split("/").pop();

    if (!chatId) {
      throw new HttpError("Chat ID is required", 400);
    }

    const chat = await getChatHandler({ chatId, userId });

    if (!chat) {
      throw new HttpError("Chat not found", 404);
    }

    return NextResponse.json({
      result: { data: chat },
    });
  } catch (error: any) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        {
          result: {
            data: { success: false },
            message: error.message,
          },
        },
        { status: error.status },
      );
    }
    return NextResponse.json(
      {
        result: {
          data: { success: false },
          message: error.message || "Internal server error",
        },
      },
      { status: error.status || 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const chatId = request.nextUrl.pathname.split("/").pop();

    if (!chatId) {
      throw new HttpError("Chat ID is required", 400);
    }

    const body = await request.json().catch(() => ({}));
    const { message, documentId } = body;

    if (!message) {
      throw new HttpError("Message is required", 400);
    }

    // Get the chat to check if it exists
    const chat = await getChatHandler({ chatId, userId });

    if (!chat) {
      throw new HttpError("Chat not found", 404);
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      status: "default",
    };

    // Update chat with new user message
    const currentMessages = (chat.messages as ChatMessage[]) || [];
    const updatedMessages = [...currentMessages, userMessage];

    await updateChatHandler({
      chatId,
      userId,
      messages: updatedMessages,
    });

    const document = await getDocumentHandler({ documentId, userId });

    const { structuredContext, allChunkIds } = prepareChatContextHandler({
      documentContent: document.content || "",
    });

    const prompt = buildChatPromptHandler({
      structuredContext,
      allChunkIds,
      message,
    });

    const chatHistory = updatedMessages
      .filter((msg) => msg.role === "user" || msg.role === "model")
      .map((message) => ({
        role: message.role === "model" ? "model" : "user",
        parts: [{ text: message.content }],
      }));

    const model = getAiModel();

    // Only include history if there are previous messages (excluding the current user message)
    // The current user message will be sent separately via sendMessageStream
    const previousHistory = chatHistory.slice(0, -1); // Remove the last message (current user message)

    let chatSession;
    try {
      chatSession = model.startChat({
        history: previousHistory.length > 0 ? previousHistory : [],
      });
    } catch (error: any) {
      throw new HttpError(
        `Failed to start chat session: ${error.message}`,
        500,
      );
    }

    // Send the current prompt as the user message
    let result;
    try {
      result = await chatSession.sendMessageStream(prompt);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw new HttpError(
        `Failed to send message to AI: ${error.message || "Unknown error"}`,
        500,
      );
    }

    let fullModelReply = "";
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (!text) continue;

          fullModelReply += text;
          controller.enqueue(encoder.encode(text));
        }

        const modelMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "model",
          content: fullModelReply,
          status: "default",
        };

        await updateChatHandler({
          chatId,
          userId,
          messages: [...updatedMessages, modelMessage],
        });

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        {
          result: {
            data: { success: false },
            message: error.message,
          },
        },
        { status: error.status },
      );
    }
    return NextResponse.json(
      {
        result: {
          data: { success: false },
          message: error.message || "Internal server error",
        },
      },
      { status: error.status || 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const chatId = request.nextUrl.pathname.split("/").pop();

    if (!chatId) {
      throw new HttpError("Chat ID is required", 400);
    }

    await deleteChatHandler({ chatId, userId });

    return NextResponse.json({
      result: {
        data: { success: true },
        message: "Chat deleted successfully",
      },
    });
  } catch (error: any) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        {
          result: {
            data: { success: false },
            message: error.message,
          },
        },
        { status: error.status },
      );
    }
    return NextResponse.json(
      {
        result: {
          data: { success: false },
          message: error.message || "Internal server error",
        },
      },
      { status: error.status || 500 },
    );
  }
}
