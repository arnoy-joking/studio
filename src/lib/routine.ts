import { db } from './firebase';
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import type { WeeklyRoutine } from './types';

const routineCollectionName = 'routines';

export async function getRoutine(userId: string): Promise<WeeklyRoutine | null> {
    const routineDocRef = doc(db, routineCollectionName, userId);
    const docSnap = await getDoc(routineDocRef);
    if (docSnap.exists()) {
        return docSnap.data().routine as WeeklyRoutine;
    }
    return null;
}

export async function saveRoutine(userId: string, routine: WeeklyRoutine): Promise<void> {
    const routineDocRef = doc(db, routineCollectionName, userId);
    await setDoc(routineDocRef, { routine });
}

export async function deleteRoutine(userId: string): Promise<void> {
    const routineDocRef = doc(db, routineCollectionName, userId);
    await deleteDoc(routineDocRef);
}
