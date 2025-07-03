'use server';

import { revalidatePath } from 'next/cache';
import { saveRoutine as dbSaveRoutine, getRoutine as dbGetRoutine } from '@/lib/routine';
import type { WeeklyRoutine } from '@/lib/types';

export async function getRoutineAction(userId: string): Promise<WeeklyRoutine | null> {
    return await dbGetRoutine(userId);
}

export async function saveRoutineAction(userId: string, routine: WeeklyRoutine) {
    try {
        await dbSaveRoutine(userId, routine);
        revalidatePath('/routine');
        return { success: true };
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}
