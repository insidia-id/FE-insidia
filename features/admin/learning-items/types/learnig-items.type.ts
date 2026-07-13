export const LearningItemTypes = {
  QUIZ: 'QUIZ',
  LESSON: 'LESSON',
  ASSIGNMENT: 'ASSIGNMENT',
} as const;

export type LearningItemType = (typeof LearningItemTypes)[keyof typeof LearningItemTypes];

export type LearningItem = {
  id: string;
  moduleId: string;
  type: LearningItemType;
  slug: string;
  description?: string | null;
  title: string;
  order: number;
  published: boolean;
  availableFrom: Date | null;
  availableUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
  locked?: boolean | undefined;
  lessonsId?: string | null;
  quizId?: string | null;
  assignmentId?: string | null;
};
