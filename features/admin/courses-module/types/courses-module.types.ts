import { LearningItem } from '../../learning-items/types/learnig-items.type';
export type CourseModule = {
  id: string;
  courseId?: string;
  courseInsidiaId: string | null;
  classGroupCourseId: string | null;
  mitraId: string | null;
  title: string;
  summary: string | null;
  sortOrder: number;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    title: string;
    creatorId: string;
  };
  courseInsidia?: {
    id: string;
    course: {
      id: string;
      title: string;
      creatorId: string;
    };
  } | null;
  classGroupCourse?: {
    id: string;
    courseMitra: {
      course: {
        id: string;
        title: string;
        creatorId: string;
      };
    };
  } | null;
  totalLearningItems: number;
  totalLessons: number;
  totalQuizzes: number;
  totalAssignments: number;
  learningItems?: LearningItem[];
};

export type ModuleDetailResponse = CourseModule & {
  lessonCount: number;
  quizCount: number;
  assignmentCount: number;
};
