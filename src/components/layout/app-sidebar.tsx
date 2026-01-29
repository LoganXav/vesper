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
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";
import { AvatarImage } from "@/components/ui/avatar";
import { GoogleIcon, GitHubIcon } from "@/lib/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DocumentHistory } from "@/app/(root)/_features/document/document-history";
import { Routes } from "@/config/route-enums";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

  const menuOptions = [
    {
      icon: <FilePlusCornerIcon className="size-4" />,
      label: "New Document",
    },
    {
      icon: <FileSearchCorner className="size-4" />,
      label: "Search",
    },
    {
      icon: <LibraryBigIcon className="size-4" />,
      label: "Library",
      href: Routes.LIBRARY,
      onClick: () => {
        router.push(Routes.LIBRARY);
      },
    },
  ];

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
            {menuOptions.map((option) => {
              const isActive = option.href && pathname === option.href;
              return (
                <div
                  key={option.label}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer",
                    isActive && "bg-accent text-accent-foreground",
                  )}
                  onClick={option.onClick}
                >
                  {option.icon}
                  {option.label}
                </div>
              );
            })}
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
            <SidebarGroupContent className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={session?.user?.image ?? ""}
                  alt={session?.user?.name ?? ""}
                />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium">{session?.user?.name}</p>
            </SidebarGroupContent>
          )}

          <SidebarGroupContent>
            <Button
              variant="ghost"
              className="bg-transparent shadow-none w-full items-center justify-start"
            >
              <GitHubIcon className="size-4" />
              Give a star on GitHub
            </Button>
          </SidebarGroupContent>

          <SidebarGroupContent>
            {session?.user ? (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full items-center justify-start"
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
