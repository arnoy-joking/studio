"use client";

import { useState, useEffect, useRef } from "react";
import type { Lesson } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, CheckCircle, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/user-context";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LessonListProps {
  lessons: Lesson[];
  activeLessonId: string;
  onLessonClick: (lesson: Lesson) => void;
  courseId: string;
}

function parseDurationToMs(duration: string): number {
    const parts = duration.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 3) { // HH:MM:SS
        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) { // MM:SS
        seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 1) { // SS
        seconds = parts[0];
    }
    return seconds * 1000;
}


export function LessonList({
  lessons,
  activeLessonId,
  onLessonClick,
  courseId,
}: LessonListProps) {
  const { currentUser, isLoading } = useUser();
  const [watchedLessons, setWatchedLessons] = useState<Set<string>>(new Set());
  const lessonRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    const activeLessonElement = lessonRefs.current.get(activeLessonId);
    if (activeLessonElement) {
      setTimeout(() => {
        activeLessonElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [activeLessonId]);

  useEffect(() => {
    if (!currentUser) return;

    const storedWatched = new Set<string>();
    lessons.forEach((lesson) => {
      try {
        if (
          localStorage.getItem(`progress_${currentUser.id}_${lesson.videoId}`) === "watched"
        ) {
          storedWatched.add(lesson.id);
        }
      } catch (e) {
        // localStorage not available
      }
    });
    setWatchedLessons(storedWatched);

    const activeLesson = lessons.find((l) => l.id === activeLessonId);
    if (activeLesson && !watchedLessons.has(activeLesson.id)) {
      const durationInMs = parseDurationToMs(activeLesson.duration);
      const timeoutId = setTimeout(() => {
        setWatchedLessons((prev) => new Set(prev).add(activeLesson.id));
        try {
          localStorage.setItem(
            `progress_${currentUser.id}_${activeLesson.videoId}`,
            "watched"
          );
        } catch (e) {
          // localStorage not available
        }
      }, durationInMs); // Use full lesson duration
      return () => clearTimeout(timeoutId);
    }
  }, [lessons, currentUser, activeLessonId]);

  const handleLessonClick = (lesson: Lesson) => {
    onLessonClick(lesson);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 bg-muted rounded animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Content</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
            <ul className="space-y-1 pr-4">
            {lessons.map((lesson, index) => {
                const isActive = lesson.id === activeLessonId;
                const isWatched = watchedLessons.has(lesson.id);
                return (
                <li
                    key={lesson.id}
                    ref={(el) => lessonRefs.current.set(lesson.id, el)}
                    className={cn(
                    "flex items-center justify-between rounded-md transition-colors",
                    isActive ? "bg-secondary" : "hover:bg-muted/50"
                    )}
                >
                    <button
                    className="flex-1 flex items-start gap-4 p-3 text-left"
                    onClick={() => handleLessonClick(lesson)}
                    >
                    <div className="flex flex-col items-center pt-1">
                        {isClient ? (
                        isActive ? (
                            <PlayCircle className="w-6 h-6 text-primary" />
                        ) : isWatched ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                            <span className="font-bold text-lg text-muted-foreground w-6 text-center">
                            {index + 1}
                            </span>
                        )
                        ) : (
                            <span className="font-bold text-lg text-muted-foreground w-6 text-center">
                                {index + 1}
                            </span>
                        )}
                    </div>

                    <div className="flex-1">
                        <p
                        className={cn(
                            "font-medium leading-snug",
                            isActive && "text-primary"
                        )}
                        >
                        {lesson.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                        {lesson.duration}
                        </p>
                    </div>
                    </button>
                    {lesson.pdfUrl &&
                        <a
                        href={lesson.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 text-muted-foreground hover:text-primary"
                        aria-label={`Download materials for ${lesson.title}`}
                        >
                            <Download className="h-5 w-5" />
                        </a>
                    }
                </li>
                );
            })}
            </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
