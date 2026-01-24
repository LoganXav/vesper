"use client";

import { useChat } from "@/hooks/use-chat";
import { ChatInterfaceTextArea } from "@/app/(root)/_features/chat-interface-textarea";
import ChatInterfaceConversation from "@/app/(root)/_features/chat-interface-conversation";
import { ChatInterfaceEmptyConversation } from "@/app/(root)/_features/chat-interface-empty-conversation";

export const ChatInterface = () => {
  const { messages, sendMessage, isSending, setMessages } = useChat();

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

      <div className="p-6 pt-0">
        <ChatInterfaceTextArea onSend={sendMessage} isSending={isSending} />
      </div>
    </div>
  );
};
