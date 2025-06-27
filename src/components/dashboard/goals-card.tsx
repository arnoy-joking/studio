"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Goal, Edit, Check } from "lucide-react";

export function GoalsCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [goals, setGoals] = useState(
    "1. Finish the React course by the end of the month.\n2. Build a small project using Next.js.\n3. Get comfortable with TypeScript."
  );
  const [editedGoals, setEditedGoals] = useState(goals);

  const handleSave = () => {
    setGoals(editedGoals);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditedGoals(goals);
    setIsEditing(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Goal />
          Learning Goals
        </CardTitle>
        <CardDescription>
          Set personal goals to stay focused and motivated.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedGoals}
            onChange={(e) => setEditedGoals(e.target.value)}
            className="min-h-[120px] font-code"
            aria-label="Edit your learning goals"
          />
        ) : (
          <div className="whitespace-pre-wrap p-3 text-sm min-h-[120px]">
            {goals || (
              <p className="text-muted-foreground">
                No goals set yet. Click Edit to add some!
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isEditing ? (
          <Button onClick={handleSave} className="ml-auto">
            <Check className="mr-2" />
            Save Goals
          </Button>
        ) : (
          <Button onClick={handleEdit} variant="outline" className="ml-auto">
            <Edit className="mr-2" />
            Edit Goals
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
