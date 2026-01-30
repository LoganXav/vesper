import { auth } from "@/lib/auth";
import { HttpError } from "@/lib/error";
import { NextResponse } from "next/server";
import { getDocumentsHandler } from "./handlers/get-documents";

export async function GET() {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const documents = await getDocumentsHandler({ userId });

    return NextResponse.json({ result: { data: documents } });
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
