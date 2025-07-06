'use client';
import { useEffect, useState } from 'react';
import { CourseList } from "@/components/dashboard/course-list";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { ClassGoalCard } from "@/components/dashboard/progress-summary-card";
import { getCoursesAction } from '@/app/actions/course-actions';
import { getWatchedLessonIdsAction, getLessonsWatchedTodayCountAction } from '@/app/actions/progress-actions';
import type { Course } from '@/lib/types';
import { useUser } from '@/context/user-context';
import { Skeleton } from '@/components/ui/skeleton';

type ProgressData = Record<string, Set<string>>;

export default function DashboardPage() {
  const { currentUser, isLoading: isUserLoading } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [watchedLessonsCount, setWatchedLessonsCount] = useState(0);
  const [dailyWatchedCount, setDailyWatchedCount] = useState(0);
  const [progress, setProgress] = useState<ProgressData>({});

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      setIsLoading(true);
      const [fetchedCourses, watchedLessonIds, dailyCount] = await Promise.all([
        getCoursesAction(),
        getWatchedLessonIdsAction(currentUser.id),
        getLessonsWatchedTodayCountAction(currentUser.id)
      ]);
      setCourses(fetchedCourses);

      const progressDataSets: ProgressData = {};
      fetchedCourses.forEach(c => {
        progressDataSets[c.id] = new Set();
      });

      fetchedCourses.forEach(course => {
        course.lessons.forEach(lesson => {
          if (watchedLessonIds.has(lesson.id)) {
            progressDataSets[course.id].add(lesson.id);
          }
        });
      });

      setProgress(progressDataSets);
      setWatchedLessonsCount(watchedLessonIds.size);
      setDailyWatchedCount(dailyCount);
      setIsLoading(false);
    }

    if (!isUserLoading) {
      loadData();
    }
  }, [currentUser, isUserLoading]);


  if (isLoading || isUserLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <Skeleton className="h-10 w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2 space-y-8">
                    <Skeleton className="h-96 w-full rounded-lg" />
                </div>
                <div className="space-y-8 md:sticky md:top-24">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-72 w-full rounded-lg" />
                </div>
            </div>
        </div>
      </main>
    )
  }


  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-primary mb-8">
          Welcome back, {currentUser?.name || 'Learner'}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-8">
            <CourseList courses={courses} progress={progress} />
          </div>
          <div className="space-y-8 md:sticky md:top-24">
            <ClassGoalCard watchedCount={dailyWatchedCount} />
            <GoalsCard />
          </div>
        </div>
      </div>
    </main>
  );
}
