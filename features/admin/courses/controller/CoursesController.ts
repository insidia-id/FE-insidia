import { useMemo, useState } from 'react';
import type { CourseScope, CourseStatusFilter } from '../types/course.types';
import { useGetCourses } from '../hooks/useCourses';

type CoursesControllerOptions = {
  initialScope: CourseScope;
  mitraId?: string | null;
};

export function CoursesController({ initialScope, mitraId }: CoursesControllerOptions) {
  const [scope, setScope] = useState<CourseScope>(initialScope);
  const [statusFilter, setStatusFilter] = useState<CourseStatusFilter>('ALL');
  const { data = [], isLoading, isError, error } = useGetCourses(scope, statusFilter === 'ALL' ? undefined : statusFilter, mitraId);
  const courses = data ?? [];
  return {
    scope,
    statusFilter,
    courses,
    isLoading,
    isError,
    error,
    onScopeChange: setScope,
    onStatusFilterChange: setStatusFilter,
  };
}
