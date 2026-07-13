import type { ClassGroupCourseResponse } from '../types/rombel-subject.types';

export function mapClassGroupCourse(data: ClassGroupCourseResponse) {
  return {
    id: data.id,
    mitraId: data.mitraId,
    classGroupId: data.classGroupId,
    teacherId: data.teacherId,
    academicYearId: data.academicYearId,
    semesterId: data.semesterId,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
    courseMitraId: data.courseMitraId,
    classGroup: data.classGroup,

    course: {
      id: data.course.course.id,
      title: data.course.course.title,
    },

    teacher: data.teacher,

    academicYear: data.academicYear,

    semester: data.semester,
  };
}

export function mapClassGroupCourses(data: ClassGroupCourseResponse[]) {
  return data.map((item) => mapClassGroupCourse(item));
}
