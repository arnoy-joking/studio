import { db } from './firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { WeeklyRoutine } from './types';

const routinesCollectionName = 'routines';

export async function getRoutine(userId: string): Promise<WeeklyRoutine | null> {
    const routineDocRef = doc(db, routinesCollectionName, userId);
    const docSnap = await getDoc(routineDocRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return data.schedule as WeeklyRoutine;
    }
    return null;
}

export async function saveRoutine(userId: string, schedule: WeeklyRoutine): Promise<void> {
    const routineDocRef = doc(db, routinesCollectionName, userId);
    await setDoc(routineDocRef, { userId, schedule }, { merge: true });
}
