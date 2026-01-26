import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { DocumentHistory } from "@/app/(root)/_features/document-history";
import { LogOutIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { GoogleIcon, GitHubIcon } from "@/lib/icons";

export function AppSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-2xl font-bold">VesperAI</h1>
      </SidebarHeader>
      <SidebarContent>
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
                onClick={() => signOut()}
                className="w-full items-center justify-start"
              >
                Logout
                <LogOutIcon className="size-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => signIn("google")}
                className="bg-transparent shadow-none w-full items-center justify-start"
              >
                <GoogleIcon className="size-4" />
                Continue with Google
              </Button>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
