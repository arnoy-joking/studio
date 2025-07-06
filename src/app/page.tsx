import { Button } from "@/components/ui/button";
import { Compass, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Compass className="w-8 h-8" />
          <span>Course Compass</span>
        </Link>
        <nav className="flex gap-2 items-center flex-wrap justify-end">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-background">
        <div className="max-w-3xl">
          <BookOpen className="w-24 h-24 mx-auto text-primary mb-6" />
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary tracking-tight">
            Navigate Your Learning Journey
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Course Compass provides a clear path to mastering new skills. Track your progress, achieve your goals, and stay motivated every step of the way.
          </p>
          <div className="mt-10">
            <Button size="lg" asChild>
              <Link href="/dashboard">Start Exploring Courses</Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} Course Compass. All rights reserved.</p>
      </footer>
    </div>
  );
}
