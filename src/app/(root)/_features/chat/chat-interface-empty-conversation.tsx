import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/icons";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useTransition } from "react";

interface Props {
  sendMessage: ({
    message,
    context,
  }: {
    message: string;
    context: string;
  }) => Promise<void>;
  session: Session | null;
}

export const ChatInterfaceEmptyConversation = ({
  session,
  sendMessage,
}: Props) => {
  const onSendMessage = (prompt: string) => {
    sendMessage({
      message: prompt.trim(),
      context: "",
    });
  };


  const [isPending, startTransition] = useTransition();


  const handleSignInWithGoogle = async () => {
    startTransition(() => {
      signIn("google");
    });
  };

  return (
    <div className="h-full flex flex-col justify-center items-center gap-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Vesper<span className="text-primary">AI</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {!!session?.user
            ? "Try out some of these prompts"
            : "Sign in with Google to chat with AI and get help with your documents."}
        </p>
      </div>

      {!!session?.user ?
        (
          <div className="flex flex-wrap justify-center gap-2 max-w-sm">
            {defaultPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(prompt)}
                className="text-nowrap rounded-full border border-border text-sm px-4 py-2 bg-secondary hover:bg-accent text-secondary-foreground cursor-pointer transition-all duration-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        )
        : <Button
          variant="outline"
          onClick={handleSignInWithGoogle}
          className="bg-transparent shadow-none w-auto px-8 items-center justify-center"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GoogleIcon className="size-4" />
          )}
          Sign in with Google
        </Button>}
    </div>
  );
};

const defaultPrompts = [
  "Explain what a black hole is in simple terms.",
  "Write a short paragraph about the taste of lemon tea.",
  "Describe a peaceful morning in a forest with vivid details."
];
