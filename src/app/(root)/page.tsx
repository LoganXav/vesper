import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMostRecentDocumentHandler } from "@/app/api/documents/handlers/get-documents";
import { Routes } from "@/config/route-enums";
import { config } from "@/config";

export default async function RedirectToEditor() {
  const session = await auth();

  const mostRecentDocument = await getMostRecentDocumentHandler({
    userId: session?.user?.id || "",
  });

  redirect(config.baseUrl + Routes.HOME + mostRecentDocument?.id);
}
