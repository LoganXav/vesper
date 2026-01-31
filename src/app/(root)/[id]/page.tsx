import EditorInterface from "../_features/editor/editor-interface";
import { ChatInterface } from "../_features/chat/chat-interface";
import { ChatInterfaceMobile } from "../_features/chat/chat-interface-mobile";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full relative h-screen grid grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 h-full overflow-y-auto bg-background p-0 scrollbar-none">
        <EditorInterface documentId={id} />
      </div>
      <div className="lg:col-span-1 hidden lg:flex h-full bg-sidebar border-l border-border overflow-y-auto">
        <ChatInterface />
      </div>
      <ChatInterfaceMobile />
    </div>
  );
}
