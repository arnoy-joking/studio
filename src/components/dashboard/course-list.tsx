import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Course } from "@/lib/types";

interface CourseListProps {
  courses: Course[];
  progress: Record<string, Set<string>>;
}

export function CourseList({ courses, progress }: CourseListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Courses</CardTitle>
        <CardDescription>
          Continue your learning journey and track your progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {courses.map((course) => {
          const watchedLessonsInCourse = progress[course.id]?.size || 0;
          const isStarted = watchedLessonsInCourse > 0;

          return (
             <div
              key={course.id}
              className="flex flex-col md:flex-row items-start gap-6 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={320}
                height={180}
                className="rounded-md aspect-video object-cover w-full md:w-80 flex-shrink-0"
                data-ai-hint="online course"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.description}
                </p>
              </div>
              <div className="flex md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 self-center">
                 <Button asChild className="w-full">
                  <Link href={`/class/${course.slug}`}>
                    <BookOpen className="mr-2" />
                    {isStarted ? "Continue" : "Start"}
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  );
}
