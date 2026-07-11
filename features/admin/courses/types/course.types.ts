export type CourseScope = 'INSIDIA' | 'MITRA';
export type CourseStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVEL';
export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
export type MediaOwnerType = 'COURSE' | 'MODULE' | 'LESSON' | 'REVIEW' | 'COMMENT' | 'PROFILE';

import type { Course as CourseDomain, CourseInsidia, CourseMitra } from '@/types/domain.types';

/**
 * Course List Item (Simplified for lists)
 * Combines Course with its domain relations
 */
export type CourseListItem = {
  id: string;
  creatorId: string;
  title: string;
  slug: string;
  code: string | null;
  subtitle: string | null;
  description: string | null;
  totalDurationSec: number;
  totalLessons: number;
  scope: CourseScope;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
  insidia?: CourseInsidia | null;
  mitra?: CourseMitra | null;
  _count: {
    media: number;
    /** @deprecated Course no longer owns modules directly */
    modules?: number;
    /** @deprecated Course no longer owns lessons */
    lessons?: number;
  };

  // ============================================
  // DEPRECATED FIELDS (Moved to CourseInsidia)
  // ============================================
  /** @deprecated Use insidia.level */
  level?: CourseLevel;
  /** @deprecated Use insidia.price */
  price?: number;
  /** @deprecated Use insidia.salePrice */
  salePrice?: number | null;
  /** @deprecated Use insidia.isFree */
  isFree?: boolean;
  /** @deprecated Use insidia.requirements */
  requirements?: string[];
  /** @deprecated Use insidia.outcomes */
  outcomes?: string[];
  /** @deprecated Use insidia.targetUsers */
  targetUsers?: string[];

  // ============================================
  // DEPRECATED FIELDS (Moved to CourseMitra)
  // ============================================
  /** @deprecated Use mitra.mitraId */
  mitraId?: string | null;
  /** @deprecated Use mitra.curriculumId */
  curriculumId?: string | null;
  /** @deprecated Use mitra.academicStatus */
  academicStatus?: 'ACTIVE' | 'INACTIVE';

  // ============================================
  // DEPRECATED FIELDS (No longer exist on any model)
  // ============================================
  /** @deprecated Field removed from schema */
  status?: CourseStatus;
  /** @deprecated Field removed from schema */
  categoryId?: string | null;
  /** @deprecated Field removed from schema */
  language?: string;
  /** @deprecated Field removed from schema */
  publishedAt?: string | null;
  /** @deprecated Field removed from schema */
  rejectedAt?: string | null;
  /** @deprecated Field removed from schema */
  rejectReason?: string | null;
  /** @deprecated Field removed from schema */
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  /** @deprecated Field removed from schema */
  curriculum?: {
    id: string;
    name: string;
    code: string | null;
    status: 'ACTIVE' | 'INACTIVE';
  } | null;

  // Custom added via mapper
  modulesCount?: number;
  insidiaId?: string;
};

export type CourseModule = {
  id: string;
  /** @deprecated Use courseInsidiaId or classGroupCourseId */
  courseId?: string;
  courseInsidiaId: string | null;
  classGroupCourseId: string | null;
  title: string;
  summary: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  /** @deprecated Use courseInsidia or classGroupCourse */
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
  _count: {
    /** @deprecated Use learningItems */
    lessons?: number;
    learningItems: number;
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
  /** @deprecated Course no longer owns modules directly. Fetch them via domain endpoints. */
  modules?: CourseModule[];
};

export type CourseStatusFilter = CourseStatus | 'ALL';
