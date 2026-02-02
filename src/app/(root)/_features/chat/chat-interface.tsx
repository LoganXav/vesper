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

interface ChatInterfaceProps {
  documentId?: string;
}

export const ChatInterface = ({ documentId }: ChatInterfaceProps) => {
  const [chatId, setChatId] = useState<string | undefined>();

  const { createChatMutate } = useCreateChatMutation();

  const {
    data: chatsData,
    isLoading: isLoadingChats,
    refetch: refetchChats,
  } = useGetChatsQuery();

  const { data: chatData } = useGetChatQuery({
    chatId: chatId || "",
  });

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
      { title: "New Chat" },
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

  return (
    <div className="relative h-full w-full flex flex-col bg-sidebar">
      {/* Header */}
      <div className="absolute top-0 right-0 z-20 w-min bg-sidebar">
        <ChatInterfaceHeader
          chats={chatsData?.data}
          currentChatId={chatId || chatsData?.data[0]?.id}
          onSelectChat={handleSelectChat}
          onCreateNewChat={handleCreateNewChat}
          isLoading={isLoadingChats}
          onChatDeleted={refetchChats}
        />
      </div>

      {/* Conversation area with cloud fade masks */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none cloud-fade-top-sidebar" />

        <div className="absolute bottom-0 left-0 right-0 h-8 z-10 pointer-events-none cloud-fade-bottom-sidebar" />

        <div
          ref={conversationRef}
          className="h-full overflow-y-auto p-6 scrollbar-thin relative z-0"
        >
          <ChatInterfaceEmptyConversation
            messages={messages}
            sendMessage={(params) => sendMessage({ ...params, documentId })}
          />

          <ChatInterfaceConversation
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </div>

      {/* Bottom input area */}
      <div className="relative z-20 pb-6 xl:px-6 px-3 pt-0 space-y-1 bg-sidebar">
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
      </div>
    </div>
  );
};
