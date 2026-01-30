import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <LoaderCircle
      className={cn("text-primary animate-spin duration-300 size-4", className)}
    />
  );
}
