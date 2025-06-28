import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Target, BookOpen } from "lucide-react";

interface ClassGoalCardProps {
  watchedCount: number;
}

const WEEKLY_GOAL = 4;

export function ClassGoalCard({
  watchedCount,
}: ClassGoalCardProps) {
  const remaining = Math.max(0, WEEKLY_GOAL - watchedCount);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target />
          Weekly Goal
        </CardTitle>
        <CardDescription>Your goal is to watch {WEEKLY_GOAL} classes this week.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-lg">{watchedCount}</p>
              <p className="text-sm text-muted-foreground">Classes watched</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
            <BookOpen className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold text-lg">{remaining}</p>
              <p className="text-sm text-muted-foreground">Classes left to watch</p>
            </div>
          </div>
          {remaining === 0 && watchedCount > 0 && (
             <p className="text-sm font-medium text-center text-green-600 pt-2">
                Great job! You've met your weekly goal!
             </p>
          )}
      </CardContent>
    </Card>
  );
}
