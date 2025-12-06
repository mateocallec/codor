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
  exerciseDescription: string;
  setExerciseDescription: (description: string) => void;
  codeHighlight: CodeHighlight | null;
  setCodeHighlight: (highlight: CodeHighlight | null) => void;
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
  exerciseId: string | null;
  setExerciseId: (id: string | null) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
  academicId: number | null;
  setAcademicId: (id: number | null) => void;
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

const initialExerciseDescription = `In this exercise, you'll learn how to create and use functions in JavaScript. Your goal is to:
- Create a function called 'greet' that takes a person's name as input
- The function should create a greeting message with that name
- Print the greeting to the console
- Return the greeting so it can be used elsewhere
- Call the function with a name and use the returned value

Take your time and experiment! If you get stuck, click the "Get Help" button and I'll guide you without giving away the solution.`;

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Welcome! 👋 I'm your coding tutor. Read the exercise description above and start coding. If you need help, just click the 'Get Help' button and I'll guide you!",
    timestamp: new Date(),
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState(initialCode);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [exerciseDescription, setExerciseDescription] = useState(initialExerciseDescription);
  const [codeHighlight, setCodeHighlight] = useState<CodeHighlight | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [exerciseId, setExerciseId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [academicId, setAcademicId] = useState<number | null>(null);

  return (
    <AppContext.Provider
      value={{
        code,
        setCode,
        messages,
        setMessages,
        steps,
        setSteps,
        exerciseDescription,
        setExerciseDescription,
        codeHighlight,
        setCodeHighlight,
        isStreaming,
        setIsStreaming,
        exerciseId,
        setExerciseId,
        userId,
        setUserId,
        academicId,
        setAcademicId,
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
