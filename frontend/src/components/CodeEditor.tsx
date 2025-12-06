import { useState } from "react";
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

const CodeEditor = () => {
  const [code, setCode] = useState(sampleCode);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

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

      {/* Code Area */}
      <div className="flex flex-1 overflow-auto scrollbar-thin">
        {/* Line Numbers */}
        <div className="flex flex-col bg-code-bg py-4 pl-4 pr-2 text-right font-mono text-sm text-code-lineNumber select-none">
          {lines.map((_, i) => (
            <span key={i} className="leading-6">
              {i + 1}
            </span>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex-1 py-4 pr-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-full w-full resize-none bg-transparent font-mono text-sm leading-6 text-foreground outline-none"
            spellCheck={false}
          />
        </div>
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
