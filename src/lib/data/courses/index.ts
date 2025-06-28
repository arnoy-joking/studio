import type { Course } from '@/lib/types';
import { course as introductionToReact } from './introduction-to-react';
import { course as advancedTailwindCss } from './advanced-tailwind-css';
import { course as nextjsForBeginners } from './nextjs-for-beginners';
import { course as masteringTypescript } from './mastering-typescript';
import { course as yourCustomCourse } from './your-custom-course';

export const allCourses: Course[] = [
    introductionToReact,
    advancedTailwindCss,
    nextjsForBeginners,
    masteringTypescript,
    yourCustomCourse
];
