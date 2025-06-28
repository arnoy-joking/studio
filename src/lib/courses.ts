import type { Course } from "./types";
import fs from 'fs/promises';
import path from 'path';

const coursesFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'courses.json');

async function readCoursesFile(): Promise<Course[]> {
    try {
        const fileContent = await fs.readFile(coursesFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            await writeCoursesFile([]); // Create the file if it doesn't exist
            return [];
        }
        throw error;
    }
}

async function writeCoursesFile(courses: Course[]): Promise<void> {
    await fs.writeFile(coursesFilePath, JSON.stringify(courses, null, 2), 'utf-8');
}

export async function getCourses(): Promise<Course[]> {
  const courses = await readCoursesFile();
  return courses;
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const allCourses = await getCourses();
  return allCourses.find(course => course.slug === slug);
}

export async function addCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
    const courses = await readCoursesFile();
    const newCourse: Course = {
        id: crypto.randomUUID(),
        ...courseData
    };
    courses.push(newCourse);
    await writeCoursesFile(courses);
    return newCourse;
}

export async function updateCourse(courseId: string, courseData: Omit<Course, 'id'>): Promise<Course | undefined> {
    const courses = await readCoursesFile();
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex > -1) {
        courses[courseIndex] = { id: courseId, ...courseData };
        await writeCoursesFile(courses);
        return courses[courseIndex];
    }
    return undefined;
}

export async function deleteCourse(courseId: string): Promise<boolean> {
    let courses = await readCoursesFile();
    const initialLength = courses.length;
    courses = courses.filter(c => c.id !== courseId);
    if (courses.length < initialLength) {
        await writeCoursesFile(courses);
        return true;
    }
    return false;
}
