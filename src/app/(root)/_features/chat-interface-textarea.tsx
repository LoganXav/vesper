"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link2Icon, SendHorizontalIcon, Loader2Icon } from "lucide-react";

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

export const ChatInterfaceTextArea = ({ onSend, isSending }: Props) => {
  const [message, setMessage] = useState("");

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
    <div className="space-y-3">
      <div className="border border-border w-full bg-input p-2 rounded-xl space-y-4">
        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setMessage(e.target.value)
          }
          onKeyDown={onKeyDown}
          disabled={isSending}
          className="text-sm resize-none min-h-[60px] border-0 bg-transparent focus-visible:ring-0 p-3 shadow-none"
        />

        <div className="w-full flex justify-between items-center">
          <Button
            className="rounded-full text-xs"
            size="sm"
            variant="ghost"
            // disabled={true}
          >
            <Link2Icon size={16} /> Reference Book
          </Button>

          <Button
            className="rounded-md w-10 h-8"
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

      <p className="text-center text-xs text-muted-foreground">
        Powered by Vesper AI. Built by{" "}
        <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
          Logan
        </span>
      </p>
    </div>
  );
};
