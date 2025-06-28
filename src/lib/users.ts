import type { User } from "./types";
import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    addDoc, 
    query,
    orderBy
} from "firebase/firestore";

const usersCollection = collection(db, 'users');

export async function getUsers(): Promise<User[]> {
  try {
    const q = query(usersCollection, orderBy("name"));
    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    return users;
  } catch (error) {
    console.error("Error fetching users, perhaps you need to set up Firestore indexes?", error);
    // Return empty array if there's an error (e.g. missing indexes)
    return [];
  }
}

export async function getUser(id: string): Promise<User | null> {
    const userDocRef = doc(db, 'users', id);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
}

export async function addUser(name: string): Promise<User> {
    const newUser = {
        name,
        avatar: `https://placehold.co/100x100.png?text=${name.charAt(0)}`,
    };
    const docRef = await addDoc(usersCollection, newUser);
    return { id: docRef.id, ...newUser };
}
