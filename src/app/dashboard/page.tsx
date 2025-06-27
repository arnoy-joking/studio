import { CourseList } from "@/components/dashboard/course-list";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { ProgressSummaryCard } from "@/components/dashboard/progress-summary-card";
import { getCourses } from "@/lib/courses";

export default async function DashboardPage() {
  const courses = await getCourses();
  // Mock progress for demonstration
  const completedCourses = 1;
  const totalCourses = courses.length;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-primary mb-8">
          Welcome back, Learner!
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <CourseList courses={courses} />
          </div>
          <div className="space-y-8 lg:sticky lg:top-24">
            <ProgressSummaryCard
              completed={completedCourses}
              total={totalCourses}
            />
            <GoalsCard />
          </div>
        </div>
      </div>
    </main>
  );
}
