export type ChatMessage = {
  id: string;
  status: "used" | "dismissed" | "default";
  role: "user" | "assistant";
  content: string;
  preview?: { data: string } | null;
};
