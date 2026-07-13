'use client';

import { useGetMyCourses } from './MyCoursesQuery';
import { MyAcademicQueryDto } from '@/features/my-courses/types/my-courses.types';
import { useState } from 'react';
export function useMyCourses(query?: MyAcademicQueryDto) {
  const { data: courses, isLoading, error } = useGetMyCourses(query);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const totalCourse = courses?.length ?? 0;
  return {
    courses,
    isLoading,
    error,
    totalCourse,
    viewMode,
    setViewMode,
  };
}
