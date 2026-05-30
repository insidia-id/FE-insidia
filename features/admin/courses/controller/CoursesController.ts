import { useMemo, useState } from 'react';
import type { CourseScope, CourseStatusFilter } from '../types/course.types';
import { useGetCourses } from '../hooks/useCourses';

type CoursesControllerOptions = {
  initialScope: CourseScope;
  canChangeScope: boolean;
  mitraId?: string;
};

export function CoursesController({ initialScope, canChangeScope, mitraId }: CoursesControllerOptions) {
  const [scope, setScope] = useState<CourseScope>(initialScope);
  const [statusFilter, setStatusFilter] = useState<CourseStatusFilter>('ALL');
  const { data = [], isLoading, isError, error } = useGetCourses(scope, statusFilter === 'ALL' ? undefined : statusFilter, mitraId);

  const courses = useMemo(() => data, [data]);

  return {
    scope,
    statusFilter,
    courses,
    canChangeScope,
    isLoading,
    isError,
    error,
    onScopeChange: setScope,
    onStatusFilterChange: setStatusFilter,
  };
}
