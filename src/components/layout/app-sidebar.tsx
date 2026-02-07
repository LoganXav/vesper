"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useTransition } from "react";
import {
  AudioWaveformIcon,
  LibraryBigIcon,
  FilePlusCornerIcon,
  Loader2,
  LogOutIcon,
  FileSearchCorner,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Routes } from "@/config/route-enums";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";
import { AvatarImage } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";
import { GoogleIcon, GitHubIcon } from "@/components/ui/icons";
import { useCreateDocumentMutation } from "@/queries/document";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DocumentHistory } from "@/app/(root)/_features/document/document-history";
import { DocumentSearchDialog } from "@/app/(root)/_features/document/document-search-dialog";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [isPending, startTransition] = useTransition();

  const { createDocumentMutate, createDocumentPending } =
    useCreateDocumentMutation();

  const handleCreateDocument = () => {
    createDocumentMutate(
      { title: "Untitled Document" },
      {
        onSuccess: () => {
          router.push(Routes.HOME);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const handleSignInWithGoogle = async () => {
    startTransition(() => {
      signIn("google");
    });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: Routes.OFFLINE_DOCUMENT });
  };

  const menuItemClass = cn(
    "flex items-center justify-start gap-2 p-2 rounded-md hover:bg-accent hover:text-foreground transition-colors cursor-pointer",
  );

  return (
    <Sidebar>
      <SidebarHeader className="pb-0 space-y-3">
        <div className="text-lg font-bold flex items-center gap-2">
          VesperAI <AudioWaveformIcon className="size-4" />
        </div>
        <Button
          variant="ghost"
          className={cn(menuItemClass)}
          onClick={handleCreateDocument}
          disabled={createDocumentPending}
        >
          <FilePlusCornerIcon className="size-4" />
          New Document
        </Button>
      </SidebarHeader>
      <SidebarContent className="scrollbar-thin">
        <SidebarGroup className="pt-0">
          <SidebarGroupContent className="flex flex-col gap-1 mt-0">

            <DocumentSearchDialog session={session}>
              <div className={menuItemClass}>
                <FileSearchCorner className="size-4" />
                Search Documents
              </div>
            </DocumentSearchDialog>
            <div
              className={cn("relative group",
                menuItemClass,
                pathname === Routes.LIBRARY &&
                "bg-accent text-accent-foreground font-medium",
              )}
            // onClick={() => router.push(Routes.LIBRARY)}
            >
              <LibraryBigIcon className="size-4" />
              Library
              <div className="absolute top-1/2 -translate-y-1/2 right-2 px-3 rounded-md text-[9px] py-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">Coming soon</div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupContent className="relative">
            <DocumentHistory session={session} />
            <div className="sticky bottom-0 left-0 right-0 h-8 z-10 pointer-events-none cloud-fade-bottom-sidebar" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mb-4 p-0">
        <SidebarGroup className="flex flex-col gap-2">
          {session?.user && (
            <div className="flex items-center gap-2 ml-1">
              <Avatar className="size-6">
                <AvatarImage
                  src={session?.user?.image ?? ""}
                  alt={session?.user?.name ?? ""}
                />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium">{session?.user?.name}</p>
            </div>
          )}

          <SidebarGroupContent className="space-y-1">
            <Button
              variant="ghost"
              className="bg-transparent pl-2 shadow-none w-full items-center justify-start hover:text-foreground"
              asChild
            >
              <a
                href="https://github.com/LoganXav/vesper"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon className="size-4" />
                Give a star on GitHub
              </a>
            </Button>

            {session?.user ? (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full items-center pl-2 justify-start hover:font-medium hover:text-foreground"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogOutIcon className="size-4" />
                )}
                Logout
                {isPending && <Loader2 className="size-4 animate-spin" />}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleSignInWithGoogle}
                className="bg-transparent shadow-none w-full pl-2 items-center justify-start"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <GoogleIcon className="size-4" />
                )}
                Continue with Google
              </Button>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
