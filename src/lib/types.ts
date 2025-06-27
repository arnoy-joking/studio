export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoId: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  pdfUrl: string;
  lessons: Lesson[];
}
