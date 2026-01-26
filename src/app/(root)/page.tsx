"use client";

import { Button } from "@/components/ui/button";
import { SessionProvider } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatInterface } from "@/app/(root)/_features/chat-interface";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import EditorInterface from "./_features/editor-interface";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useState } from "react";

export default function Home() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <SessionProvider>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <AppSidebar />
        <div className="w-full relative h-screen grid grid-cols-1 lg:grid-cols-3">
          <SidebarTrigger
            onClick={() => setOpen(!open)}
            className="absolute top-2 left-2 z-50"
          />

          <div className="lg:col-span-2 h-full overflow-y-auto bg-background p-0 scrollbar-none">
            <EditorInterface />
          </div>

          <div className="lg:col-span-1 hidden lg:flex h-full bg-sidebar border-l border-border">
            <ChatInterface />
          </div>

          {isMobile && (
            <div className="fixed bottom-4 right-4 z-50">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-full lg:hidden" variant="outline">
                    Chat with AI
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-md p-0 h-9/12 lg:hidden border-border">
                  <VisuallyHidden>
                    <DialogTitle>Chat</DialogTitle>
                  </VisuallyHidden>
                  <div className="bg-card h-full flex flex-col rounded-lg overflow-hidden">
                    <ChatInterface />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
