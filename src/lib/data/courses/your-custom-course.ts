import type { Course } from '@/lib/types';

export const course: Course = {
    id: "5",
    slug: "your-custom-course",
    title: "Your Custom Course",
    description: "Add your own courses by editing src/lib/courses.ts. You just need a title, description, and a list of YouTube video IDs.",
    thumbnail: "https://placehold.co/160x90/60A5FA/FFFFFF.png",
    lessons: [
      { id: "5-1", title: "Your First Lesson", duration: "05:00", videoId: "dQw4w9WgXcQ", pdfUrl: "https://bondipathshala.com.bd/pdf/custom-1" },
      { id: "5-2", title: "Your Second Lesson", duration: "10:00", videoId: "dQw4w9WgXcQ", pdfUrl: "https://bondipathshala.com.bd/pdf/custom-2" },
    ]
  };
