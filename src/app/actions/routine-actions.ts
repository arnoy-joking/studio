'use server';

import { revalidatePath } from 'next/cache';
import * as routineDb from '@/lib/routine';
import type { WeeklyRoutine } from '@/lib/types';

export async function getRoutineAction(userId: string): Promise<WeeklyRoutine | null> {
    return await routineDb.getRoutine(userId);
}

export async function saveRoutineAction(userId: string, routine: WeeklyRoutine): Promise<{ success: true }> {
    await routineDb.saveRoutine(userId, routine);
    revalidatePath('/weekly-routine');
    return { success: true };
}

export async function resetRoutineAction(userId: string): Promise<{ success: true }> {
    await routineDb.deleteRoutine(userId);
    revalidatePath('/weekly-routine');
    return { success: true };
}
