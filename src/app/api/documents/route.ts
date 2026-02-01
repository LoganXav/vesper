import { auth } from "@/lib/auth";
import { HttpError } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";
import { getDocumentsHandler } from "./repository/get-document";
import { createDocumentHandler } from "./repository/create-document";

export async function GET() {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const documents = await getDocumentsHandler({ userId });

    return NextResponse.json({
      result: { data: documents },
    });
  } catch (error: any) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        {
          data: { success: false },
          message: error.message,
        },
        { status: error.status },
      );
    }
    return NextResponse.json(
      {
        result: {
          data: { success: false },
          message: error.message || "Something went wrong",
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
    const title = body.title;

    if (!title) {
      throw new HttpError("Title is required", 400);
    }

    await createDocumentHandler({ title, userId });

    return NextResponse.json({
      result: {
        data: { success: true },
        message: "Document created successfully",
      },
    });
  } catch (error: any) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        {
          data: { success: false },
          message: error.message,
        },
        { status: error.status },
      );
    }
    return NextResponse.json({
      result: {
        data: { success: false },
        message: error.message || "Something went wrong",
      },
    });
  }
}
