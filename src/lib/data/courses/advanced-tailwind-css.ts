import type { Course } from '@/lib/types';

export const course: Course = {
    id: "2",
    slug: "advanced-tailwind-css",
    title: "Advanced Tailwind CSS",
    description: "Go beyond the basics and learn advanced techniques for building beautiful, custom designs with Tailwind CSS.",
    thumbnail: "https://i.ytimg.com/vi/lCxcTsOHrjo/hqdefault.jpg",
    lessons: [
      { id: "2-1", title: "Configuration Deep Dive", duration: "22:05", videoId: "lCxcTsOHrjo", pdfUrl: "https://bondipathshala.com.bd/pdf/tailwind-lesson-1" },
      { id: "2-2", title: "JIT Compiler Explained", duration: "18:30", videoId: "3xlK23tAnV4", pdfUrl: "https://bondipathshala.com.bd/pdf/tailwind-lesson-2" },
      { id: "2-3", title: "Plugins and Presets", duration: "28:15", videoId: "BaxXa2oYf2Y", pdfUrl: "https://bondipathshala.com.bd/pdf/tailwind-lesson-3" },
      { id: "2-4", title: "Responsive Design Patterns", duration: "24:50", videoId: "Qp2sE2_Uu_s", pdfUrl: "https://bondipathshala.com.bd/pdf/tailwind-lesson-4" },
    ]
  };
