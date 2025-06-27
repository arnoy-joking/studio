import type { User } from './types';

// Let's start with BIRAT and ARNOY
const initialUsers: User[] = [
  { id: '1', name: 'Birat', avatar: 'https://placehold.co/100x100/FBCFE8/831843.png' },
  { id: '2', name: 'Arnoy', avatar: 'https://placehold.co/100x100/C7D2FE/312E81.png' },
];

// In a real app, this would be a database.
let usersStore: User[] = [...initialUsers];

export async function getUsers(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return [...usersStore];
}

export async function addUser(name: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const newUser: User = {
        id: Date.now().toString(),
        name,
        avatar: `https://placehold.co/100x100.png`,
    };
    usersStore.push(newUser);
    return newUser;
}
