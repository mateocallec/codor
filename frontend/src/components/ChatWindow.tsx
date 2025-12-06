import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, HelpCircle, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { streamChat, handleHighlightCode, getLLMHelp } from "@/lib/ai";

const ChatWindow = () => {
  const { 
    messages, 
    setMessages, 
    code, 
    setCodeHighlight, 
    isStreaming, 
    setIsStreaming,
    steps,
    exerciseDescription
  } = useAppContext();
  const [input, setInput] = useState("");
  const [isExerciseExpanded, setIsExerciseExpanded] = useState(false);
  const [shouldShowToggle, setShouldShowToggle] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const exerciseRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Check if exercise description exceeds 6 lines
  useEffect(() => {
    if (exerciseRef.current) {
      const lineHeight = parseFloat(getComputedStyle(exerciseRef.current).lineHeight);
      const height = exerciseRef.current.scrollHeight;
      const lines = height / lineHeight;
      setShouldShowToggle(lines > 6);
    }
  }, [exerciseDescription]);

  const handleGetHelp = async () => {
    if (isStreaming) return;

    setIsStreaming(true);
    
    // Add a system message indicating help is being generated
    const helpMessageId = Date.now();
    setMessages(prev => [...prev, {
      id: helpMessageId,
      role: "assistant",
      content: "Let me take a look at your code and help you out...",
      timestamp: new Date()
    }]);

    let accumulatedContent = "";

    try {
      await getLLMHelp(
        code,
        exerciseDescription,
        steps,
        (chunk) => {
          accumulatedContent += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === helpMessageId 
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
        () => {
          setIsStreaming(false);
        },
        (error) => {
          console.error("Get help error:", error);
          setMessages(prev => prev.map(msg => 
            msg.id === helpMessageId 
              ? { ...msg, content: "Sorry, I encountered an error while analyzing your code. Please try again." }
              : msg
          ));
          setIsStreaming(false);
        }
      );
    } catch (error) {
      console.error("Error getting help:", error);
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
      {/* Exercise Description */}
      <Card className="m-4 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5">
        <CardContent className="flex items-start gap-3 p-4">
          <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-2">Exercise</h3>
            <div className="relative">
              <p 
                ref={exerciseRef}
                className={`text-sm text-muted-foreground leading-relaxed whitespace-pre-line transition-all duration-300 ${
                  !isExerciseExpanded && shouldShowToggle ? 'line-clamp-6' : ''
                }`}
              >
                {exerciseDescription}
              </p>
              {shouldShowToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExerciseExpanded(!isExerciseExpanded)}
                  className="mt-2 h-auto py-1 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
                >
                  {isExerciseExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show more
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Header */}
      {/* <div className="flex items-center gap-3 border-b border-border px-4 py-3 backdrop-blur-lg bg-white/60 dark:bg-slate-900/60">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">AI Tutor</h2>
        </div>
      </div> */}

      {/* Help Button Section */}
      <div className="border-b border-border bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Need Guidance?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Stuck on something? I'll analyze your code and provide helpful hints!
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={handleGetHelp}
            disabled={isStreaming}
            className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            Get Help
          </Button>
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
