import { auth } from "@/lib/auth";
import { HttpError } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";
import { getChatHandler } from "../handlers/get-chat";
import { updateChatHandler } from "../handlers/update-chat";
import { deleteChatHandler } from "../handlers/delete-chat";
import { ChatMessage } from "@/types";

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
    const { message, stream = true, documentId } = body;

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

    // If streaming is requested, return a stream
    if (stream) {
    } else {
    }
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
