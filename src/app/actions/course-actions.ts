'use server';

import { revalidatePath } from 'next/cache';
import { addCourse, deleteCourse, updateCourse, getCourses } from '@/lib/courses';
import type { Course } from '@/lib/types';

export async function getCoursesAction() {
    return await getCourses();
}

export async function addCourseAction(courseData: Omit<Course, 'id'>) {
    try {
        await addCourse(courseData);
        revalidatePath('/dashboard');
        revalidatePath('/manage-courses');
        return { success: true };
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}

export async function updateCourseAction(courseId: string, courseData: Omit<Course, 'id'>) {
    try {
        await updateCourse(courseId, courseData);
        revalidatePath('/dashboard');
        revalidatePath('/manage-courses');
        revalidatePath(`/class/${courseData.slug}`);
        return { success: true };
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}

export async function deleteCourseAction(courseId: string) {
    try {
        const success = await deleteCourse(courseId);
         if (success) {
            revalidatePath('/dashboard');
            revalidatePath('/manage-courses');
            return { success: true };
        }
        return { success: false, message: 'Course could not be deleted.' };
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}
