import type { Course } from '@/lib/types';

export const course: Course = {
    id: "3",
    slug: "nextjs-for-beginners",
    title: "Next.js for Beginners",
    description: "Build powerful, server-rendered React applications with Next.js. Perfect for beginners looking to level up.",
    thumbnail: "https://i.ytimg.com/vi/1_6nK_How_c/hqdefault.jpg",
    lessons: [
      { id: "3-1", title: "Why Next.js?", duration: "12:40", videoId: "1_6nK_How_c", pdfUrl: "https://bondipathshala.com.bd/pdf/nextjs-lesson-1" },
      { id: "3-2", title: "Pages and Routing", duration: "20:11", videoId: "h7a_s19-p4s", pdfUrl: "https://bondipathshala.com.bd/pdf/nextjs-lesson-2" },
      { id: "3-3", title: "Data Fetching", duration: "35:00", videoId: "HplxluE_S8w", pdfUrl: "https://bondipathshala.com.bd/pdf/nextjs-lesson-3" },
      { id: "3-4", title: "API Routes", duration: "19:55", videoId: "s_25s2r3s_Y", pdfUrl: "https://bondipathshala.com.bd/pdf/nextjs-lesson-4" },
    ]
  };
