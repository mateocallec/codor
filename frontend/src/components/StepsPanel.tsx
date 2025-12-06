import { useAppContext } from "@/contexts/AppContext";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const StepsPanel = () => {
  const { steps, setCodeHighlight } = useAppContext();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

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

  return (
    <div className="h-full overflow-auto p-4">
      <Card className="h-full border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Learning Steps
              </CardTitle>
              <CardDescription>
                Follow these steps to complete the exercise
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-0">
          {steps.map((step, index) => {
            const color = getStepColor(step.id);
            const isHovered = hoveredStep === step.id;
            
            return (
              <div key={step.id}>
                <div
                  className={`rounded-lg border-2 p-4 transition-all cursor-pointer backdrop-blur-md bg-white/40 dark:bg-slate-900/40 ${
                    isHovered
                      ? `${color.border} ${color.bg}`
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                  onMouseEnter={() => {
                    setHoveredStep(step.id);
                    setCodeHighlight({
                      startLine: step.lineStart,
                      endLine: step.lineEnd
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredStep(null);
                    setCodeHighlight(null);
                  }}
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
                  </div>

                  <div className="space-y-3">
                    <div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {step.description}
                        </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepsPanel;
