import { useState } from "react";
import { Upload, Code, Target, CheckCircle2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { Step as AIStep, generateTasks, generateDescription } from "@/lib/ai";
import { Loader2 } from "lucide-react";

interface Step extends AIStep {
  id: number;
}

const TeacherUpload = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [title, setTitle] = useState("Build a Greeting Function");
  const [code, setCode] = useState(`function greet(name) {
  const greeting = "Hello, " + name + "!";
  console.log(greeting);
  return greeting;
}

const result = greet("Student");
console.log(result);`);
  const [description, setDescription] = useState(/* "In this exercise, you'll learn how to create a JavaScript function that takes a parameter and returns a personalized greeting. This is a fundamental skill in programming that teaches you about functions, parameters, string manipulation, and return values. You'll also practice logging output to the console for debugging purposes." */"");
  const [steps, setSteps] = useState<Step[]>([
    /* { 
      id: 1, 
      description: "Define the function with the name parameter", 
      lineStart: 1, 
      lineEnd: 1 
    },
    { 
      id: 2, 
      description: "Create a greeting variable using string concatenation", 
      lineStart: 2, 
      lineEnd: 2 
    },
    { 
      id: 3, 
      description: "Log the greeting message to the console", 
      lineStart: 3, 
      lineEnd: 3 
    },
    { 
      id: 4, 
      description: "Return the greeting so it can be used elsewhere", 
      lineStart: 4, 
      lineEnd: 4 
    },
    { 
      id: 5, 
      description: "Close the function definition", 
      lineStart: 5, 
      lineEnd: 5 
    },
    { 
      id: 6, 
      description: "Call the function with a test input and store the result", 
      lineStart: 7, 
      lineEnd: 7 
    },
    { 
      id: 7, 
      description: "Display the returned result in the console", 
      lineStart: 8, 
      lineEnd: 8 
    } */
  ]);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [editingStep, setEditingStep] = useState<number | null>(null);

  const addStep = () => {
    const newStep: Step = {
      id: Math.max(...steps.map(s => s.id), 0) + 1,
      description: "",
      lineStart: 1,
      lineEnd: 1,
    };
    setSteps([...steps, newStep]);
  };

  const addStepAfter = (afterId: number) => {
    const afterIndex = steps.findIndex(s => s.id === afterId);
    const afterStep = steps[afterIndex];
    const nextStep = steps[afterIndex + 1];
    
    // Calculate appropriate line numbers between the two steps
    const newLineStart = afterStep.lineEnd + 1;
    const newLineEnd = nextStep ? Math.min(newLineStart, nextStep.lineStart - 1) : newLineStart;
    
    const newStep: Step = {
      id: Math.max(...steps.map(s => s.id), 0) + 1,
      description: "",
      lineStart: newLineStart <= newLineEnd ? newLineStart : afterStep.lineEnd,
      lineEnd: newLineStart <= newLineEnd ? newLineEnd : afterStep.lineEnd,
    };
    const newSteps = [...steps];
    newSteps.splice(afterIndex + 1, 0, newStep);
    setSteps(newSteps);
    setEditingStep(newStep.id);
  };

  const getStepColor = (stepId: number) => {
    const colors = [
      { bg: 'bg-purple-500/10', border: 'border-purple-500', text: 'text-purple-500', line: 'bg-purple-500' },
      { bg: 'bg-blue-500/10', border: 'border-blue-500', text: 'text-blue-500', line: 'bg-blue-500' },
      { bg: 'bg-cyan-500/10', border: 'border-cyan-500', text: 'text-cyan-500', line: 'bg-cyan-500' },
      { bg: 'bg-green-500/10', border: 'border-green-500', text: 'text-green-500', line: 'bg-green-500' },
      { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'text-yellow-500', line: 'bg-yellow-500' },
      { bg: 'bg-orange-500/10', border: 'border-orange-500', text: 'text-orange-500', line: 'bg-orange-500' },
      { bg: 'bg-red-500/10', border: 'border-red-500', text: 'text-red-500', line: 'bg-red-500' },
    ];
    return colors[(stepId - 1) % colors.length];
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  const updateStep = (id: number, field: keyof Step, value: string | number) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      )
    );
  };

  const handleGenerateTasks = async () => {
    if (!code || !description) return;
    
    setIsGenerating(true);
    try {
      const generatedSteps = await generateTasks(code, description);
      const stepsWithIds = generatedSteps.map((step, index) => ({
        ...step,
        id: index + 1
      }));
      setSteps(stepsWithIds);
      console.log("Generated Steps:", stepsWithIds);
    } catch (error) {
      console.error("Failed to generate tasks:", error);
      // You might want to add a toast notification here
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!code) return;
    
    setIsGeneratingDescription(true);
    try {
      const generatedDescription = await generateDescription(code);
      setDescription(generatedDescription);
    } catch (error) {
      console.error("Failed to generate description:", error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Task submitted:", { title, code, description, steps });
  };

  const codeLines = code.split("\n");

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/teacher")}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
              <Code className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Teacher Dashboard</h1>
              <p className="text-xs text-muted-foreground">Create a new coding task</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600"
            >
              <Upload className="mr-2 h-4 w-4" />
              Publish Task
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Side - Exercise Title & Code */}
        <div className="flex w-1/2 flex-col border-r border-border">
          <div className="border-b border-border p-4">
            <Label htmlFor="exercise-title" className="text-sm font-medium">
              Exercise Title
            </Label>
            <Input
              id="exercise-title"
              placeholder="e.g., Build a greeting function"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
              required
            />
          </div>

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="border-b border-border px-4 py-2">
              <span className="font-mono text-sm font-medium text-muted-foreground">
                Teacher's Solution Code
              </span>
            </div>

            <div className="flex flex-1 overflow-auto scrollbar-thin">
              {/* Line Numbers */}
              <div className="flex flex-col py-4 pl-4 pr-8 text-right font-mono text-sm text-code-lineNumber select-none relative">
                {codeLines.map((_, i) => {
                  const lineNum = i + 1;
                  const activeStep = hoveredStep || selectedStep;
                  const isHighlighted = activeStep !== null && 
                    steps.find(s => s.id === activeStep)?.lineStart! <= lineNum &&
                    steps.find(s => s.id === activeStep)?.lineEnd! >= lineNum;
                  const stepForLine = steps.find(s => s.lineStart <= lineNum && s.lineEnd >= lineNum);
                  const color = stepForLine ? getStepColor(stepForLine.id) : null;
                  
                  return (
                    <div 
                      key={i} 
                      className={`h-6 flex items-center justify-end ${isHighlighted && color ? color.text + ' font-semibold' : ''}`}
                    >
                      {lineNum}
                    </div>
                  );
                })}
              </div>

              {/* Code Content */}
              <div className="flex-1 py-4 pr-4 relative">
                {(hoveredStep !== null || selectedStep !== null) && (() => {
                  const activeStep = hoveredStep || selectedStep;
                  const step = steps.find(s => s.id === activeStep);
                  const color = step ? getStepColor(step.id) : null;
                  
                  return step && color ? (
                    <div 
                      className={`absolute right-0 ${color.bg} pointer-events-none transition-all duration-200 border-l-4 ${color.border}`}
                      style={{ 
                        left: '-8px',
                        top: `${((step.lineStart || 1) - 1) * 24 + 16}px`,
                        height: `${((step.lineEnd || 1) - (step.lineStart || 1) + 1) * 24}px`
                      }}
                    />
                  ) : null;
                })()}
                <pre className="relative h-full w-full font-mono text-sm leading-6 text-foreground outline-none m-0">
                  <code contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => setCode(e.currentTarget.textContent || "")}
                    className="block outline-none"
                    spellCheck={false}
                  >{code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Task Description & Steps */}
        <div className="flex w-1/2 flex-col overflow-auto scrollbar-thin p-6 space-y-6">
          {/* Task Description */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Task Description
                  </CardTitle>
                  <CardDescription>
                    AI-generated task overview (editable)
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDescription}
                >
                  {isGeneratingDescription ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Generate Description
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="The AI will generate a description based on your code..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </CardContent>
          </Card>

          {/* Steps */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Learning Steps
                  </CardTitle>
                  <CardDescription>
                    AI-generated steps linked to code lines
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateTasks}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Generate Tasks
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {steps.map((step, index) => {
                const color = getStepColor(step.id);
                return (
                  <div key={step.id}>
                    <div
                      className={`rounded-lg border-2 p-4 transition-all cursor-pointer backdrop-blur-md bg-white/40 dark:bg-slate-900/40 ${
                        selectedStep === step.id
                          ? `${color.border} ${color.bg}`
                          : hoveredStep === step.id
                          ? `${color.border} ${color.bg}`
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                      onClick={() => {
                        setSelectedStep(step.id === selectedStep ? null : step.id);
                        setEditingStep(null);
                      }}
                      onMouseEnter={() => setHoveredStep(step.id)}
                      onMouseLeave={() => setHoveredStep(null)}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded-full ${color.line} flex items-center justify-center`}>
                            <span className="text-xs font-bold text-white">{index + 1}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Lines {step.lineStart}-{step.lineEnd}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingStep(editingStep === step.id ? null : step.id);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          {steps.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeStep(step.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          {editingStep === step.id ? (
                            <Textarea
                              placeholder="Describe this step..."
                              value={step.description}
                              onChange={(e) =>
                                updateStep(step.id, "description", e.target.value)
                              }
                              onClick={(e) => e.stopPropagation()}
                              rows={2}
                              className="text-sm"
                              autoFocus
                            />
                          ) : (
                            <p className="text-sm text-foreground leading-relaxed">
                              {step.description || "Click edit to add a description..."}
                            </p>
                          )}
                        </div>

                        {editingStep === step.id && (
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <Label className="text-xs">Start Line</Label>
                              <Input
                                type="number"
                                min="1"
                                value={step.lineStart}
                                onChange={(e) =>
                                  updateStep(
                                    step.id,
                                    "lineStart",
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                                className="mt-1 h-8 text-xs"
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs">End Line</Label>
                              <Input
                                type="number"
                                min="1"
                                value={step.lineEnd}
                                onChange={(e) =>
                                  updateStep(
                                    step.id,
                                    "lineEnd",
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                                className="mt-1 h-8 text-xs"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Add Step Button Between Steps */}
                    {index < steps.length - 1 && (
                      <div className="flex justify-center py-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addStepAfter(step.id)}
                          className="h-6 w-6 rounded-full p-0 hover:bg-primary/10"
                        >
                          <Plus className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Add Step Button at the End */}
              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={addStep}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Manual Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherUpload;
