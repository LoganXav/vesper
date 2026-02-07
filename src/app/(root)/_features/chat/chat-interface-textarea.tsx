"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SettingsIcon,
  Link2Icon,
  SparklesIcon,
  SendHorizontalIcon,
  Loader2Icon,
  BookOpenText,
  XIcon,
  CheckIcon,
} from "lucide-react";

interface Props {
  onSend: ({
    message,
    documentId,
  }: {
    message: string;
    documentId?: string;
  }) => Promise<void>;
  isSending?: boolean;
}

export const ChatInterfaceTextArea = ({ onSend, isSending }: Props) => {
  const [message, setMessage] = useState("");
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);

  const actions = [
    {
      icon: Link2Icon,
      label: "Reference book",
    },
    // { icon: SparklesIcon, label: "Generate" },
  ];

  const allBooks = [
    { id: 1, title: "The Great Gatsby" },
    { id: 2, title: "To Kill a Mockingbird" },
    { id: 3, title: "1984" },
    { id: 4, title: "The Catcher in the Rye" },
    { id: 5, title: "Pride and Prejudice" },
    { id: 6, title: "The Lord of the Rings" },
    { id: 7, title: "The Hobbit" },
    { id: 8, title: "The Alchemist" },
    { id: 9, title: "The Little Prince" },
    { id: 10, title: "Animal Farm" },
  ];

  const referencedBooks = allBooks.filter((book) =>
    selectedBooks.includes(book.id),
  );

  const toggleBookSelection = (bookId: number) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId],
    );
  };

  const removeBook = (bookId: number) => {
    setSelectedBooks((prev) => prev.filter((id) => id !== bookId));
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    await onSend({
      message: message.trim(),
    });
    setMessage("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {referencedBooks.length > 0 && (
        <div className="bg-muted rounded-lg p-1">
          <div className="flex gap-1 flex-wrap">
            {referencedBooks.map((book) => (
              <div
                key={book.id}
                className="group flex items-center gap-1 px-1 rounded-md hover:bg-accent/50 transition-all cursor-pointer text-xs shrink-0 border border-border relative max-w-[150px] overflow-hidden"
                onClick={() => removeBook(book.id)}
              >
                <XIcon
                  size={12}
                  className="hidden group-hover:block bg-secondary rounded-full absolute left-1 transition-all duration-300 ease-out"
                />

                <BookOpenText
                  size={12}
                  className="group-hover:hidden absolute left-1 transition-all duration-300 ease-out"
                />

                <span className="truncate pr-4 pl-4">{book.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex items-center gap-1 overflow-hidden transition-all duration-300 ease-out",
          isActionsOpen ? "max-w-[500px] opacity-100" : "max-w-0 opacity-0",
        )}
      >
        {actions.map((action) => {
          if (action.label === "Reference book") {
            return (
              <Popover key={action.label}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    disabled
                    size="sm"
                    variant="ghost"
                    className="h-7 shrink-0 rounded-full text-xs border border-border"
                  >
                    <action.icon size={12} />
                    {action.label}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
                    <div className="p-1">
                      <div className="flex flex-col gap-1">
                        {allBooks.map((book) => {
                          const isSelected = selectedBooks.includes(book.id);
                          return (
                            <div
                              key={book.id}
                              onClick={() => toggleBookSelection(book.id)}
                              className={cn(
                                "flex items-center gap-1 p-1 rounded-sm text-left text-sm transition-colors",
                                isSelected
                                  ? "bg-accent text-accent-foreground"
                                  : "hover:bg-accent/50",
                              )}
                            >
                              <BookOpenText
                                size={14}
                                className={cn(
                                  isSelected
                                    ? "text-accent-foreground"
                                    : "text-muted-foreground",
                                )}
                              />
                              <span className="flex-1 text-xs">
                                {book.title}
                              </span>
                              {isSelected && (
                                <CheckIcon
                                  size={12}
                                  className="text-accent-foreground"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          }
          return (
            <Button
              key={action.label}
              disabled
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 shrink-0 rounded-full text-xs border border-border"
            >
              <action.icon size={12} />
              {action.label}
            </Button>
          );
        })}
      </div>
      <div className="flex items-center justify-between border border-border w-full bg-secondary px-2 rounded-3xl relative">
        <div className="absolute left-2 bottom-1.5 flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => setIsActionsOpen(!isActionsOpen)}
          >
            <div
              className={cn(
                "transition-transform duration-300",
                isActionsOpen && "rotate-[135deg]",
              )}
            >
              <SettingsIcon size={16} />
            </div>
          </Button>
        </div>

        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setMessage(e.target.value)
          }
          onKeyDown={onKeyDown}
          disabled={isSending}
          className="text-sm resize-none max-h-[150px] border-0 bg-transparent focus-visible:ring-0 p-3 shadow-none mx-10"
        />

        <Button
          className="h-8 w-8 shrink-0 rounded-full absolute right-2 bottom-1.5"
          size="icon"
          onClick={handleSend}
          disabled={isSending}
        >
          {isSending ? (
            <Loader2Icon size={16} className="animate-spin" />
          ) : (
            <SendHorizontalIcon size={16} />
          )}
        </Button>
      </div>
    </>
  );
};
