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
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}
