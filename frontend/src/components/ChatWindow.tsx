import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppContext } from "@/contexts/AppContext";
import { streamChat, handleHighlightCode, checkTask } from "@/lib/ai";

const ChatWindow = () => {
  const { 
    messages, 
    setMessages, 
    code, 
    setCodeHighlight, 
    isStreaming, 
    setIsStreaming,
    steps,
    currentStepIndex,
    setCurrentStepIndex
  } = useAppContext();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCheckTask = async () => {
    if (isStreaming || !currentStep) return;

    setIsStreaming(true);
    
    // Add a system message indicating checking is in progress
    const checkingMessageId = Date.now();
    setMessages(prev => [...prev, {
      id: checkingMessageId,
      role: "assistant",
      content: "Checking your solution...",
      timestamp: new Date()
    }]);

    let accumulatedContent = "";

    try {
      
      await checkTask(
        code,
        currentStep.description,
        (chunk) => {
          accumulatedContent += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === checkingMessageId 
              ? { ...msg, content: accumulatedContent }
              : msg
          ));
        },
        (functionCall) => {
          if (functionCall.name === "highlight_code") {
            const highlight = handleHighlightCode(functionCall.args);
            setCodeHighlight(highlight);
            setTimeout(() => setCodeHighlight(null), 5000);
          }
        },
        (success) => {
          setIsStreaming(false);
          if (success) {
            if (currentStepIndex < steps.length - 1) {
              setCurrentStepIndex(currentStepIndex + 1);
              // Add a message about moving to the next task
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  id: Date.now(),
                  role: "assistant",
                  content: "Moving on to the next task!",
                  timestamp: new Date()
                }]);
              }, 1000);
            } else {
              // All tasks completed
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  id: Date.now(),
                  role: "assistant",
                  content: "Congratulations! You've completed all tasks for this lesson! 🎉",
                  timestamp: new Date()
                }]);
              }, 1000);
            }
          }
        },
        (error) => {
          console.error("Check task error:", error);
          setMessages(prev => prev.map(msg => 
            msg.id === checkingMessageId 
              ? { ...msg, content: "Sorry, I encountered an error while checking your code. Please try again." }
              : msg
          ));
          setIsStreaming(false);
        }
      );
    } catch (error) {
      console.error("Error checking task:", error);
      setIsStreaming(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = {
      id: Date.now(),
      role: "user" as const,
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    // Create a placeholder message for the assistant's response
    const assistantMessageId = Date.now() + 1;
    const assistantMessage = {
      id: assistantMessageId,
      role: "assistant" as const,
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    let accumulatedContent = "";

    try {
      await streamChat(
        [...messages, userMessage],
        code,
        {
          onTextChunk: (chunk) => {
            accumulatedContent += chunk;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: accumulatedContent }
                  : msg
              )
            );
          },
          onFunctionCall: (functionCall) => {
            if (functionCall.name === "highlight_code") {
              const highlight = handleHighlightCode(functionCall.args);
              setCodeHighlight(highlight);
              
              // Clear highlight after 5 seconds
              setTimeout(() => {
                setCodeHighlight(null);
              }, 5000);
            }
          },
          onComplete: () => {
            setIsStreaming(false);
          },
          onError: (error) => {
            console.error("Chat error:", error);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: "Sorry, I encountered an error. Please try again." }
                  : msg
              )
            );
            setIsStreaming(false);
          },
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setIsStreaming(false);
    }
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

      {/* Current Task Header */}
      {currentStep && (
        <div className="border-b border-border bg-muted/30 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Current Task ({currentStepIndex + 1}/{steps.length})
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentStep.description}
              </p>
            </div>
            <Button 
              size="sm" 
              onClick={handleCheckTask}
              disabled={isStreaming}
              className="shrink-0 bg-gradient-to-br from-purple-600 to-blue-500"
            >
              Check Solution
            </Button>
          </div>
        </div>
      )}

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
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content || (message.role === "assistant" && isStreaming ? "..." : "")}
                </p>
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
