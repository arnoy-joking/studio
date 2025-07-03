export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoId: string;
  pdfUrl: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  lessons: Lesson[];
  order: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface RoutineEntry {
  time: string;
  courseId: string | null;
}

export interface WeeklyRoutine {
  [day: string]: RoutineEntry[];
}
