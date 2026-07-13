export type CourseScope = 'INSIDIA' | 'MITRA';
export type CourseStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVEL';
export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
export type MediaOwnerType = 'COURSE' | 'MODULE' | 'LESSON' | 'REVIEW' | 'COMMENT' | 'PROFILE';
export type AcademicStatus = 'ACTIVE' | 'INACTIVE';

export type BaseCourse = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  code: string | null;
  creatorId: string;
  slug: string | null;

  createdAt: string;
};
export type CourseInsidiaDetail = BaseCourse & {
  scope: 'INSIDIA';
  createdAt: string;

  level: CourseLevel;
  price: number;
  salePrice: number | null;
  isFree: boolean;

  requirements: string[];
  outcomes: string[];
  targetUsers: string[];
};

export type CourseMitraDetail = BaseCourse & {
  scope: 'MITRA';
  createdAt: string;
  courseMitraId: string;
  mitraId: string | undefined;
  academicStatus: AcademicStatus;
  totalModules: number;
  totalLearningItems: number;
  curriculum:
    | {
        id: string;
        name: string;
        code?: string | null;
      }
    | null
    | undefined;
};

export type CourseSummary = {
  id: string;
  title: string;
  courseMitraId?: string | null;
  slug?: string | null;
};

export type CourseDetail = CourseInsidiaDetail | CourseMitraDetail;

export type CourseMedia = {
  id: string;
  type: MediaType;
  ownerType: MediaOwnerType;
  url: string;
  publicId: string | null;
  filename: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  durationSec: number | null;
  alt: string | null;
  caption: string | null;
  sortOrder: number;
  isPrimary: boolean;
  courseId: string | null;
  moduleId: string | null;
  lessonId: string | null;
  reviewId: string | null;
  commentId: string | null;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    title: string;
    creatorId: string;
  } | null;
  module: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
      creatorId: string;
    };
  } | null;
};

export type CourseStatusFilter = CourseStatus | 'ALL';
