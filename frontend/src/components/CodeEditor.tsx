import { useState, useRef, useEffect } from "react";
import { Play, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useAppContext } from "@/contexts/AppContext";
import type { editor as MonacoEditor } from "monaco-editor";

type LogEntry = {
  type: 'log' | 'error' | 'warn' | 'info' | 'system';
  content: string;
};

const CodeEditor = () => {
  const { code, setCode, codeHighlight } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const workerRef = useRef<Worker | null>(null);
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setLogs([]); // Clear previous logs

    // Terminate previous worker if exists
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    // Create new worker
    const worker = new Worker(new URL('../workers/codeExecutor.ts', import.meta.url), {
      type: 'module'
    });
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, level, args, message, line } = e.data;

      if (type === 'console') {
        setLogs(prev => [...prev, { type: level, content: args.join(' ') }]);
      } else if (type === 'error') {
        setLogs(prev => [...prev, { type: 'error', content: `Error: ${message}` }]);
      } else if (type === 'editor' && e.data.action === 'highlightError') {
         setLogs(prev => [...prev, { type: 'error', content: `[Editor Highlight] Line ${line}: ${message}` }]);
      } else if (type === 'ai') {
         setLogs(prev => [...prev, { type: 'info', content: `[AI Call] ${e.data.functionName}(${e.data.args.join(', ')})` }]);
      } else if (type === 'system' && e.data.status === 'finished') {
         // Execution finished
      }
    };

    worker.onerror = (err) => {
        setLogs(prev => [...prev, { type: 'error', content: `Worker Error: ${err.message}` }]);
    };

    worker.postMessage(code);
  };

  // Handle code highlighting from AI
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    if (!codeHighlight) {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
      return;
    }

    const { startLine, startColumn, endLine, endColumn } = codeHighlight;

    // Clear previous decorations
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
      {
        range: {
          startLineNumber: startLine,
          startColumn: startColumn || 1,
          endLineNumber: endLine,
          endColumn: endColumn || 1000,
        },
        options: {
          isWholeLine: !startColumn && !endColumn,
          className: "highlighted-code-line",
          inlineClassName: "highlighted-code-inline",
        },
      },
    ]);

    // Scroll to the highlighted line
    editor.revealLineInCenter(startLine);
  }, [codeHighlight]);

  // Cleanup worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleEditorDidMount = (editor: MonacoEditor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  return (
    <div className="flex h-full flex-col bg-code-bg">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-4 font-mono text-sm text-muted-foreground">
            lesson-01.js
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <Button
            size="sm"
            onClick={handleRun}
            className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Play className="h-4 w-4" />
            <span className="text-xs">Run</span>
          </Button>
        </div>
      </div>

      {/* Code Area and Output Panel */}
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={75} minSize={20}>
          <div className="h-full w-full overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </ResizablePanel>
        
        <ResizableHandle className="h-4 bg-border transition-colors hover:bg-primary/50" />
        
        <ResizablePanel defaultSize={25} minSize={10}>
          <div className="flex h-full flex-col border-t border-border">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2">
              <span className="font-mono text-xs font-medium text-muted-foreground">
                OUTPUT
              </span>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-sm text-muted-foreground scrollbar-thin">
              {logs.length === 0 ? (
                <p className="text-muted-foreground/50 italic">Run code to see output...</p>
              ) : (
                logs.map((log, i) => (
                  <p key={i} className={`text-code-string whitespace-pre-wrap ${log.type === 'error' ? 'text-red-400' : log.type === 'info' ? 'text-blue-400' : ''}`}>
                    {">"} {log.content}
                  </p>
                ))
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeEditor;
