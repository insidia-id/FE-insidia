import { useQuery } from '@tanstack/react-query';
import { getMyCourseDetail, getMyCourses } from '../api/api';
import { MyAcademicQueryDto } from '../types/my-courses.types';

export const myCoursesKeys = {
  all: ['my-courses'] as const,
  lists: () => [...myCoursesKeys.all, 'list'] as const,
  list: (query?: MyAcademicQueryDto) => [...myCoursesKeys.lists(), query] as const,
};

export function useGetMyCourses(query?: MyAcademicQueryDto) {
  return useQuery({
    queryKey: myCoursesKeys.list(query),
    queryFn: () => getMyCourses(query),
    refetchOnWindowFocus: false,
  });
}

export function useGetMyCourseDetail(id: string) {
  return useQuery({
    queryKey: [...myCoursesKeys.all, 'detail', id],
    queryFn: () => getMyCourseDetail(id),
    refetchOnWindowFocus: false,
  });
}
