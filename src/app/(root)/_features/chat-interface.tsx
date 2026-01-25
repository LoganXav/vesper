"use client";

import { useChat } from "@/hooks/use-chat";
import { ChatInterfaceTextArea } from "@/app/(root)/_features/chat-interface-textarea";
import { ChatInterfaceSignInCard } from "@/app/(root)/_features/chat-interface-sign-in-card";
import ChatInterfaceConversation from "@/app/(root)/_features/chat-interface-conversation";
import { ChatInterfaceEmptyConversation } from "@/app/(root)/_features/chat-interface-empty-conversation";

export const ChatInterface = () => {
  const { messages, sendMessage, isSending, setMessages } = useChat();

  const isSignedIn = false;

  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <ChatInterfaceEmptyConversation
          messages={messages}
          sendMessage={sendMessage}
        />
        <ChatInterfaceConversation
          messages={messages}
          setMessages={setMessages}
        />
      </div>

      <div className="py-6 px-3 pt-0 space-y-3">
        {isSignedIn ? (
          <ChatInterfaceTextArea onSend={sendMessage} isSending={isSending} />
        ) : (
          <ChatInterfaceSignInCard />
        )}

        <p className="text-center text-xs text-muted-foreground">
          Powered by Vesper AI. Built by{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
            Logan
          </span>
        </p>
      </div>
    </div>
  );
};
