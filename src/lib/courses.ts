import type { Course, Lesson } from "./types";

// In a real app, this would be a database. For this prototype, we use an in-memory array.
let courses: Course[] = [
    {
        id: "1",
        slug: "introduction-to-react",
        title: "Introduction to React",
        description: "Learn the fundamentals of React, the most popular JavaScript library for building user interfaces.",
        thumbnail: "https://i.ytimg.com/vi/SqcY0GlETPk/hqdefault.jpg",
        lessons: [
          { id: "1-1", title: "What is React?", duration: "00:10:32", videoId: "SqcY0GlETPk", pdfUrl: "https://bondipathshala.com.bd/pdf/react-lesson-1" },
          { id: "1-2", title: "Setting Up Your Environment", duration: "00:15:10", videoId: "9S6M2i_S8s", pdfUrl: "https://bondipathshala.com.bd/pdf/react-lesson-2" },
          { id: "1-3", title: "Components and Props", duration: "00:25:45", videoId: "Y22c_3a_M_s", pdfUrl: "https://bondipathshala.com.bd/pdf/react-lesson-3" },
          { id: "1-4", title: "State and Lifecycle", duration: "00:30:18", videoId: "O6P86uwfdR0", pdfUrl: "https://bondipathshala.com.bd/pdf/react-lesson-4" },
        ]
    },
    {
        id: "2",
        slug: "advanced-tailwind-css",
        title: "Advanced Tailwind CSS",
        description: "Go beyond the basics and learn advanced techniques for building beautiful, custom designs with Tailwind CSS.",
        thumbnail: "https://i.ytimg.com/vi/lCxcTsOHrjo/hqdefault.jpg",
        lessons: [
          { id: "2-1", title: "Configuration Deep Dive", duration: "00:22:05", videoId: "lCxcTsOHrjo", pdfUrl: "https://bondipathshala.com.bd/pdf/tailwind-lesson-1" },
          { id: "2-2", title: "JIT Compiler Explained", duration: "00:18:30", videoId: "3xlK23tAnV4", pdfUrl: "https://bondipathshala.com.bd/pdf/tailwind-lesson-2" },
          { id: "2-3", title: "Plugins and Presets", duration: "00:28:15", videoId: "BaxXa2oYf2Y", pdfUrl: "https://bondipathshala.com.bd/pdf/tailwind-lesson-3" },
          { id: "2-4", title: "Responsive Design Patterns", duration: "00:24:50", videoId: "Qp2sE2_Uu_s", pdfUrl: "https://bondipathshala.com.bd/pdf/tailwind-lesson-4" },
        ]
    },
    {
        id: "3",
        slug: "nextjs-for-beginners",
        title: "Next.js for Beginners",
        description: "Build powerful, server-rendered React applications with Next.js. Perfect for beginners looking to level up.",
        thumbnail: "https://i.ytimg.com/vi/1_6nK_How_c/hqdefault.jpg",
        lessons: [
          { id: "3-1", title: "Why Next.js?", duration: "00:12:40", videoId: "1_6nK_How_c", pdfUrl: "https://bondipathshala.com.bd/pdf/nextjs-lesson-1" },
          { id: "3-2", title: "Pages and Routing", duration: "00:20:11", videoId: "h7a_s19-p4s", pdfUrl: "https://bondipathshala.com.bd/pdf/nextjs-lesson-2" },
          { id: "3-3", title: "Data Fetching", duration: "00:35:00", videoId: "HplxluE_S8w", pdfUrl: "https://bondipathshala.com.bd/pdf/nextjs-lesson-3" },
          { id: "3-4", title: "API Routes", duration: "00:19:55", videoId: "s_25s2r3s_Y", pdfUrl: "https://bondipathshala.com.bd/pdf/nextjs-lesson-4" },
        ]
    },
    {
        id: "4",
        slug: "mastering-typescript",
        title: "Mastering TypeScript",
        description: "Add static typing to JavaScript to improve developer productivity and code quality.",
        thumbnail: "https://i.ytimg.com/vi/zQnBQ4tB3ZA/hqdefault.jpg",
        lessons: [
          { id: "4-1", title: "Introduction to Types", duration: "00:21:14", videoId: "zQnBQ4tB3ZA", pdfUrl: "https://bondipathshala.com.bd/pdf/ts-lesson-1" },
          { id: "4-2", title: "Interfaces and Generics", duration: "00:28:40", videoId: "d56mG7DezGs", pdfUrl: "https://bondipathshala.com.bd/pdf/ts-lesson-2" },
          { id: "4-3", title: "Advanced Types", duration: "00:32:22", videoId: "fN22fcn2zP0", pdfUrl: "https://bondipathshala.com.bd/pdf/ts-lesson-3" },
        ]
    },
    {
        id: "5",
        slug: "your-custom-course",
        title: "Your Custom Course",
        description: "Add your own courses by editing src/lib/courses.ts. You just need a title, description, and a list of YouTube video IDs.",
        thumbnail: "https://placehold.co/160x90/60A5FA/FFFFFF.png",
        lessons: [
          { id: "5-1", title: "Your First Lesson", duration: "00:05:00", videoId: "dQw4w9WgXcQ", pdfUrl: "https://bondipathshala.com.bd/pdf/custom-1" },
          { id: "5-2", title: "Your Second Lesson", duration: "00:10:00", videoId: "dQw4w9WgXcQ", pdfUrl: "https://bondipathshala.com.bd/pdf/custom-2" },
        ]
    }
];

export async function getCourses(): Promise<Course[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 50));
  return JSON.parse(JSON.stringify(courses));
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const allCourses = await getCourses();
  return allCourses.find(course => course.slug === slug);
}

export async function addCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const newCourse: Course = {
        id: crypto.randomUUID(),
        ...courseData
    };
    courses.push(newCourse);
    return newCourse;
}

export async function updateCourse(courseId: string, courseData: Omit<Course, 'id'>): Promise<Course | undefined> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex > -1) {
        courses[courseIndex] = { id: courseId, ...courseData };
        return courses[courseIndex];
    }
    return undefined;
}

export async function deleteCourse(courseId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const initialLength = courses.length;
    courses = courses.filter(c => c.id !== courseId);
    return courses.length < initialLength;
}
