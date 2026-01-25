"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusIcon,
  Link2Icon,
  SparklesIcon,
  SendHorizontalIcon,
  Loader2Icon,
} from "lucide-react";

interface Props {
  onSend: ({
    message,
    context,
  }: {
    message: string;
    context: string;
  }) => Promise<void>;
  isSending?: boolean;
}

const actions = [
  { icon: Link2Icon, label: "Reference book" },
  { icon: SparklesIcon, label: "Generate" },
];

export const ChatInterfaceTextArea = ({ onSend, isSending }: Props) => {
  const [message, setMessage] = useState("");
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    await onSend({
      message: message.trim(),
      context: "",
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
    <div>
      <div className="border border-border w-full bg-input p-2 rounded-xl space-y-2">
        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setMessage(e.target.value)
          }
          onKeyDown={onKeyDown}
          disabled={isSending}
          className="text-sm resize-none max-h-[150px] border-0 bg-transparent focus-visible:ring-0 p-3 shadow-none"
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 rounded-full border border-border"
              onClick={() => setIsActionsOpen(!isActionsOpen)}
            >
              <div
                className={cn(
                  "transition-transform duration-300",
                  isActionsOpen && "rotate-[135deg]"
                )}
              >
                <PlusIcon size={16} />
              </div>
            </Button>

            <div
              className={cn(
                "flex items-center gap-1 overflow-hidden transition-all duration-300 ease-out",
                isActionsOpen
                  ? "max-w-[500px] opacity-100"
                  : "max-w-0 opacity-0"
              )}
            >
              {actions.map((action) => (
                <Button
                  key={action.label}
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 shrink-0 rounded-full text-xs border border-border"
                >
                  <action.icon size={12} />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="h-8 w-8 shrink-0 rounded-full"
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
      </div>
    </div>
  );
};
