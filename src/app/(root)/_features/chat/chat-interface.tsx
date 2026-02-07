"use client";

import { useEffect, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { useChatAutoScroll } from "@/hooks/use-auto-scroll";
import { ChatInterfaceTextArea } from "@/app/(root)/_features/chat/chat-interface-textarea";
import ChatInterfaceConversation from "@/app/(root)/_features/chat/chat-interface-conversation";
import { ChatInterfaceEmptyConversation } from "@/app/(root)/_features/chat/chat-interface-empty-conversation";
import { ChatInterfaceHeader } from "@/app/(root)/_features/chat/chat-interface-header";
import {
  useCreateChatMutation,
  useGetChatQuery,
  useGetChatsQuery,
} from "@/queries/chat";
import { ChatMessage } from "@/types";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useChatInterfaceResolution } from "@/hooks/use-chat-interface-resolution";

interface ChatInterfaceProps {
  documentId?: string;
}

export const ChatInterface = ({ documentId }: ChatInterfaceProps) => {
  const [chatId, setChatId] = useState<string | undefined>();
  const { data: session } = useSession();

  const { createChatMutate } = useCreateChatMutation();

  const {
    data: chatsData,
    isLoading: isLoadingChats,
    refetch: refetchChats,
  } = useGetChatsQuery(!!session?.user);

  const { data: chatData } = useGetChatQuery({
    chatId: chatId || "",
  }, !!session?.user);

  const { messages, sendMessage, isSending, setMessages } = useChat({
    chatId: chatId || "",
  });

  const conversationRef = useChatAutoScroll(messages, {
    enabled: true,
    behavior: "smooth",
    offset: 0,
  });

  const handleCreateNewChat = () => {
    createChatMutate(
      { title: "Untitled Chat" },
      {
        onSuccess: (response) => {
          if (response?.data?.id) {
            setChatId(response.data.id);
          }
        },
      },
    );
  };

  // Handle chat selection
  const handleSelectChat = (selectedChatId: string) => {
    setChatId(selectedChatId);
    setMessages([]);
  };

  // Sync messages when chat data loads
  useEffect(() => {
    if (chatData?.data?.messages) {
      setMessages(chatData.data.messages as ChatMessage[]);
    }
  }, [chatData?.data?.messages, setMessages]);

  useEffect(() => {
    if (!chatId && chatsData?.data?.length) {
      setChatId(chatsData?.data[0]?.id);
    }
  }, [chatsData, chatId]);


  const {
    isReady,
    session: resolvedSession,
    isAuthenticated,
  } = useChatInterfaceResolution({
    session,
    chatId,
    isLoadingChats,
    chatData,
    delayMs: 120,
  });


  return (
    <div className="relative h-full w-full flex flex-col bg-sidebar">
      {/* Header */}
      {!!session?.user && <div className="absolute top-0 right-0 z-20 w-min bg-sidebar">
        <ChatInterfaceHeader
          chats={chatsData?.data}
          currentChatId={chatId || chatsData?.data[0]?.id}
          onSelectChat={handleSelectChat}
          onCreateNewChat={handleCreateNewChat}
          isLoading={isLoadingChats}
          onChatDeleted={refetchChats}
        />
      </div>}

      {/* Conversation area with cloud fade masks */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none cloud-fade-top-sidebar" />

        <div className="absolute bottom-0 left-0 right-0 h-8 z-10 pointer-events-none cloud-fade-bottom-sidebar" />

        <div
          ref={conversationRef}
          className={cn(
            "h-full overflow-y-auto pt-16 p-6 scrollbar-thin relative z-0 transition-opacity duration-200",
            isReady ? "opacity-100" : "opacity-0"
          )}
        >
          {isReady && (
            isAuthenticated ? (
              messages.length === 0 ? (
                <ChatInterfaceEmptyConversation
                  session={resolvedSession}
                  sendMessage={(params) =>
                    sendMessage({ ...params, documentId })
                  }
                />
              ) : (
                <ChatInterfaceConversation
                  messages={messages}
                  setMessages={setMessages}
                />
              )
            ) : (
              <ChatInterfaceEmptyConversation
                session={null}
                sendMessage={() => Promise.resolve()}
              />
            )
          )}
        </div>



      </div>

      {/* Bottom input area */}
      {!!session?.user && <div className="relative z-20 pb-6 xl:px-6 px-3 pt-0 space-y-1 bg-sidebar">
        <ChatInterfaceTextArea
          onSend={(params) => sendMessage({ ...params, documentId })}
          isSending={isSending}
        />

        <p className="text-center text-xs text-muted-foreground mt-2">
          Powered by Vesper AI. Built by{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
            Logan
          </span>
        </p>
      </div>}
    </div>
  );
};
