import { Code, Plus, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const teacherName = "Sarah Johnson"; // This would come from auth context

  return (
    <div className="flex h-screen flex-col relative overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-secondary px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
              <Code className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CodeLearn</h1>
              <p className="text-xs text-muted-foreground">Teacher Dashboard</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Welcome back, {teacherName}! 👋
            </h2>
            <p className="mt-2 text-muted-foreground">
              Manage your coding exercises and track student progress
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Create Exercise Card */}
            <Card 
              className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105 relative overflow-hidden"
              onClick={() => navigate("/teacher/upload")}
            >
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[2px] bg-gradient-to-r from-blue-500 via-purple-600 via-blue-500 to-purple-600 bg-[length:200%_100%] animate-gradient">
                <div className="h-full w-full rounded-lg bg-card" />
              </div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-center py-8">
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
                    <Plus className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardTitle className="text-center text-xl">Create Exercise</CardTitle>
                <CardDescription className="text-center">
                  Design a new coding task with step-by-step guidance for your students
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Student Progress Card */}
            <Card 
              className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105 relative overflow-hidden"
              onClick={() => navigate("/teacher/progress")}
            >
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[2px] bg-gradient-to-r from-blue-500 via-purple-600 via-blue-500 to-purple-600 bg-[length:200%_100%] animate-gradient">
                <div className="h-full w-full rounded-lg bg-card" />
              </div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-center py-8">
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
                    <ClipboardList className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardTitle className="text-center text-xl">Student Progress</CardTitle>
                <CardDescription className="text-center">
                  Review student submissions, track progress, and analyze AI tutor interactions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Exercises</CardDescription>
                <CardTitle className="text-3xl">12</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Students</CardDescription>
                <CardTitle className="text-3xl">45</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Avg. Completion Rate</CardDescription>
                <CardTitle className="text-3xl">87%</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
