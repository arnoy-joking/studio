'use client';

import { useState, useEffect } from 'react';
import type { Course } from '@/lib/types';
import { getCoursesAction } from '@/app/actions/course-actions';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileText } from 'lucide-react';

export default function PdfHubPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      setIsLoading(true);
      const fetchedCourses = await getCoursesAction();
      // Filter out courses that have no lessons with a valid PDF URL
      const coursesWithPdfs = fetchedCourses.filter(course => 
        course.lessons.some(lesson => lesson.pdfUrl && lesson.pdfUrl.trim() !== '')
      );
      setCourses(coursesWithPdfs);
      setIsLoading(false);
    }
    loadCourses();
  }, []);

  if (isLoading) {
    return (
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-1/2 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold tracking-tight text-primary flex items-center gap-2">
                <FileText className="w-8 h-8"/>
                PDF Hub
            </h1>
            <p className="text-muted-foreground mt-2">
                Find all downloadable course materials in one place.
            </p>
        </div>

        {courses.length === 0 ? (
            <Card>
                <CardContent className="p-10 text-center">
                    <p className="text-muted-foreground">No PDF materials are available yet.</p>
                </CardContent>
            </Card>
        ) : (
            <Accordion type="multiple" defaultValue={courses.map(c => c.id)} className="w-full space-y-4">
                {courses.map(course => (
                    <AccordionItem value={course.id} key={course.id} className="border-b-0 rounded-lg border bg-card text-card-foreground shadow-sm">
                         <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline text-left">
                            {course.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <ul className="space-y-2">
                                {course.lessons
                                    .filter(l => l.pdfUrl && l.pdfUrl.trim() !== '')
                                    .map(lesson => (
                                    <li key={lesson.id}>
                                        <a 
                                            href={lesson.pdfUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors border"
                                        >
                                            <span className="font-medium">{lesson.title}</span>
                                            <Download className="h-5 w-5 text-muted-foreground" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        )}
      </div>
    </main>
  );
}
