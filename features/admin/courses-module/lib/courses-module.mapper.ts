import { CourseModuleFormValues } from '../schema/courses-module.schema';
import { CourseModule } from '../types/courses-module.types';

export const defaultCourseModuleValues: CourseModuleFormValues = {
  title: '',
  summary: null,
  sortOrder: 0,
  mitraId: null,
  classGroupCourseId: null,
  courseInsidiaId: null,
};

export function toCourseModuleFormValues(module?: CourseModule | null): CourseModuleFormValues {
  if (!module) {
    return defaultCourseModuleValues;
  }

  return {
    title: module.title,
    summary: module.summary,
    sortOrder: module.sortOrder,
    mitraId: module.mitraId,
    classGroupCourseId: module.classGroupCourseId ?? null,
    courseInsidiaId: module.courseInsidiaId ?? null,
  };
}
