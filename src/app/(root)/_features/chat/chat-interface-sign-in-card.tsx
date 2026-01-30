import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { GoogleIcon } from "@/components/ui/icons";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

export const ChatInterfaceSignInCard = () => {
  const [isPending, startTransition] = useTransition();
  const handleSignIn = async () => {
    startTransition(async () => {
      await signIn("google");
    });
  };

  return (
    <div>
      <Card className="shadow-none bg-input p-4">
        <div className="space-y-2">
          <div>Sign in to your account</div>
          <div>Sign in to your account to continue using the chat.</div>
          <Button
            onClick={handleSignIn}
            variant="outline"
            className="bg-transparent shadow-none w-full"
            disabled={isPending}
          >
            <GoogleIcon className="size-4" />
            Sign in with Google
            {isPending && <Loader2 className="size-4 animate-spin" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};
