import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleIcon } from "@/lib/icons";

export const ChatInterfaceSignInCard = () => {
  return (
    <div>
      <Card className="shadow-none bg-input p-4">
        <div className="space-y-2">
          <div>Sign in to your account</div>
          <div>Sign in to your account to continue using the chat.</div>
          <Button variant="outline" className="bg-transparent shadow-none">
            <GoogleIcon className="size-4" />
            Sign in with Google
          </Button>
        </div>
      </Card>
    </div>
  );
};
