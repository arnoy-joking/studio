'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { Course, Lesson } from '@/lib/types';
import { getCourses } from '@/lib/courses';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PlusCircle, Trash2, Edit, Loader2, Lock, X } from 'lucide-react';
import { addCourseAction, deleteCourseAction, updateCourseAction } from '@/app/actions/course-actions';
import { Skeleton } from '@/components/ui/skeleton';


const lessonSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    duration: z.string().regex(/^\d{2,}:\d{2}:\d{2}$/, 'Duration must be in HH:MM:SS format'),
    videoId: z.string().min(1, 'Video ID is required'),
    pdfUrl: z.string().url('Must be a valid URL'),
});

const courseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    description: z.string().min(1, 'Description is required'),
    thumbnail: z.string().url('Thumbnail must be a valid URL'),
    lessons: z.array(lessonSchema).min(1, 'At least one lesson is required'),
});

type CourseFormData = z.infer<typeof courseSchema>;

function CourseForm({ course, onFormSubmit, closeDialog }: { course?: Course; onFormSubmit: () => void; closeDialog: () => void }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: course ? {
            ...course,
            lessons: course.lessons.map(l => ({...l}))
        } : {
            title: '',
            slug: '',
            description: '',
            thumbnail: '',
            lessons: [{ title: '', duration: '00:00:00', videoId: '', pdfUrl: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lessons",
    });

    const onSubmit = async (data: CourseFormData) => {
        setIsSubmitting(true);
        const result = course 
            ? await updateCourseAction(course.id, { ...data, lessons: data.lessons.map(l => ({ ...l, id: l.id || crypto.randomUUID() })) })
            : await addCourseAction({ ...data, lessons: data.lessons.map(l => ({ ...l, id: crypto.randomUUID() })) });

        setIsSubmitting(false);

        if (result.success) {
            toast({ title: 'Success', description: `Course ${course ? 'updated' : 'added'} successfully.` });
            onFormSubmit();
            closeDialog();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="slug" render={({ field }) => ( <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="thumbnail" render={({ field }) => ( <FormItem><FormLabel>Thumbnail URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Lessons</h3>
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                            <FormField control={form.control} name={`lessons.${index}.title`} render={({ field }) => ( <FormItem><FormLabel>Lesson Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`lessons.${index}.duration`} render={({ field }) => ( <FormItem><FormLabel>Duration (HH:MM:SS)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`lessons.${index}.videoId`} render={({ field }) => ( <FormItem><FormLabel>YouTube Video ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`lessons.${index}.pdfUrl`} render={({ field }) => ( <FormItem><FormLabel>PDF URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => append({ title: '', duration: '00:00:00', videoId: '', pdfUrl: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Lesson
                    </Button>
                </div>

                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {course ? 'Save Changes' : 'Add Course'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}

function AddEditCourseDialog({ course, onUpdate, children }: { course?: Course, onUpdate: () => void, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{course ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                    <DialogDescription>{course ? 'Edit the details of your course.' : 'Fill in the details for the new course.'}</DialogDescription>
                </DialogHeader>
                <CourseForm course={course} onFormSubmit={onUpdate} closeDialog={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

function CourseManager() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchCourses = async () => {
        setIsLoading(true);
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDelete = async (courseId: string) => {
        const result = await deleteCourseAction(courseId);
        if (result.success) {
            toast({ title: 'Success', description: 'Course deleted.' });
            fetchCourses();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        )
    }

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Manage Courses</h1>
                    <p className="text-muted-foreground">Add, edit, or delete your courses.</p>
                </div>
                <AddEditCourseDialog onUpdate={fetchCourses}>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Course</Button>
                </AddEditCourseDialog>
            </div>
            <div className="space-y-4">
                {courses.map(course => (
                    <Card key={course.id}>
                        <CardHeader className="flex flex-row items-start justify-between">
                           <div>
                                <CardTitle>{course.title}</CardTitle>
                                <CardDescription>{course.lessons.length} lessons</CardDescription>
                           </div>
                           <div className="flex gap-2">
                                <AddEditCourseDialog course={course} onUpdate={fetchCourses}>
                                    <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                                </AddEditCourseDialog>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the course "{course.title}".
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(course.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                           </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}


export default function ManageCoursesPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const correctPassword = 'arnoy-joking';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setTimeout(() => {
            if (password === correctPassword) {
                setIsAuthenticated(true);
            } else {
                setError('Incorrect password. Please try again.');
            }
            setIsLoading(false);
        }, 500)
    };

    if (!isAuthenticated) {
        return (
            <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <form onSubmit={handleLogin}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lock /> Secure Area</CardTitle>
                            <CardDescription>Enter the password to manage courses.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <Label htmlFor="password">Password</Label>
                             <Input 
                                id="password" 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                            />
                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Unlock
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </main>
        )
    }

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <CourseManager />
            </div>
        </main>
    );
}