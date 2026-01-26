"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { ChatInterface } from "@/app/(root)/_features/chat-interface";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import EditorInterface from "./_features/editor-interface";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  const { isMobile } = useIsMobile();

  return (
    <SessionProvider>
      <div className="relative h-screen grid grid-cols-1 lg:grid-cols-4">
        <div className="hidden lg:flex h-full border-r border-border bg-card">
          <ChatInterface />
        </div>

        <div className="lg:col-span-3 h-full overflow-y-auto bg-background p-0">
          <EditorInterface />
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
    </SessionProvider>
  );
}
