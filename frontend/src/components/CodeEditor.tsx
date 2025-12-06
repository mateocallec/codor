import { useState, useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { Play, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const sampleCode = `function greet(name) {
  // This function greets the user
  const message = "Hello, " + name + "!";
  console.log(message);
  return message;
}

// Call the function
const result = greet("Learner");
console.log(result);`;

// 👉 Fake "API" that returns line numbers to highlight after 1.5s
async function fetchHighlightedLinesMock(): Promise<number[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // highlight lines 2 and 7 for testing (1-based)
      resolve([2, 7]);
    }, 1500);
  });
}

const CodeEditor = () => {
  const [code, setCode] = useState(sampleCode);
  const [copied, setCopied] = useState(false);

  // Highlight data (normally comes from a real API)
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  // Monaco refs
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditorChange = (value?: string) => {
    setCode(value ?? "");
  };

  const handleEditorDidMount: OnMount = (
    editor,
    monaco: typeof Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Optional: custom dark theme (you can keep vs-dark if you prefer)
    monaco.editor.defineTheme("code-dark-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955" },
        { token: "string", foreground: "CE9178" },
        { token: "keyword", foreground: "C586C0" },
        { token: "number", foreground: "B5CEA8" },
      ],
      colors: {
        "editor.background": "#020617", // matches bg-background-ish
        "editor.lineHighlightBackground": "#1f29334d",
        "editorLineNumber.foreground": "#64748b",
        "editorLineNumber.activeForeground": "#e5e7eb",
        "editorCursor.foreground": "#facc15",
      },
    });

    monaco.editor.setTheme("code-dark-theme");
  };

  // 👉 Fake API call on mount: later you replace this with your real API
  useEffect(() => {
    let cancelled = false;

    fetchHighlightedLinesMock().then((lines) => {
      if (!cancelled) {
        setHighlightedLines(lines);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Apply / update line highlighting whenever highlightedLines changes
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;

    const newDecorations =
      highlightedLines.map((line) => ({
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: "editor-line-highlight",
          marginClassName: "editor-line-highlight-margin",
        },
      })) ?? [];

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [highlightedLines]);

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
            className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Play className="h-4 w-4" />
            <span className="text-xs">Run</span>
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          value={code}
          onChange={handleEditorChange}
          language="javascript" // you can later make this dynamic
          theme="code-dark-theme"
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            automaticLayout: true,
            wordWrap: "on",
            tabSize: 2,
            insertSpaces: true,
          }}
        />
      </div>

      {/* Output Panel */}
      <div className="border-t border-border">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2">
          <span className="font-mono text-xs font-medium text-muted-foreground">
            OUTPUT
          </span>
        </div>
        <div className="h-24 overflow-auto p-4 font-mono text-sm text-muted-foreground scrollbar-thin">
          <p className="text-code-string">{">"} Hello, Learner!</p>
          <p className="text-code-string">{">"} Hello, Learner!</p>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
