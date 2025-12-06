import { useState } from "react";
import { Upload, Code, Target, CheckCircle2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

interface Step {
  id: number;
  description: string;
  lineStart: number;
  lineEnd: number;
}

const TeacherUpload = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Build a Greeting Function");
  const [code, setCode] = useState(`function greet(name) {
  const greeting = "Hello, " + name + "!";
  console.log(greeting);
  return greeting;
}

const result = greet("Student");
console.log(result);`);
  const [description, setDescription] = useState("Create a function that takes a person's name as input and returns a personalized greeting message. The function should also log the greeting to the console.");
  const [steps, setSteps] = useState<Step[]>([
    { 
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
    }
  ]);
  const [selectedStep, setSelectedStep] = useState<number | null>(1);

  const addStep = () => {
    const newStep: Step = {
      id: steps.length + 1,
      description: "",
      lineStart: 1,
      lineEnd: 1,
    };
    setSteps([...steps, newStep]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Task submitted:", { title, code, description, steps });
  };

  const codeLines = code.split("\n");

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-secondary px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
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
              <div className="flex flex-col bg-code-bg py-4 pl-4 pr-2 text-right font-mono text-sm text-code-lineNumber select-none">
                {codeLines.map((_, i) => {
                  const lineNum = i + 1;
                  const isHighlighted = selectedStep !== null && 
                    steps.find(s => s.id === selectedStep)?.lineStart! <= lineNum &&
                    steps.find(s => s.id === selectedStep)?.lineEnd! >= lineNum;
                  
                  return (
                    <div 
                      key={i} 
                      className={`h-6 flex items-center justify-end ${isHighlighted ? 'text-primary font-semibold' : ''}`}
                    >
                      {lineNum}
                    </div>
                  );
                })}
              </div>

              {/* Code Content */}
              <div className="flex-1 py-4 pr-4 relative">
                {selectedStep !== null && (
                  <div 
                    className="absolute left-0 right-0 bg-primary/10 pointer-events-none transition-all duration-200"
                    style={{ 
                      top: `${((steps.find(s => s.id === selectedStep)?.lineStart || 1) - 1) * 24 + 16}px`,
                      height: `${((steps.find(s => s.id === selectedStep)?.lineEnd || 1) - (steps.find(s => s.id === selectedStep)?.lineStart || 1) + 1) * 24}px`
                    }}
                  />
                )}
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
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Task Description
              </CardTitle>
              <CardDescription>
                Describe what students need to accomplish
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write a clear description of the task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
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
                    Task Steps
                  </CardTitle>
                  <CardDescription>
                    Link steps to specific lines of code
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={addStep}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Step
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`rounded-lg border p-4 transition-all cursor-pointer ${
                    selectedStep === step.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedStep(step.id)}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Step {index + 1}
                    </span>
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

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Step Description</Label>
                      <Textarea
                        placeholder="Describe this step..."
                        value={step.description}
                        onChange={(e) =>
                          updateStep(step.id, "description", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        rows={2}
                        className="mt-1"
                      />
                    </div>

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
                          className="mt-1"
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
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherUpload;
