import { allCourses } from './data/courses';
import type { Course } from "./types";

const courses: Course[] = allCourses;

export async function getCourses(): Promise<Course[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 100));
  return courses;
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const allCourses = await getCourses();
  return allCourses.find(course => course.slug === slug);
}
