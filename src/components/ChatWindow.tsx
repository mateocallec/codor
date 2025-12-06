import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  role: "user" | "tutor";
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "tutor",
    content:
      "Welcome! 👋 I'm your coding tutor. I see you're working on a greeting function. Would you like me to explain how it works?",
    timestamp: new Date(),
  },
  {
    id: 2,
    role: "user",
    content: "Yes please! Can you explain what the function keyword does?",
    timestamp: new Date(),
  },
  {
    id: 3,
    role: "tutor",
    content:
      "Great question! The `function` keyword in JavaScript is used to define a reusable block of code. When you write `function greet(name)`, you're creating a function called 'greet' that takes one parameter called 'name'. You can then call this function multiple times with different values!",
    timestamp: new Date(),
  },
];

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate tutor response
    setTimeout(() => {
      const tutorResponse: Message = {
        id: messages.length + 2,
        role: "tutor",
        content:
          "That's a great follow-up question! Let me think about that... In programming, understanding the fundamentals like functions is key to becoming proficient. Keep exploring and asking questions!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, tutorResponse]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col backdrop-blur-md bg-white/40 dark:bg-slate-900/40">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 backdrop-blur-lg bg-white/60 dark:bg-slate-900/60">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">AI Tutor</h2>
          <p className="text-xs text-muted-foreground">Always here to help</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  message.role === "user"
                    ? "bg-primary/20 text-foreground"
                    : "bg-chat-tutor text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your tutor a question..."
            className="flex-1 border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="h-10 w-10 bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 border-0"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
