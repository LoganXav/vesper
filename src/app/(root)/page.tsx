import { auth } from "@/lib/auth";
import { config } from "@/config";
import { redirect } from "next/navigation";
import { Routes } from "@/config/route-enums";
import { getMostRecentDocumentHandler } from "@/app/api/documents/repository/get-document";

export default async function RedirectToEditor() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(config.baseUrl + Routes.HOME + config.offlineDocumentId);
  }

  const mostRecentDocument = await getMostRecentDocumentHandler({
    userId: session.user.id,
  });

  redirect(
    config.baseUrl + Routes.HOME + (mostRecentDocument?.id ?? config.offlineDocumentId)
  );
}
