import { auth } from "@/lib/auth";
import { HttpError } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";
import { createChatHandler } from "./repository/create-chat";
import { getChatsHandler } from "./repository/get-chat";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const chats = await getChatsHandler({ userId });

    return NextResponse.json({
      result: { data: chats },
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

    const body = await request.json().catch(() => ({}));
    const { title } = body;

    const chat = await createChatHandler({
      userId,
      title,
    });

    return NextResponse.json({
      result: {
        data: chat,
        message: "Chat created successfully",
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
