import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import CodeEditor from "@/components/CodeEditor";
import ChatWindow from "@/components/ChatWindow";
import { Code, GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Code className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">CodeLearn</h1>
            <p className="text-xs text-muted-foreground">Interactive Programming Tutor</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Lesson 1: Functions</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={55} minSize={30}>
            <CodeEditor />
          </ResizablePanel>
          <ResizableHandle className="w-1 bg-border transition-colors hover:bg-primary/50" />
          <ResizablePanel defaultSize={45} minSize={25}>
            <ChatWindow />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default Index;
