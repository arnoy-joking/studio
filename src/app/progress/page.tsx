'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Compass, User, CheckCircle } from 'lucide-react';
import { getCoursesAction } from '@/app/actions/course-actions';
import { getUsersAction } from '@/app/actions/user-actions';
import { getAllProgressAction } from '@/app/actions/progress-actions';
import type { User as UserType, Course, Lesson } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type ProgressData = Record<string, Set<string>>;

export default function ProgressPage() {
    const [progress, setProgress] = useState<ProgressData>({});
    const [users, setUsers] = useState<UserType[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const [fetchedUsers, fetchedCourses, allProgress] = await Promise.all([
                getUsersAction(), 
                getCoursesAction(),
                getAllProgressAction()
            ]);
            setUsers(fetchedUsers);
            setCourses(fetchedCourses);

            const progressData: ProgressData = {};
            for (const userId in allProgress) {
                progressData[userId] = new Set(allProgress[userId]);
            }
            
            setProgress(progressData);
            setIsLoading(false);
        }
        loadData();
    }, []);

    const allLessonsCount = courses.reduce((acc, course) => acc + course.lessons.length, 0);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Compass className="w-8 h-8" />
                    <span>Course Compass</span>
                </Link>
                <nav className="flex gap-4 items-center">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </nav>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-headline font-bold text-primary">Learner Progress</h1>
                        <p className="text-muted-foreground mt-2">A public overview of everyone's learning journey.</p>
                    </div>

                    {isLoading ? (
                         <div className="space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                         </div>
                    ) : (
                        <Accordion type="multiple" defaultValue={users.map(u => u.id)} className="w-full">
                            {users.map(user => {
                                const watchedLessons = progress[user.id] || new Set();
                                const completedCount = watchedLessons.size;
                                const percentage = allLessonsCount > 0 ? Math.round((completedCount / allLessonsCount) * 100) : 0;
                                
                                return (
                                <AccordionItem value={user.id} key={user.id}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-4 w-full pr-4">
                                            <div className="flex items-center gap-2 flex-1">
                                                <User className="h-5 w-5 text-primary" />
                                                <span className="font-semibold text-lg">{user.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">{percentage}% complete</div>
                                                <div className="text-sm text-muted-foreground">{completedCount} / {allLessonsCount} lessons</div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 pt-2">
                                            {courses.map(course => {
                                                const courseWatchedLessons = course.lessons.filter(l => watchedLessons.has(l.id));
                                                if (courseWatchedLessons.length === 0) return null;

                                                return (
                                                    <Card key={`${user.id}-${course.id}`}>
                                                        <CardHeader className="pb-2">
                                                            <CardTitle className="text-base">{course.title}</CardTitle>
                                                            <CardDescription>{courseWatchedLessons.length} of {course.lessons.length} lessons watched</CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                                                                {courseWatchedLessons.map(lesson => (
                                                                    <li key={lesson.id} className="flex items-center gap-2">
                                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                                        <span>{lesson.title}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })}
                                            {watchedLessons.size === 0 && (
                                                <p className="text-muted-foreground text-center py-4">No progress recorded yet for {user.name}.</p>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )})}
                        </Accordion>
                    )}
                </div>
            </main>
        </div>
    );
}
