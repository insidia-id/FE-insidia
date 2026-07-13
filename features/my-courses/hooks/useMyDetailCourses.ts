import { useGetMyCourseDetail } from './MyCoursesQuery';
export function useMyDetailCourses(id: string) {
  const { data: DetailCourses, isLoading, error } = useGetMyCourseDetail(id);
  const classGroupCourses = DetailCourses?.classGroupCourses || [];

  const classGroupOptions = classGroupCourses.map((classGroupCourse: { classGroupName: string; classGroupCourseId: string }) => ({
    label: `Kelas Grup ${classGroupCourse.classGroupName || 'Tidak Diketahui'}`,
    value: classGroupCourse.classGroupCourseId,
  }));

  return {
    DetailCourses,
    isLoading,
    error,
    classGroupOptions,
  };
}
