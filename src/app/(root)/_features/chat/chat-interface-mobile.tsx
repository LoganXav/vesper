"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChatInterface } from "./chat-interface";

export const ChatInterfaceMobile = ({ documentId }: { documentId: string }) => {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full xl:hidden" variant="outline">
                Chat with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md p-0 h-9/12 lg:hidden border-border">
              <VisuallyHidden>
                <DialogTitle>Chat</DialogTitle>
              </VisuallyHidden>
              <div className="bg-card h-full flex flex-col rounded-lg overflow-hidden">
                <ChatInterface documentId={documentId} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};
