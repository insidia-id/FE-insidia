import type { CourseLevel, CourseScope, CourseStatus, CourseStatusFilter } from '../types/course.types';

export const COURSE_SCOPE_OPTIONS: Array<{ label: string; value: CourseScope }> = [
  { label: 'Insidia', value: 'INSIDIA' },
  { label: 'Mitra', value: 'MITRA' },
];

export const COURSE_STATUS_OPTIONS: Array<{ label: string; value: CourseStatus }> = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Review', value: 'REVIEW' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Archived', value: 'ARCHIVED' },
];

export const COURSE_STATUS_FILTER_OPTIONS: Array<{ label: string; value: CourseStatusFilter }> = [
  { label: 'Semua status', value: 'ALL' },
  ...COURSE_STATUS_OPTIONS,
];

export const COURSE_LEVEL_OPTIONS: Array<{ label: string; value: CourseLevel }> = [
  { label: 'Semua level', value: 'ALL_LEVEL' },
  { label: 'Beginner', value: 'BEGINNER' },
  { label: 'Intermediate', value: 'INTERMEDIATE' },
  { label: 'Advanced', value: 'ADVANCED' },
];

export const MEDIA_TYPE_OPTIONS = [
  { label: 'Auto detect', value: 'AUTO' },
  { label: 'Image', value: 'IMAGE' },
  { label: 'Video', value: 'VIDEO' },
  { label: 'Document', value: 'DOCUMENT' },
  { label: 'Audio', value: 'AUDIO' },
] as const;

export function getCoursesHref(mitraSlug: string | null, path = '') {
  const suffix = path ? `/${path}` : '';

  if (mitraSlug) {
    return `/mitra/admin/${mitraSlug}/courses${suffix}`;
  }

  return `/admin/courses${suffix}`;
}

export function formatCourseStatus(status: CourseStatus) {
  return COURSE_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

export function formatCourseScope(scope: CourseScope) {
  return COURSE_SCOPE_OPTIONS.find((option) => option.value === scope)?.label ?? scope;
}

export function getCourseStatusVariant(status: CourseStatus): 'success' | 'warning' | 'error' | 'outline' {
  switch (status) {
    case 'PUBLISHED':
      return 'success';
    case 'REVIEW':
      return 'warning';
    case 'REJECTED':
      return 'error';
    default:
      return 'outline';
  }
}

export function joinLines(values: string[]) {
  return values.join('\n');
}

export function bytesToSize(sizeBytes: number | null) {
  if (!sizeBytes) {
    return '-';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = sizeBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
