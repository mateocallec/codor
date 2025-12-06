import { createContext, useContext, useState, ReactNode } from "react";

export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Step {
  id: number;
  description: string;
  lineStart: number;
  lineEnd: number;
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
  steps: Step[];
  setSteps: (steps: Step[]) => void;
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
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

const initialSteps: Step[] = [
  {
    id: 1,
    description: "Define the `greet` function that accepts a `name` parameter.",
    lineStart: 1,
    lineEnd: 4
  },
  {
    id: 2,
    description: "Inside the function, create a variable `greeting` that concatenates \"Hello, \", the provided `name`, and \"!\".",
    lineStart: 2,
    lineEnd: 2
  },
  {
    id: 3,
    description: "Print the `greeting` variable to the console.",
    lineStart: 3,
    lineEnd: 3
  },
  {
    id: 4,
    description: "Return the `greeting` variable from the function.",
    lineStart: 4,
    lineEnd: 4
  },
  {
    id: 5,
    description: "Call the `greet` function with the argument \"Student\" and store the returned value in a variable called `result`.",
    lineStart: 7,
    lineEnd: 7
  },
  {
    id: 6,
    description: "Print the `result` variable to the console.",
    lineStart: 8,
    lineEnd: 8
  }
];

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
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [codeHighlight, setCodeHighlight] = useState<CodeHighlight | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <AppContext.Provider
      value={{
        code,
        setCode,
        messages,
        setMessages,
        steps,
        setSteps,
        currentStepIndex,
        setCurrentStepIndex,
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
