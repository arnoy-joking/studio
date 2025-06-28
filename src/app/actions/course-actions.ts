'use server';

import { revalidatePath } from 'next/cache';
import { addCourse, deleteCourse, updateCourse } from '@/lib/courses';
import type { Course, Lesson } from '@/lib/types';

export async function addCourseAction(courseData: Omit<Course, 'id' | 'lessons'> & { lessons: Omit<Lesson, 'id'>[] }) {
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
        await deleteCourse(courseId);
        revalidatePath('/dashboard');
        revalidatePath('/manage-courses');
        return { success: true };
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}
