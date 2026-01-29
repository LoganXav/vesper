import EditorInterface from "./_features/editor/editor-interface";
import { ChatInterface } from "./_features/chat/chat-interface";
import { ChatInterfaceMobile } from "./_features/chat/chat-interface-mobile";

export default function Home() {
  return (
    <div className="w-full relative h-screen grid grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 h-full overflow-y-auto bg-background p-0 scrollbar-none">
        <EditorInterface />
      </div>
      <div className="lg:col-span-1 hidden lg:flex h-full bg-sidebar border-l border-border">
        <ChatInterface />
      </div>
      <ChatInterfaceMobile />
    </div>
  );
}
