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
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Routes } from "@/config/route-enums";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";
import { AvatarImage } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";
import { GoogleIcon, GitHubIcon } from "@/components/ui/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DocumentHistory } from "@/app/(root)/_features/document/document-history";
import { DocumentSearchDialog } from "@/app/(root)/_features/document/document-search-dialog";

export function AppSidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const handleSignInWithGoogle = async () => {
    startTransition(() => {
      signIn("google");
    });
  };

  const handleSignOut = async () => {
    startTransition(() => {
      signOut();
    });
  };

  const menuItemClass = cn(
    "flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer",
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-lg font-bold flex items-center gap-2">
          VesperAI <AudioWaveformIcon className="size-4" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-1 mt-4">
            <div className={menuItemClass}>
              <FilePlusCornerIcon className="size-4" />
              New Document
            </div>
            <DocumentSearchDialog>
              <div className={menuItemClass}>
                <FileSearchCorner className="size-4" />
                Search Documents
              </div>
            </DocumentSearchDialog>
            <div
              className={cn(
                menuItemClass,
                pathname === Routes.LIBRARY &&
                  "bg-accent text-accent-foreground font-medium",
              )}
              onClick={() => router.push(Routes.LIBRARY)}
            >
              <LibraryBigIcon className="size-4" />
              Library
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <DocumentHistory />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-4">
        <SidebarGroup className="flex flex-col gap-2">
          {session?.user && (
            <div className="flex items-center gap-2 ml-2">
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
              className="bg-transparent shadow-none w-full items-center justify-start hover:font-medium hover:text-foreground"
            >
              <GitHubIcon className="size-4" />
              Give a star on GitHub
            </Button>

            {session?.user ? (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full items-center justify-start hover:font-medium hover:text-foreground"
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
                className="bg-transparent shadow-none w-full items-center justify-start"
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
