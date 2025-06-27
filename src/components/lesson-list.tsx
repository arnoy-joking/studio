"use client";

import { useState, useEffect } from "react";
import type { Lesson } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, CheckCircle, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/user-context";

interface LessonListProps {
  lessons: Lesson[];
}

export function LessonList({ lessons }: LessonListProps) {
  const { currentUser, isLoading } = useUser();
  const [activeLessonId, setActiveLessonId] = useState(lessons[0]?.id || "");
  const [watchedLessons, setWatchedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!currentUser) return;
    
    const storedWatched = new Set<string>();
    lessons.forEach(lesson => {
      try {
        if (localStorage.getItem(`progress_${currentUser.id}_${lesson.videoId}`) === 'watched') {
          storedWatched.add(lesson.id);
        }
      } catch (e) {
        // localStorage not available
      }
    });
    setWatchedLessons(storedWatched);
  }, [lessons, currentUser]);

  const handleLessonClick = (lesson: Lesson) => {
    if (!currentUser) return;

    setActiveLessonId(lesson.id);
    const event = new CustomEvent("changeVideo", {
      detail: { videoId: lesson.videoId, title: lesson.title },
    });
    window.dispatchEvent(event);

    setTimeout(() => {
      setWatchedLessons(prev => new Set(prev).add(lesson.id));
      try {
        localStorage.setItem(`progress_${currentUser.id}_${lesson.videoId}`, 'watched');
      } catch (e) {
        // localStorage not available
      }
    }, 5000);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Content</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {lessons.map((lesson, index) => {
            const isActive = lesson.id === activeLessonId;
            const isWatched = watchedLessons.has(lesson.id);
            return (
              <li
                key={lesson.id}
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
                    {isActive ? (
                      <PlayCircle className="w-6 h-6 text-primary" />
                    ) : isWatched ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
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
                <a
                  href={lesson.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-muted-foreground hover:text-primary"
                  aria-label={`Download materials for ${lesson.title}`}
                >
                  <Download className="h-5 w-5" />
                </a>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
