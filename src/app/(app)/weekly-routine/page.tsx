'use client';

import { useState, useEffect, useRef } from 'react';
import { toJpeg } from 'html-to-image';
import type { Course, WeeklyRoutine } from '@/lib/types';
import { getCoursesAction } from '@/app/actions/course-actions';
import { getRoutineAction, saveRoutineAction, resetRoutineAction } from '@/app/actions/routine-actions';
import { useUser } from '@/context/user-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarDays, Save, X, RotateCcw, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const NUM_SLOTS = 4;

const generateInitialRoutine = (): WeeklyRoutine => {
    const routine: WeeklyRoutine = {};
    daysOfWeek.forEach(day => {
        routine[day] = Array.from({ length: NUM_SLOTS }, (_, i) => ({
            id: `${day}-${i}`,
            time: '',
            courseId: '',
        }));
    });
    return routine;
};

export default function WeeklyRoutinePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [routine, setRoutine] = useState<WeeklyRoutine>(generateInitialRoutine());
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const routineRef = useRef<HTMLDivElement>(null);
    const { currentUser, isLoading: isUserLoading } = useUser();

    useEffect(() => {
        async function loadInitialData() {
            if (!currentUser) return;
            setIsLoading(true);

            const [fetchedCourses, savedRoutine] = await Promise.all([
                getCoursesAction(),
                getRoutineAction(currentUser.id)
            ]);
            
            setCourses(fetchedCourses);

            if (savedRoutine) {
                setRoutine(savedRoutine);
            } else {
                setRoutine(generateInitialRoutine());
            }

            setIsLoading(false);
        }

        if (!isUserLoading) {
            loadInitialData();
        }
    }, [currentUser, isUserLoading]);

    const handleSlotChange = (day: string, slotIndex: number, field: 'time' | 'courseId', value: string) => {
        setRoutine(prevRoutine => {
            const newRoutine = { ...prevRoutine };
            newRoutine[day] = [...newRoutine[day]];
            newRoutine[day][slotIndex] = { ...newRoutine[day][slotIndex], [field]: value };
            return newRoutine;
        });
    };

    const handleClearSlot = (day: string, slotIndex: number) => {
        setRoutine(prevRoutine => {
            const newRoutine = { ...prevRoutine };
            newRoutine[day] = [...newRoutine[day]];
            newRoutine[day][slotIndex] = { ...newRoutine[day][slotIndex], time: '', courseId: '' };
            return newRoutine;
        });
    }

    const handleSaveRoutine = async () => {
        if (!currentUser) {
            toast({ title: 'Error', description: 'You must be logged in to save a routine.', variant: 'destructive' });
            return;
        }
        setIsSaving(true);
        try {
            await saveRoutineAction(currentUser.id, routine);
            toast({
                title: 'Routine Saved!',
                description: 'Your weekly study routine has been saved to your profile.',
            });
        } catch (error) {
            toast({
                title: 'Error Saving Routine',
                description: 'Could not save your routine. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleResetRoutine = async () => {
        if (!currentUser) return;
        
        setRoutine(generateInitialRoutine());
        try {
            await resetRoutineAction(currentUser.id);
            toast({
                title: 'Routine Reset!',
                description: 'Your weekly study routine has been cleared from your profile.',
            });
        } catch (error) {
             toast({
                title: 'Error Resetting Routine',
                description: 'Could not reset your routine. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const handleDownloadImage = async () => {
        if (!routineRef.current) return;

        setIsDownloading(true);
        try {
            const dataUrl = await toJpeg(routineRef.current, {
                quality: 0.95,
                backgroundColor: '#ffffff',
            });

            const link = document.createElement('a');
            link.download = 'weekly-routine.jpg';
            link.href = dataUrl;
            link.click();
        } catch (error) {
            toast({
                title: 'Download Failed',
                description: 'Could not generate the routine image. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading || isUserLoading) {
        return (
             <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <Skeleton className="h-10 w-1/2 mb-8" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {daysOfWeek.slice(0, 4).map(day => (
                            <Skeleton key={day} className="h-80 w-full" />
                        ))}
                    </div>
                </div>
            </main>
        )
    }
    
    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
                            <CalendarDays className="w-8 h-8" />
                            Weekly Routine
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Plan your study schedule for the week ahead. Saved to your profile.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleDownloadImage} variant="outline" disabled={isDownloading}>
                            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                            Download JPG
                        </Button>
                        <Button onClick={handleResetRoutine} variant="destructive" >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset Routine
                        </Button>
                        <Button onClick={handleSaveRoutine} disabled={isSaving}>
                             {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Routine
                        </Button>
                    </div>
                </div>

                <div ref={routineRef} className="bg-background p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {daysOfWeek.map(day => (
                            <Card key={day}>
                                <CardHeader>
                                    <CardTitle>{day}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {routine[day] && routine[day].map((slot, index) => (
                                        <div key={slot.id} className="flex items-center gap-2">
                                            <Input
                                                type="time"
                                                value={slot.time}
                                                onChange={e => handleSlotChange(day, index, 'time', e.target.value)}
                                                className="w-28"
                                                aria-label={`${day} time for slot ${index + 1}`}
                                            />
                                            <div className="flex-1">
                                                <Select
                                                    value={slot.courseId}
                                                    onValueChange={value => handleSlotChange(day, index, 'courseId', value)}
                                                >
                                                    <SelectTrigger aria-label={`${day} course for slot ${index + 1}`}>
                                                        <SelectValue placeholder="Select a course..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {courses.map(course => (
                                                            <SelectItem key={course.id} value={course.id}>
                                                                {course.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0" onClick={() => handleClearSlot(day, index)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
