import { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import CodeEditor from "@/components/CodeEditor";
import ChatWindow from "@/components/ChatWindow";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Code, GraduationCap, Loader2 } from "lucide-react";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { 
  getExerciseInfo, 
  parseExerciseContent, 
  createUser, 
  pushUserContent,
  getUserInfo 
} from "@/lib/api";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function StudentView() {
  const { 
    setCode, 
    setSteps, 
    setExerciseDescription, 
    exerciseId, 
    setExerciseId,
    userId,
    setUserId,
    academicId,
    setAcademicId,
    code
  } = useAppContext();
  
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [academicIdInput, setAcademicIdInput] = useState("");
  const [exerciseTitle, setExerciseTitle] = useState("Lesson");

  // Auto-save code periodically
  useEffect(() => {
    if (!userId || !code) return;

    const saveInterval = setInterval(async () => {
      try {
        await pushUserContent(userId, code);
        console.log("Code auto-saved");
      } catch (error) {
        console.error("Failed to auto-save code:", error);
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [userId, code]);

  // Load exercise and user on mount
  useEffect(() => {
    const loadExercise = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check URL params for exercise_id
        const urlExerciseId = searchParams.get("exercise_id");
        const storedExerciseId = localStorage.getItem("currentExerciseId");
        const storedUserId = localStorage.getItem("currentUserId");
        const storedAcademicId = localStorage.getItem("currentAcademicId");

        const targetExerciseId = urlExerciseId || storedExerciseId;

        if (!targetExerciseId) {
          setError("No exercise ID provided. Please use a valid exercise link.");
          setIsLoading(false);
          return;
        }

        console.log(`[StudentView] Loading exercise: ${targetExerciseId}`);

        // Load exercise info
        const exerciseInfo = await getExerciseInfo(targetExerciseId);
        console.log(`[StudentView] Exercise info loaded:`, exerciseInfo);

        console.log(exerciseInfo.content);
        
        const parsedContent = parseExerciseContent(exerciseInfo.content);
        console.log(`[StudentView] Parsed content:`, parsedContent);
        
        setExerciseId(targetExerciseId);
        setExerciseDescription(parsedContent.description);
        setSteps(parsedContent.steps.map((step, idx) => ({ ...step, id: idx + 1 })));
        setExerciseTitle(parsedContent.title);

        // Check if we have a stored user for this exercise
        if (storedUserId && storedAcademicId) {
          try {
            const userInfo = await getUserInfo(storedUserId);
            
            // Verify user belongs to this exercise
            if (userInfo.exercise_id === targetExerciseId) {
              setUserId(storedUserId);
              setAcademicId(parseInt(storedAcademicId));
              
              // Try to load user's saved code
              // Note: The API doesn't directly give us the user's content in getUserInfo
              // We need to use getExerciseParticipant for that
              setCode(parsedContent.code); // Start with template code
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error("Stored user not found or invalid", e);
          }
        }

        // If no valid user, show setup
        setCode(parsedContent.code);
        setNeedsSetup(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load exercise:", error);
        setError(error instanceof Error ? error.message : "Failed to load exercise");
        setIsLoading(false);
      }
    };

    loadExercise();
  }, [searchParams]);

  const handleStartExercise = async () => {
    if (!academicIdInput.trim() || !exerciseId) return;

    const parsedAcademicId = parseInt(academicIdInput);
    if (isNaN(parsedAcademicId)) {
      setError("Academic ID must be a number");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await createUser(exerciseId, parsedAcademicId);
      
      setUserId(user.sub);
      setAcademicId(parsedAcademicId);
      
      // Store in localStorage
      localStorage.setItem("currentExerciseId", exerciseId);
      localStorage.setItem("currentUserId", user.sub);
      localStorage.setItem("currentAcademicId", parsedAcademicId.toString());
      
      setNeedsSetup(false);
    } catch (error) {
      console.error("Failed to create user:", error);
      setError(error instanceof Error ? error.message : "Failed to start exercise");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Start Exercise</CardTitle>
            <CardDescription>Enter your academic ID to begin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="academic-id">Academic ID (Student Number)</Label>
              <Input
                id="academic-id"
                type="number"
                placeholder="e.g., 12345"
                value={academicIdInput}
                onChange={(e) => setAcademicIdInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStartExercise()}
              />
            </div>
            <Button 
              onClick={handleStartExercise} 
              className="w-full"
              disabled={!academicIdInput.trim()}
            >
              Start Exercise
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
            <Code className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">CodeMentor</h1>
            <p className="text-xs text-muted-foreground">Interactive Programming Tutor</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2 border border-border">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{exerciseTitle}</span>
          </div>
          {academicId && (
            <div className="text-xs text-muted-foreground">
              ID: {academicId}
            </div>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={60} minSize={35}>
            <CodeEditor />
          </ResizablePanel>
          <ResizableHandle className="w-1 bg-border transition-colors hover:bg-primary/50" />
          <ResizablePanel defaultSize={40} minSize={30}>
            <ChatWindow />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}

const Index = () => {
  return (
    <AppProvider>
      <StudentView />
    </AppProvider>
  );
};

export default Index;
