'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Course } from '@/lib/types';
import { getCoursesAction } from '@/app/actions/course-actions';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, FileText, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PdfHubPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function loadCourses() {
            setIsLoading(true);
            const fetchedCourses = await getCoursesAction();
            setCourses(fetchedCourses);
            setIsLoading(false);
        }
        loadCourses();
    }, []);

    const filteredCourses = useMemo(() => {
        if (!searchTerm) {
            return courses.map(course => ({
                ...course,
                lessons: course.lessons.filter(lesson => lesson.pdfUrl)
            })).filter(course => course.lessons.length > 0);
        }

        const lowercasedFilter = searchTerm.toLowerCase();
        
        return courses.map(course => {
            const filteredLessons = course.lessons.filter(lesson => 
                lesson.pdfUrl && lesson.title.toLowerCase().includes(lowercasedFilter)
            );
            return { ...course, lessons: filteredLessons };
        }).filter(course => course.lessons.length > 0);
    }, [courses, searchTerm]);

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
                            <FileText className="w-8 h-8" />
                            PDF Hub
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Find all your course materials in one place.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Course PDFs</CardTitle>
                        <CardDescription>Search for a specific PDF or browse by course.</CardDescription>
                         <div className="relative pt-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search for a PDF by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-14 w-full" />
                                <Skeleton className="h-14 w-full" />
                                <Skeleton className="h-14 w-full" />
                            </div>
                        ) : filteredCourses.length > 0 ? (
                            <Accordion type="multiple" className="w-full">
                                {filteredCourses.map((course) => (
                                    <AccordionItem value={course.id} key={course.id}>
                                        <AccordionTrigger>
                                            <span className='text-left'>{course.title}</span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="space-y-2 pt-2">
                                                {course.lessons.map((lesson) => (
                                                    <li key={lesson.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                                                        <span>{lesson.title}</span>
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download
                                                            </a>
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="text-center py-10">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No PDFs Found</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {searchTerm ? `No PDFs match "${searchTerm}".` : "There are no PDFs available in your courses yet."}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
