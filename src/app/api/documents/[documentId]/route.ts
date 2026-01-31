import { auth } from "@/lib/auth";
import { HttpError } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";
import { getDocumentHandler } from "../handlers/get-document";
import { deleteDocumentHandler } from "../handlers/delete-document";
import { updateDocumentHandler } from "../handlers/update-document";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const documentId = request.nextUrl.pathname.split("/").pop();

    if (!documentId) {
      throw new HttpError("Document ID is required", 400);
    }

    const document = await getDocumentHandler({ documentId, userId });

    return NextResponse.json({ result: { data: document } });
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

    const documentId = request.nextUrl.pathname.split("/").pop();

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

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const documentId = request.nextUrl.pathname.split("/").pop();

    if (!documentId) {
      throw new HttpError("Document ID is required", 400);
    }

    const document = await getDocumentHandler({ documentId, userId });

    if (!document) {
      throw new HttpError("Document not found", 404);
    }

    const { content, title } = await request.json();

    await updateDocumentHandler({ documentId, userId, content, title });

    return NextResponse.json({
      result: {
        data: { success: true },
        message: "Document updated successfully",
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
