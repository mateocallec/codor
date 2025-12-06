import { useState } from "react";
import { Code, ArrowLeft, ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface StudentSubmission {
  studentId: number;
  studentName: string;
  status: "completed" | "in-progress" | "not-started";
  score: number | null;
  timeSpent: string;
  aiInteractions: number;
  commonIssues: string[];
}

interface Exercise {
  id: number;
  title: string;
  submissions: StudentSubmission[];
}

const mockExercises: Exercise[] = [
  {
    id: 1,
    title: "Build a Greeting Function",
    submissions: [
      {
        studentId: 1,
        studentName: "Alex Chen",
        status: "completed",
        score: 95,
        timeSpent: "25 min",
        aiInteractions: 12,
        commonIssues: [
          "Initially forgot to return the greeting",
          "Had trouble with string concatenation syntax",
          "Needed help understanding function parameters"
        ]
      },
      {
        studentId: 2,
        studentName: "Maria Garcia",
        status: "completed",
        score: 88,
        timeSpent: "32 min",
        aiInteractions: 18,
        commonIssues: [
          "Struggled with console.log placement",
          "Asked about the difference between return and console.log",
          "Needed clarification on variable scope"
        ]
      },
      {
        studentId: 3,
        studentName: "James Wilson",
        status: "in-progress",
        score: null,
        timeSpent: "15 min",
        aiInteractions: 8,
        commonIssues: [
          "Currently working on return statement",
          "Asked about function naming conventions"
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Array Manipulation",
    submissions: [
      {
        studentId: 1,
        studentName: "Alex Chen",
        status: "completed",
        score: 92,
        timeSpent: "40 min",
        aiInteractions: 15,
        commonIssues: [
          "Needed help with array methods",
          "Confused about map vs forEach"
        ]
      },
      {
        studentId: 2,
        studentName: "Maria Garcia",
        status: "not-started",
        score: null,
        timeSpent: "0 min",
        aiInteractions: 0,
        commonIssues: []
      }
    ]
  }
];

const StudentProgress = () => {
  const navigate = useNavigate();
  const [openExercises, setOpenExercises] = useState<number[]>([1]);

  const toggleExercise = (id: number) => {
    setOpenExercises(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "not-started":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "";
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "";
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-secondary px-6 py-4">
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
              <h1 className="font-semibold text-foreground">Student Progress</h1>
              <p className="text-xs text-muted-foreground">Track and analyze student performance</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl space-y-4">
          {mockExercises.map((exercise) => (
            <Collapsible
              key={exercise.id}
              open={openExercises.includes(exercise.id)}
              onOpenChange={() => toggleExercise(exercise.id)}
            >
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {openExercises.includes(exercise.id) ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div className="text-left">
                          <CardTitle>{exercise.title}</CardTitle>
                          <CardDescription>
                            {exercise.submissions.length} student{exercise.submissions.length !== 1 ? "s" : ""}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {exercise.submissions.filter(s => s.status === "completed").length}/{exercise.submissions.length} completed
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="space-y-3 pt-0">
                    {exercise.submissions.map((submission) => (
                      <Card key={submission.studentId} className="border-l-4 border-l-primary/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <CardTitle className="text-lg">{submission.studentName}</CardTitle>
                                <span
                                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(
                                    submission.status
                                  )}`}
                                >
                                  {submission.status.replace("-", " ")}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                                <span>⏱️ {submission.timeSpent}</span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {submission.aiInteractions} AI interactions
                                </span>
                                {submission.score !== null && (
                                  <span className={`font-semibold ${getScoreColor(submission.score)}`}>
                                    Score: {submission.score}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        {submission.commonIssues.length > 0 && (
                          <CardContent>
                            <div className="rounded-lg bg-muted/50 p-3">
                              <h4 className="mb-2 text-sm font-medium text-foreground">
                                Common Issues & AI Interactions:
                              </h4>
                              <ul className="space-y-1">
                                {submission.commonIssues.map((issue, index) => (
                                  <li key={index} className="text-sm text-muted-foreground flex gap-2">
                                    <span className="text-primary">•</span>
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentProgress;
