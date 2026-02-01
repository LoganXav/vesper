"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  MessageSquarePlusIcon,
  HistoryIcon,
  MessageSquareTextIcon,
  TrashIcon,
} from "lucide-react";
import { formatRelativeTime } from "@/utils/date-utils";
import { useDeleteChatMutation } from "@/queries/chat";
import { Chat } from "@/types";

interface ChatInterfaceHeaderProps {
  chats: Chat[] | undefined;
  currentChatId: string | undefined;
  onSelectChat: (chatId: string) => void;
  onCreateNewChat: () => void;
  isLoading?: boolean;
  onChatDeleted?: () => void;
}

export function ChatInterfaceHeader({
  chats = [],
  currentChatId,
  onSelectChat,
  onCreateNewChat,
  isLoading = false,
  onChatDeleted,
}: ChatInterfaceHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteChatMutate } = useDeleteChatMutation();

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChatMutate(
      { chatId },
      {
        onSuccess: () => {
          onChatDeleted?.();
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-end gap-1 px-4 pt-1 mr-4">
      <Button
        onClick={onCreateNewChat}
        size="icon"
        variant="ghost"
        className="rounded-full w-8 h-8 bg-transparent p-0"
      >
        <MessageSquarePlusIcon className="size-4" />
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost" className="rounded-full w-8 h-8">
            <HistoryIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
            {isLoading ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Loading chats...
              </div>
            ) : chats.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground text-center">
                No chat history
              </div>
            ) : (
              <div className="p-1 flex flex-col gap-1">
                {chats?.map((chat) => {
                  const isSelected = chat?.id === currentChatId;
                  const timeAgo = formatRelativeTime(
                    new Date(chat?.updatedAt ?? new Date()),
                  );

                  return (
                    <div
                      key={chat?.id}
                      onClick={() => {
                        onSelectChat(chat?.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "group flex items-center gap-2 p-1 text-left rounded-sm cursor-pointer transition-colors text-sm",
                        isSelected
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50",
                      )}
                    >
                      <TrashIcon
                        size={12}
                        onClick={(e) => handleDeleteChat(e, chat?.id)}
                        className="hidden group-hover:block bg-secondary rounded-full absolute left-3 transition-all duration-300 ease-out hover:text-destructive"
                      />

                      <MessageSquareTextIcon
                        size={12}
                        className="group-hover:hidden absolute left-3 transition-all duration-300 ease-out"
                      />
                      <div className="flex flex-1 space-x-1">
                        <span className="truncate pr-4 pl-5 text-xs">
                          {chat?.title}
                        </span>
                        <div className="text-[10px] text-muted-foreground">
                          {timeAgo}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
