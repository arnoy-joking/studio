import type { Course } from '@/lib/types';

export const course: Course = {
    id: "1",
    slug: "introduction-to-react",
    title: "Introduction to React",
    description: "Learn the fundamentals of React, the most popular JavaScript library for building user interfaces.",
    thumbnail: "https://i.ytimg.com/vi/SqcY0GlETPk/hqdefault.jpg",
    lessons: [
      { id: "1-1", title: "What is React?", duration: "10:32", videoId: "SqcY0GlETPk", pdfUrl: "https://bondipathshala.com.bd/pdf/react-lesson-1" },
      { id: "1-2", title: "Setting Up Your Environment", duration: "15:10", videoId: "9S6M2i_S8s", pdfUrl: "https://bondipathshala.com.bd/pdf/react-lesson-2" },
      { id: "1-3", title: "Components and Props", duration: "25:45", videoId: "Y22c_3a_M_s", pdfUrl: "https://bondipathshala.com.bd/pdf/react-lesson-3" },
      { id: "1-4", title: "State and Lifecycle", duration: "30:18", videoId: "O6P86uwfdR0", pdfUrl: "https://bondipathshala.com.bd/pdf/react-lesson-4" },
    ]
  };
