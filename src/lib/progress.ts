import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    doc, 
    setDoc,
    getDoc,
    query,
    where,
    Timestamp
} from "firebase/firestore";
import type { Lesson } from './types';

const progressCollection = collection(db, 'progress');
const userActivityCollection = collection(db, 'userActivity');

export async function getWatchedLessonIds(userId: string): Promise<Set<string>> {
    const q = query(progressCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const watchedIds = new Set<string>();
    snapshot.forEach(doc => {
        watchedIds.add(doc.data().lessonId);
    });
    return watchedIds;
}

export async function markLessonAsWatched(userId: string, lesson: Lesson, courseId: string) {
    const progressId = `${userId}_${lesson.id}`;
    const progressRef = doc(db, 'progress', progressId);
    await setDoc(progressRef, {
        userId,
        lessonId: lesson.id,
        courseId,
        videoId: lesson.videoId,
        watchedAt: Timestamp.now(),
    });
}

export async function getLastWatchedLessonId(userId: string, courseId: string): Promise<string | null> {
    const activityId = `${userId}_${courseId}`;
    const activityRef = doc(db, 'userActivity', activityId);
    const docSnap = await getDoc(activityRef);
    if (docSnap.exists()) {
        return docSnap.data().lastWatchedLessonId;
    }
    return null;
}

export async function setLastWatchedLesson(userId: string, courseId: string, lessonId: string) {
    const activityId = `${userId}_${courseId}`;
    const activityRef = doc(db, 'userActivity', activityId);
    await setDoc(activityRef, {
        userId,
        courseId,
        lastWatchedLessonId: lessonId,
        lastWatchedAt: Timestamp.now(),
    });
}

export async function getAllProgress(): Promise<Record<string, Set<string>>> {
    const snapshot = await getDocs(progressCollection);
    const allProgress: Record<string, Set<string>> = {};

    snapshot.forEach(doc => {
        const data = doc.data();
        const userId = data.userId;
        const lessonId = data.lessonId;

        if (!allProgress[userId]) {
            allProgress[userId] = new Set();
        }
        allProgress[userId].add(lessonId);
    });

    return allProgress;
}
