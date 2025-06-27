'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { addUser as apiAddUser } from '@/lib/users';
import { useToast } from '@/hooks/use-toast';

export function AddUserDialog() {
    const { setUsers } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const { toast } = useToast();

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast({ title: "Error", description: "Name cannot be empty.", variant: "destructive" });
            return;
        }
        try {
            const newUser = await apiAddUser(name.trim());
            setUsers(prevUsers => [...prevUsers, newUser]);
            toast({ title: "Success", description: `Profile "${name}" added.` });
            setName('');
            setIsOpen(false);
        } catch (error) {
             toast({ title: "Error", description: "Failed to add profile.", variant: "destructive" });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleAddUser}>
                    <DialogHeader>
                        <DialogTitle>Add New Profile</DialogTitle>
                        <DialogDescription>
                            Enter the name for the new profile to track progress separately.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g. Birat"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Add Profile</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
