import { getCourseBySlug } from "@/lib/courses";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/video-player";
import { LessonList } from "@/components/lesson-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock } from "lucide-react";

export default async function ClassPage({
  params,
}: {
  params: { slug: string };
}) {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  const totalDuration = course.lessons.reduce((acc, lesson) => {
    const [minutes, seconds] = lesson.duration.split(':').map(Number);
    return acc + minutes * 60 + seconds;
  }, 0);

  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);


  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <VideoPlayer
              initialVideoId={course.lessons[0].videoId}
              initialTitle={course.lessons[0].title}
            />
            <Card>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <Badge variant="outline">{course.lessons.length} Lessons</Badge>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{hours > 0 ? `${hours}h ` : ''}{minutes}m total</span>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2 text-lg">About this course</h3>
                <p className="text-muted-foreground">{course.description}</p>
              </CardContent>
            </Card>
          </div>
          <div className="lg:sticky lg:top-24">
            <LessonList lessons={course.lessons} />
          </div>
        </div>
      </div>
    </main>
  );
}
