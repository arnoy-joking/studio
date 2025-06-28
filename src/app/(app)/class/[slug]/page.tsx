'use client';

import { useEffect, useState } from "react";
import type { Course } from "@/lib/types";
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


export default function ClassPage({
  params,
}: {
  params: { slug: string };
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      const fetchedCourse = await getCourseBySlug(params.slug);
      if (fetchedCourse) {
        setCourse(fetchedCourse);
        setCurrentPdfUrl(fetchedCourse.lessons[0]?.pdfUrl || '');
      }
      setIsLoading(false);
    }
    loadCourse();
  }, [params.slug]);

  useEffect(() => {
    const handleVideoChange = (event: CustomEvent) => {
      if (event.detail.pdfUrl) {
        setCurrentPdfUrl(event.detail.pdfUrl);
      }
    };

    window.addEventListener("changeVideo", handleVideoChange as EventListener);
    return () => {
      window.removeEventListener("changeVideo", handleVideoChange as EventListener);
    };
  }, []);

  if (isLoading) {
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
    const [minutes, seconds] = lesson.duration.split(':').map(Number);
    return acc + minutes * 60 + seconds;
  }, 0);

  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);


  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer
              initialVideoId={course.lessons[0].videoId}
              initialTitle={course.lessons[0].title}
            />
            {currentPdfUrl && (
                 <Button asChild>
                    <a href={currentPdfUrl} target="_blank" rel="noopener noreferrer">
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
            <LessonList lessons={course.lessons} />
          </div>
        </div>
      </div>
    </main>
  );
}
