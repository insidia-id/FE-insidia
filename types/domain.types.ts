export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVEL';
export type LearningItemType = 'LESSON' | 'QUIZ' | 'ASSIGNMENT';
export type AcademicStatus = 'ACTIVE' | 'INACTIVE';
export type RoleScope = 'INSIDIA' | 'MITRA';

export type Course = {
  id: string;
  creatorId: string;
  title: string;
  slug: string;
  code: string | null;
  subtitle: string | null;
  description: string | null;
  totalDurationSec: number;
  totalLessons: number;
  scope: RoleScope;
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
  _count?: {
    media: number;
  };
};

export type CourseInsidia = {
  id: string;
  courseId: string;
  level: CourseLevel;
  price: number;
  salePrice: number | null;
  isFree: boolean;
  requirements: string[];
  outcomes: string[];
  targetUsers: string[];
  course: Course;
  _count?: {
    modules: number;
    enrollments: number;
    reviews: number;
  };
};

export type CourseMitra = {
  id: string;
  courseId: string;
  mitraId: string | null;
  curriculumId: string | null;
  academicStatus: AcademicStatus;
  course: Course;
  _count?: {
    classGroupCourses: number;
  };
};

// ============================================
// MITRA ACADEMIC TYPES
// ============================================

export type Mitra = {
  id: string;
  name: string;
  type: 'KAMPUS' | 'SEKOLAH';
  // ... other mitra fields
};

export type AcademicYear = {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  // ... other fields
};

export type Semester = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  // ... other fields
};

export type ClassGroup = {
  id: string;
  name: string;
  mitraId: string;
  waliKelasId: string | null;
  // ... other fields
};

export type ClassGroupCourse = {
  id: string;
  mitraId: string;
  classGroupId: string;
  courseMitraId: string | null;
  teacherId: string;
  academicYearId: string;
  semesterId: string;
  status: AcademicStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  courseMitra?: CourseMitra | null;
  classGroup: ClassGroup;
  teacher: {
    id: string;
    name: string | null;
    email: string;
  };
  academicYear: AcademicYear;
  semester: Semester;
  _count?: {
    modules: number;
  };
};

// ============================================
// MODULE TYPES (DOMAIN-AWARE)
// ============================================

export type Module = {
  id: string;
  title: string;
  summary: string | null;
  sortOrder: number;
  courseInsidiaId: string | null;
  classGroupCourseId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  courseInsidia?: CourseInsidia | null;
  classGroupCourse?: ClassGroupCourse | null;
  _count?: {
    learningItems: number;
    media: number;
  };
};

/**
 * Helper type to determine if a module is INSIDIA or MITRA
 */
export type ModuleDomain = { type: 'INSIDIA'; courseInsidiaId: string; courseId: string } | { type: 'MITRA'; classGroupCourseId: string; courseId: string };

/**
 * Get domain context from module
 */
export function getModuleDomain(module: Module): ModuleDomain | null {
  if (module.courseInsidiaId && module.courseInsidia) {
    return {
      type: 'INSIDIA',
      courseInsidiaId: module.courseInsidiaId,
      courseId: module.courseInsidia.courseId,
    };
  }

  if (module.classGroupCourseId && module.classGroupCourse) {
    return {
      type: 'MITRA',
      classGroupCourseId: module.classGroupCourseId,
      courseId: module.classGroupCourse.courseMitra?.courseId || '',
    };
  }

  return null;
}

// ============================================
// LEARNING ITEM TYPES
// ============================================

export type LearningItem = {
  id: string;
  moduleId: string;
  type: LearningItemType;
  title: string;
  order: number;
  published: boolean;
  availableFrom: string | null;
  availableUntil: string | null;
  createdAt: string;
  updatedAt: string;
  module?: Module;
  lesson?: Lesson | null;
  quiz?: Quiz | null;
  assignment?: Assignment | null;
};

export type Lesson = {
  id: string;
  learningItemId: string;
  title: string;
  slug: string;
  description: string | null;
  type: 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE_SESSION';
  contentJson: Record<string, unknown> | null;
  contentHtml: string | null;
  sortOrder: number;
  isPreview: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  learningItem?: LearningItem;
};

export type Quiz = {
  id: string;
  learningItemId: string;
  title: string;
  description: string | null;
  // ... quiz fields
};

export type Assignment = {
  id: string;
  learningItemId: string;
  title: string;
  description: string | null;
  // ... assignment fields
};

// ============================================
// MEDIA TYPES
// ============================================

export type Media = {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
  ownerType: 'COURSE' | 'MODULE' | 'LESSON' | 'REVIEW' | 'COMMENT' | 'PROFILE';
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
  createdAt: string;
  updatedAt: string;
};

// ============================================
// TYPE GUARDS
// ============================================

export function isInsidiaModule(module: Module): module is Module & { courseInsidiaId: string } {
  return module.courseInsidiaId !== null && module.classGroupCourseId === null;
}

export function isMitraModule(module: Module): module is Module & { classGroupCourseId: string } {
  return module.classGroupCourseId !== null && module.courseInsidiaId === null;
}

export function isCourseInsidia(courseRelation: CourseInsidia | CourseMitra | undefined): courseRelation is CourseInsidia {
  return courseRelation !== undefined && 'price' in courseRelation;
}

export function isCourseMitra(courseRelation: CourseInsidia | CourseMitra | undefined): courseRelation is CourseMitra {
  return courseRelation !== undefined && 'academicStatus' in courseRelation;
}
