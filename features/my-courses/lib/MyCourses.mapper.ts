import { MyCourseStudentResponse, MyCourseTeacherResponse } from '../types/my-courses.types';
export const totalClassGroupCourses = (courses: MyCourseStudentResponse[] | MyCourseTeacherResponse[]): number => {
  return courses.reduce((total, course) => {
    if (course.mitra && course.mitra.totalClassGroupCourses) {
      return total + course.mitra.totalClassGroupCourses;
    }
    return total;
  }, 0);
};
