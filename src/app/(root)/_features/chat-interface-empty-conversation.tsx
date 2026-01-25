import { ChatMessage } from "@/types";

interface Props {
  messages: ChatMessage[];
  sendMessage: ({
    message,
    context,
  }: {
    message: string;
    context: string;
  }) => Promise<void>;
}

export const ChatInterfaceEmptyConversation = ({
  messages,
  sendMessage,
}: Props) => {
  const onSendMessage = (prompt: string) => {
    sendMessage({
      message: prompt.trim(),
      context: "",
    });
  };

  if (messages.length) {
    return null;
  }

  return (
    <div className="h-full flex flex-col justify-center items-center gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Vesper<span className="text-primary">AI</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Try out some of these prompts
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {defaultPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            className="text-nowrap rounded-full text-sm px-4 py-2 bg-secondary hover:bg-accent text-secondary-foreground cursor-pointer transition-all duration-200"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

const defaultPrompts = [
  "Generate a short math quiz",
  "Help me write a story",
  "Explain a concept",
];
