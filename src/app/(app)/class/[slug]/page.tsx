'use client';

import { useEffect, useState } from "react";
import type { Course, Lesson } from "@/lib/types";
import { getCourseBySlug } from "@/lib/courses";
import { VideoPlayer } from "@/components/video-player";
import { LessonList } from "@/components/lesson-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/user-context";


export default function ClassPage({
  params,
}: {
  params: { slug: string };
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isLoading: isUserLoading } = useUser();

  useEffect(() => {
    async function loadCourse() {
      if (!currentUser) return;
      setIsLoading(true);
      
      const fetchedCourse = await getCourseBySlug(params.slug);
      if (fetchedCourse) {
        setCourse(fetchedCourse);
        
        let lastWatchedLessonId: string | null = null;
        try {
           lastWatchedLessonId = localStorage.getItem(`last_watched_lesson_${currentUser.id}_${fetchedCourse.id}`);
        } catch (e) {
          // localStorage not available
        }

        const initialLesson = fetchedCourse.lessons.find(l => l.id === lastWatchedLessonId) || fetchedCourse.lessons[0];
        setCurrentLesson(initialLesson || null);
      }
      setIsLoading(false);
    }

    if (!isUserLoading) {
        loadCourse();
    }
  }, [params.slug, currentUser, isUserLoading]);

  const handleSelectLesson = (lesson: Lesson) => {
    if (!currentUser || !course) return;
    setCurrentLesson(lesson);
    try {
        localStorage.setItem(`last_watched_lesson_${currentUser.id}_${course.id}`, lesson.id);
    } catch (e) {
        // localStorage not available
    }
  };

  if (isLoading || isUserLoading) {
     return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <Skeleton className="w-full aspect-video rounded-lg" />
                         <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-64 w-full rounded-lg" />
                    </div>
                    <div className="lg:sticky lg:top-24">
                       <Skeleton className="h-96 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </main>
     )
  }

  if (!course) {
    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-2xl font-bold">Course not found</h1>
                <p className="text-muted-foreground">The course you are looking for does not exist.</p>
                 <Button asChild className="mt-4">
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        </main>
    )
  }

  const totalDuration = course.lessons.reduce((acc, lesson) => {
    const parts = lesson.duration.split(':').map(Number);
    let lessonSeconds = 0;
    if (parts.length === 3) { // HH:MM:SS
      lessonSeconds = (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    } else if (parts.length === 2) { // MM:SS
      lessonSeconds = (parts[0] * 60) + parts[1];
    } else if (parts.length === 1) { // SS
      lessonSeconds = parts[0];
    }
    return acc + lessonSeconds;
  }, 0);

  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);


  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {currentLesson && (
              <VideoPlayer
                key={currentLesson.videoId}
                videoId={currentLesson.videoId}
                title={currentLesson.title}
              />
            )}
            {currentLesson?.pdfUrl && (
                 <Button asChild>
                    <a href={currentLesson.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF for current lesson
                    </a>
                </Button>
            )}
            <Card>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <Badge variant="outline">{course.lessons.length} Lessons</Badge>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{hours > 0 ? `${hours}h ` : ''}{minutes}m total</span>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2 text-lg">About this course</h3>
                <p className="text-muted-foreground">{course.description}</p>
              </CardContent>
            </Card>
          </div>
          <div className="lg:sticky lg:top-24">
            <LessonList
              lessons={course.lessons}
              courseId={course.id}
              activeLessonId={currentLesson?.id || ""}
              onLessonClick={handleSelectLesson}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
