import { useState, useRef } from "react";
import { Play, Copy, Check, Bug } from "lucide-react";
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
  const [currentLine, setCurrentLine] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCursorChange = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const textBeforeCursor = textarea.value.substring(0, textarea.selectionStart);
      const lineNumber = textBeforeCursor.split("\n").length - 1;
      setCurrentLine(lineNumber);
    }
  };

  const lines = code.split("\n");

  return (
    <div className="flex h-full flex-col bg-code-bg">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">
            lesson-01.js
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-1.5 text-muted-foreground hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-500 transition-all"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 border-0"
          >
            <Bug className="h-4 w-4" />
            <span className="text-xs">Debug</span>
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 border-0"
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
            <span 
              key={i} 
              className={`leading-6 ${i === currentLine ? 'text-foreground font-semibold' : ''}`}
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex-1 py-4 pr-4 relative">
          {/* Line highlight background */}
          <div 
            className="absolute left-0 right-0 h-6 bg-code-line transition-all duration-100 pointer-events-none"
            style={{ top: `${currentLine * 24 + 16}px` }}
          />
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyUp={handleCursorChange}
            onClick={handleCursorChange}
            className="relative h-full w-full resize-none bg-transparent font-mono text-sm leading-6 text-foreground outline-none"
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
