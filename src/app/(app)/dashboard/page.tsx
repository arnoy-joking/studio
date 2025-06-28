'use client';
import { useEffect, useState } from 'react';
import { CourseList } from "@/components/dashboard/course-list";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { ClassGoalCard } from "@/components/dashboard/progress-summary-card";
import { getCoursesAction } from '@/app/actions/course-actions';
import type { Course } from '@/lib/types';
import { useUser } from '@/context/user-context';
import { Skeleton } from '@/components/ui/skeleton';

type ProgressData = Record<string, Set<string>>;

export default function DashboardPage() {
  const { currentUser, isLoading: isUserLoading } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [watchedLessonsCount, setWatchedLessonsCount] = useState(0);
  const [progress, setProgress] = useState<ProgressData>({});


  useEffect(() => {
    async function loadCourses() {
      setIsLoadingCourses(true);
      const fetchedCourses = await getCoursesAction();
      setCourses(fetchedCourses);
      setIsLoadingCourses(false);
    }
    loadCourses();
  }, []);

  useEffect(() => {
    if (!currentUser || courses.length === 0) return;

    const progressData: ProgressData = {};
    let totalWatchedCount = 0;

    for (const course of courses) {
        progressData[course.id] = new Set();
        for (const lesson of course.lessons) {
            try {
                if (localStorage.getItem(`progress_${currentUser.id}_${lesson.videoId}`) === 'watched') {
                    progressData[course.id].add(lesson.id);
                }
            } catch (e) {
                // localStorage not available
            }
        }
        totalWatchedCount += progressData[course.id].size;
    }
    
    setProgress(progressData);
    setWatchedLessonsCount(totalWatchedCount);
  }, [currentUser, courses]);


  if (isUserLoading || isLoadingCourses) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <Skeleton className="h-10 w-1/2 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-96 w-full rounded-lg" />
                </div>
                <div className="space-y-8 lg:sticky lg:top-24">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <CourseList courses={courses} progress={progress} />
          </div>
          <div className="space-y-8 lg:sticky lg:top-24">
            <ClassGoalCard watchedCount={watchedLessonsCount} />
            <GoalsCard />
          </div>
        </div>
      </div>
    </main>
  );
}
