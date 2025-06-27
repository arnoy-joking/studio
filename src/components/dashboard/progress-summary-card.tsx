import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Target } from "lucide-react";

interface ProgressSummaryCardProps {
  completed: number;
  total: number;
}

export function ProgressSummaryCard({
  completed,
  total,
}: ProgressSummaryCardProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remaining = total - completed;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target />
          Progress Summary
        </CardTitle>
        <CardDescription>Your overall learning progress.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div className="relative h-24 w-24">
          <svg className="h-full w-full" viewBox="0 0 36 36">
            <path
              className="stroke-current text-muted/50"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3"
            />
            <path
              className="stroke-current text-primary transition-all duration-500"
              strokeDasharray={`${percentage}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{percentage}%</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold">{completed} Completed</p>
              <p className="text-xs text-muted-foreground">Well done!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-accent" />
            </div>
            <div>
              <p className="font-semibold">{remaining} Remaining</p>
              <p className="text-xs text-muted-foreground">Keep going!</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
