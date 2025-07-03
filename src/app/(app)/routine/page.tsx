'use client';

import { useState, useEffect } from 'react';
import type { Course, WeeklyRoutine } from '@/lib/types';
import { getCoursesAction } from '@/app/actions/course-actions';
import { getRoutineAction, saveRoutineAction } from '@/app/actions/routine-actions';
import { useUser } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Loader2, Save } from 'lucide-react';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOTS_PER_DAY = 4;

const createInitialRoutine = (): WeeklyRoutine => {
  return DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day.toLowerCase()] = Array(SLOTS_PER_DAY).fill({ time: '', courseId: null });
    return acc;
  }, {} as WeeklyRoutine);
};

export default function RoutinePage() {
  const { currentUser, isLoading: isUserLoading } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [routine, setRoutine] = useState<WeeklyRoutine>(createInitialRoutine());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      setIsLoading(true);

      const [fetchedCourses, savedRoutine] = await Promise.all([
        getCoursesAction(),
        getRoutineAction(currentUser.id),
      ]);
      
      setCourses(fetchedCourses);

      const initialRoutine = createInitialRoutine();
      if (savedRoutine) {
          for (const day of Object.keys(initialRoutine)) {
              if (savedRoutine[day]) {
                  const dayEntries = savedRoutine[day];
                  const paddedEntries = [...dayEntries];
                  while (paddedEntries.length < SLOTS_PER_DAY) {
                      paddedEntries.push({ time: '', courseId: null });
                  }
                  initialRoutine[day] = paddedEntries.slice(0, SLOTS_PER_DAY);
              }
          }
      }
      setRoutine(initialRoutine);
      setIsLoading(false);
    }

    if (!isUserLoading) {
      loadData();
    }
  }, [currentUser, isUserLoading]);

  const handleRoutineChange = (day: string, index: number, field: 'time' | 'courseId', value: string | null) => {
    const newRoutine = { ...routine };
    const daySchedule = [...newRoutine[day]];
    daySchedule[index] = { ...daySchedule[index], [field]: value };
    newRoutine[day] = daySchedule;
    setRoutine(newRoutine);
  };
  
  const handleSaveRoutine = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    const result = await saveRoutineAction(currentUser.id, routine);
    if (result.success) {
      toast({ title: 'Success', description: 'Your routine has been saved.' });
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
    setIsSaving(false);
  };

  if (isLoading || isUserLoading) {
    return (
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DAYS_OF_WEEK.map(day => (
              <Card key={day}>
                <CardHeader><Skeleton className="h-6 w-24" /></CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(SLOTS_PER_DAY)].map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 flex-1" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight text-primary flex items-center gap-2">
              <CalendarDays className="w-8 h-8" />
              Weekly Study Routine
            </h1>
            <p className="text-muted-foreground mt-2">
              Plan your week to stay on track with your learning goals.
            </p>
          </div>
          <Button onClick={handleSaveRoutine} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
            Save Routine
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {DAYS_OF_WEEK.map(day => {
            const dayKey = day.toLowerCase();
            return (
              <Card key={day}>
                <CardHeader>
                  <CardTitle>{day}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(routine[dayKey] || []).map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="time"
                        className="w-[120px]"
                        value={entry.time || ''}
                        onChange={e => handleRoutineChange(dayKey, index, 'time', e.target.value)}
                      />
                      <Select
                        value={entry.courseId || 'none'}
                        onValueChange={value => handleRoutineChange(dayKey, index, 'courseId', value === 'none' ? null : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {courses.map(course => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
