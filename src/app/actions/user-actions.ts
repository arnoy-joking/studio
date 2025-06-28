'use server';

import { revalidatePath } from 'next/cache';
import { addUser as dbAddUser, getUsers as dbGetUsers } from '@/lib/users';

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
