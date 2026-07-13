import { insidiaCourseFormSchema, mitraCourseFormSchema, type CourseFormValues, type CreateCourseDto } from '../schema/course.schema';
import { CourseDetail, CourseInsidiaDetail, CourseMitraDetail } from '../types/course.types';

export function mapToCreateCourseDto(values: CourseFormValues): CreateCourseDto {
  if (values.scope === 'INSIDIA') {
    return insidiaCourseFormSchema.parse(values);
  }

  return mitraCourseFormSchema.parse(values);
}

export function isMitraCourse(course: CourseDetail): course is CourseMitraDetail {
  return course.scope === 'MITRA';
}

export function isInsidiaCourse(course: CourseDetail): course is CourseInsidiaDetail {
  return course.scope === 'INSIDIA';
}
