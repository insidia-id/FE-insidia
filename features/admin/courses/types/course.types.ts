export type CourseScope = 'INSIDIA' | 'MITRA';
export type CourseStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVEL';
export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
export type MediaOwnerType = 'COURSE' | 'MODULE' | 'LESSON' | 'REVIEW' | 'COMMENT' | 'PROFILE';

export type CourseListItem = {
  id: string;
  creatorId: string;
  mitraId: string | null;
  curriculumId: string | null;
  title: string;
  slug: string;
  code: string | null;
  subtitle: string | null;
  description: string | null;
  status: CourseStatus;
  academicStatus: 'ACTIVE' | 'INACTIVE';
  level: CourseLevel;
  categoryId: string | null;
  language: string;
  price: number;
  salePrice: number | null;
  isFree: boolean;
  requirements: string[];
  outcomes: string[];
  targetUsers: string[];
  totalDurationSec: number;
  totalLessons: number;
  publishedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  scope: CourseScope;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  curriculum: {
    id: string;
    name: string;
    code: string | null;
    status: 'ACTIVE' | 'INACTIVE';
  } | null;
  _count: {
    modules: number;
    media: number;
    lessons: number;
  };
};

export type CourseModule = {
  id: string;
  courseId: string;
  title: string;
  summary: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    title: string;
    creatorId: string;
  };
  _count: {
    lessons: number;
    media: number;
  };
};

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

export type CourseDetail = CourseListItem & {
  modules: CourseModule[];
};

export type CourseStatusFilter = CourseStatus | 'ALL';
