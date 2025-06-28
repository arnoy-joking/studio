'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { getUsersAction } from '@/app/actions/user-actions';
import { useUser } from '@/context/user-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Compass, UserPlus, Loader2 } from 'lucide-react';
import { AddUserDialog } from '@/components/dashboard/add-user-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
    const { setCurrentUser, currentUser } = useUser();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        setIsLoading(true);
        const fetchedUsers = await getUsersAction();
        setUsers(fetchedUsers);
        setIsLoading(false);
    };

    useEffect(() => {
        if (currentUser) {
            router.push('/dashboard');
        } else {
            fetchUsers();
        }
    }, [currentUser, router]);

    const handleSelectUser = (user: User) => {
        setCurrentUser(user);
        router.push('/dashboard');
    };

    if (isLoading || currentUser) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                 <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Compass className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle className="mt-4 text-2xl font-bold">
                        Select a Profile
                    </CardTitle>
                    <CardDescription>
                       Choose your profile to continue or add a new one.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[40vh] overflow-y-auto">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleSelectUser(user)}
                                className="w-full flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-semibold text-lg">{user.name}</div>
                            </button>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-4">No profiles found. Please add one to get started.</p>
                    )}
                </CardContent>
                <CardFooter>
                    <AddUserDialog onUserAdded={fetchUsers}>
                        <Button variant="outline" className="w-full">
                            <UserPlus className="mr-2" />
                            Add New Profile
                        </Button>
                    </AddUserDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
