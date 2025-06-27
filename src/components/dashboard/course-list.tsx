import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Course } from "@/lib/types";

interface CourseListProps {
  courses: Course[];
}

export function CourseList({ courses }: CourseListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Courses</CardTitle>
        <CardDescription>
          Continue your learning journey and track your progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <Image
              src={course.thumbnail}
              alt={course.title}
              width={160}
              height={90}
              className="rounded-md aspect-video object-cover"
              data-ai-hint="online course"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {course.description}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Progress value={index === 0 ? 25 : 0} className="w-[60%]" />
                <span className="text-sm font-medium text-muted-foreground">
                  {index === 0 ? "25% complete" : "Not started"}
                </span>
              </div>
            </div>
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
               <Button asChild className="w-full">
                <Link href={`/class/${course.slug}`}>
                  <BookOpen className="mr-2" />
                  {index === 0 ? "Continue" : "Start"}
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
