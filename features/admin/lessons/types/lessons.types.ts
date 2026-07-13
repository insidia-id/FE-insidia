import { LearningItem } from '@/features/admin/learning-items/types/learnig-items.type';

export const LessonType = {
  VIDEO: 'VIDEO',
  ARTICLE: 'ARTICLE',
  QUIZ: 'QUIZ',
  ASSIGNMENT: 'ASSIGNMENT',
  LIVE_SESSION: 'LIVE_SESSION',
} as const;

export type LessonTypes = (typeof LessonType)[keyof typeof LessonType];

export type Lesson = LearningItem & {
  typeLesson: LessonTypes;
  contentJson?: string;
  contentHtml?: string;
};
