import { createContext, useContext, useState, ReactNode } from "react";

export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface CodeHighlight {
  startLine: number;
  startColumn?: number;
  endLine: number;
  endColumn?: number;
}

interface AppContextType {
  code: string;
  setCode: (code: string) => void;
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  codeHighlight: CodeHighlight | null;
  setCodeHighlight: (highlight: CodeHighlight | null) => void;
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialCode = `function greet(name) {
  // This function greets the user
  const message = "Hello, " + name + "!";
  console.log(message);
  return message;
}

// Call the function
const result = greet("Learner");
console.log(result + " +1");`;

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Welcome! 👋 I'm your coding tutor. I see you're working on a greeting function. Would you like me to explain how it works?",
    timestamp: new Date(),
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState(initialCode);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [codeHighlight, setCodeHighlight] = useState<CodeHighlight | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <AppContext.Provider
      value={{
        code,
        setCode,
        messages,
        setMessages,
        codeHighlight,
        setCodeHighlight,
        isStreaming,
        setIsStreaming,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
