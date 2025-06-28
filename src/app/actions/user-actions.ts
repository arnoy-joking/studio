'use server';

import { revalidatePath } from 'next/cache';
import { addUser as dbAddUser, getUsers as dbGetUsers, deleteUser as dbDeleteUser } from '@/lib/users';
import { deleteProgressForUser } from '@/lib/progress';
import type { User } from '@/lib/types';

export async function addUserAction(name: string) {
    try {
        const newUser = await dbAddUser(name);
        revalidatePath('/login');
        revalidatePath('/dashboard');
        revalidatePath('/progress');
        return { success: true, user: newUser };
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}

export async function getUsersAction() {
    return await dbGetUsers();
}

export async function deleteUserAction(userId: string) {
    try {
        // First, delete related progress data
        await deleteProgressForUser(userId);
        
        // Then, delete the user
        await dbDeleteUser(userId);
        
        revalidatePath('/login');
        revalidatePath('/dashboard');
        revalidatePath('/progress');
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}
