import { auth } from "@/lib/auth";
import { HttpError } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";
import { getDocumentsHandler } from "./handlers/get-documents";
import { deleteDocumentHandler } from "./handlers/delete-documents";

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
          ok: false,
          error: error.message,
        },
        { status: error.status },
      );
    }
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Something went wrong",
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

    const body = await request.json().catch(() => ({}));
    const documentId = body.documentId;

    if (!documentId) {
      throw new HttpError("Document ID is required", 400);
    }

    await deleteDocumentHandler({ documentId, userId });

    return NextResponse.json({
      result: {
        data: { success: true },
        message: "Document deleted successfully",
      },
    });
  } catch (error: any) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: error.status },
      );
    }
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Something went wrong",
      },
      { status: error.status || 500 },
    );
  }
}
