import type { Course } from "./types";
import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    limit
} from "firebase/firestore";

const coursesCollection = collection(db, 'courses');

export async function getCourses(): Promise<Course[]> {
  const snapshot = await getDocs(coursesCollection);
  const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  return courses;
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const q = query(coursesCollection, where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return undefined;
  }
  
  const courseDoc = snapshot.docs[0];
  return { id: courseDoc.id, ...courseDoc.data() } as Course;
}

export async function addCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
    // Firestore doesn't like `undefined` values, so we clean the lessons
    const cleanCourseData = {
        ...courseData,
        lessons: courseData.lessons.map(({id, ...rest}) => rest)
    };

    const docRef = await addDoc(coursesCollection, cleanCourseData);
    
    // We get the data back to ensure we have a consistent object
    const newDoc = await getDoc(docRef);
    const newCourse = { id: newDoc.id, ...newDoc.data() } as Course;

    return newCourse;
}

export async function updateCourse(courseId: string, courseData: Omit<Course, 'id'>): Promise<Course | undefined> {
    const courseDocRef = doc(db, 'courses', courseId);
    
    const docSnap = await getDoc(courseDocRef);
    if (!docSnap.exists()) {
        return undefined;
    }
    
    // Firestore doesn't like `undefined` values from the form, so we clean the lessons
    const cleanCourseData = {
        ...courseData,
        lessons: courseData.lessons.map(({id, ...rest}) => ({...rest}))
    };
    
    await updateDoc(courseDocRef, cleanCourseData);
    return { id: courseId, ...courseData };
}

export async function deleteCourse(courseId: string): Promise<boolean> {
    const courseDocRef = doc(db, 'courses', courseId);
    
    const docSnap = await getDoc(courseDocRef);
    if (!docSnap.exists()) {
        return false;
    }
    
    await deleteDoc(courseDocRef);
    return true;
}
