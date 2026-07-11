import { createCourseInsidiaFormSchema, createCourseMitraFormSchema, type CourseFormValues, type CreateCourseDto } from '../schema/course.schema';

export function mapToCreateCourseDto(values: CourseFormValues): CreateCourseDto {
  if (values.scope === 'INSIDIA') {
    return createCourseInsidiaFormSchema.parse(values);
  }

  return createCourseMitraFormSchema.parse(values);
}
