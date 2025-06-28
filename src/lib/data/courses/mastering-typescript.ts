import type { Course } from '@/lib/types';

export const course: Course = {
    id: "4",
    slug: "mastering-typescript",
    title: "Mastering TypeScript",
    description: "Add static typing to JavaScript to improve developer productivity and code quality.",
    thumbnail: "https://i.ytimg.com/vi/zQnBQ4tB3ZA/hqdefault.jpg",
    lessons: [
      { id: "4-1", title: "Introduction to Types", duration: "21:14", videoId: "zQnBQ4tB3ZA", pdfUrl: "https://bondipathshala.com.bd/pdf/ts-lesson-1" },
      { id: "4-2", title: "Interfaces and Generics", duration: "28:40", videoId: "d56mG7DezGs", pdfUrl: "https://bondipathshala.com.bd/pdf/ts-lesson-2" },
      { id: "4-3", title: "Advanced Types", duration: "32:22", videoId: "fN22fcn2zP0", pdfUrl: "https://bondipathshala.com.bd/pdf/ts-lesson-3" },
    ]
  };
