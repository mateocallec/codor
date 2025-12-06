import { useState } from "react";
import { Code, ArrowLeft, User, Clock, MessageSquare, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

interface StudentSubmission {
  studentId: number;
  studentName: string;
  status: "completed" | "in-progress" | "not-started";
  score: number | null;
  timeSpent: string;
  aiInteractions: number;
  commonIssues: string[];
  deductions?: Array<{
    reason: string;
    points: number;
  }>;
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
        ],
        deductions: [
          { reason: "Missing semicolon in line 3", points: 3 },
          { reason: "Inefficient string concatenation method", points: 2 }
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
        ],
        deductions: [
          { reason: "Incorrect variable naming convention", points: 4 },
          { reason: "Missing error handling", points: 5 },
          { reason: "Code not properly indented", points: 3 }
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
        ],
        deductions: [
          { reason: "Incorrect use of filter method", points: 5 },
          { reason: "Mutation of original array", points: 3 }
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
  const [selectedExercise, setSelectedExercise] = useState<number | null>(1);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/40";
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/40";
      case "not-started":
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/40";
      default:
        return "";
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "";
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const selectedExerciseData = mockExercises.find(e => e.id === selectedExercise);
  const selectedStudentData = selectedExerciseData?.submissions.find(s => s.studentId === selectedStudent);

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
              <h1 className="font-semibold text-foreground">Student Progress</h1>
              <p className="text-xs text-muted-foreground">Track and analyze student performance</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Exercise List */}
        <div className="w-80 border-r border-border overflow-auto p-4 space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">EXERCISES</h2>
          {mockExercises.map((exercise) => (
            <Card
              key={exercise.id}
              className={`cursor-pointer transition-all hover:scale-[1.02] backdrop-blur-md bg-white/40 dark:bg-slate-900/40 ${
                selectedExercise === exercise.id
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "hover:border-primary/50"
              }`}
              onClick={() => {
                setSelectedExercise(exercise.id);
                setSelectedStudent(null);
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{exercise.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <User className="h-3 w-3" />
                  {exercise.submissions.length} students
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-semibold text-primary">
                    {exercise.submissions.filter(s => s.status === "completed").length}/{exercise.submissions.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Middle - Student List */}
        {selectedExerciseData && (
          <div className="w-96 border-r border-border overflow-auto p-4 space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">STUDENTS</h2>
            {selectedExerciseData.submissions.map((submission) => (
              <Card
                key={submission.studentId}
                className={`cursor-pointer transition-all hover:scale-[1.02] backdrop-blur-md bg-white/40 dark:bg-slate-900/40 ${
                  selectedStudent === submission.studentId
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedStudent(submission.studentId)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{submission.studentName}</CardTitle>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(
                        submission.status
                      )}`}
                    >
                      {submission.status.replace("-", " ")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {submission.timeSpent}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    {submission.aiInteractions} AI chats
                  </div>
                  {submission.score !== null && (
                    <div className="flex items-center gap-2 text-xs">
                      <Award className="h-3 w-3 text-primary" />
                      <span className={`font-semibold ${getScoreColor(submission.score)}`}>
                        {submission.score}%
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Right - Student Details */}
        <div className="flex-1 overflow-auto p-6">
          {selectedStudentData ? (
            <div className="mx-auto max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedStudentData.studentName}</h2>
                <p className="text-muted-foreground">{selectedExerciseData?.title}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="backdrop-blur-md bg-white/40 dark:bg-slate-900/40">
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-2 text-xs">
                      <Clock className="h-4 w-4" />
                      Time Spent
                    </CardDescription>
                    <CardTitle className="text-2xl">{selectedStudentData.timeSpent}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="backdrop-blur-md bg-white/40 dark:bg-slate-900/40">
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-2 text-xs">
                      <MessageSquare className="h-4 w-4" />
                      AI Interactions
                    </CardDescription>
                    <CardTitle className="text-2xl">{selectedStudentData.aiInteractions}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="backdrop-blur-md bg-white/40 dark:bg-slate-900/40">
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-2 text-xs">
                      <Award className="h-4 w-4" />
                      Score
                    </CardDescription>
                    <CardTitle className={`text-2xl ${getScoreColor(selectedStudentData.score)}`}>
                      {selectedStudentData.score !== null ? `${selectedStudentData.score}%` : "N/A"}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* Issues Section */}
              {selectedStudentData.commonIssues.length > 0 && (
                <Card className="backdrop-blur-md bg-white/40 dark:bg-slate-900/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      AI Tutor Interactions
                    </CardTitle>
                    <CardDescription>
                      Questions and topics discussed with the AI tutor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {selectedStudentData.commonIssues.map((issue, index) => (
                        <li key={index} className="flex gap-3 p-3 rounded-lg bg-muted/30 backdrop-blur-sm">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm text-foreground">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Score Deductions */}
              {selectedStudentData.deductions && selectedStudentData.deductions.length > 0 && (
                <Card className="backdrop-blur-md bg-white/40 dark:bg-slate-900/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-red-500" />
                      Score Deductions
                    </CardTitle>
                    <CardDescription>
                      Reasons why points were deducted from the final score
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedStudentData.deductions.map((deduction, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400 flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-sm text-foreground">{deduction.reason}</span>
                          </div>
                          <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold text-sm">
                            <span>-{deduction.points}</span>
                            <span className="text-xs">pts</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 backdrop-blur-sm border border-border mt-4">
                        <span className="text-sm font-semibold text-foreground">Total Points Lost</span>
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                          -{selectedStudentData.deductions.reduce((sum, d) => sum + d.points, 0)} pts
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No student selected</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Select a student from the list to view their progress
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentProgress;
