import { useState } from 'react';
import { CourseDetail } from '../types/course.types';
import { useCourseColumns } from '../components/table/Columns';
import { useDeleteCourse } from './useCourses';
import { useDataTable } from '@/lib/hooks/useDataTable';
import { AccessScope } from '../../access-control/types/access-control.types';
type CourseTableProps = {
  courses: CourseDetail[];
  scope: AccessScope;
  mitraSlug: string | null;
};

export function useCourseTable({ courses, scope, mitraSlug }: CourseTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteCourseMutation = useDeleteCourse();

  const columns = useCourseColumns({
    onDeleteRequest: (courseId) => {
      setSelectedCourseId(courseId);
      setIsDeleteOpen(true);
    },
    scope,
    mitraSlug,
  });

  const table = useDataTable({
    data: courses,
    columns,

    globalFilter,
    onGlobalFilterChange: setGlobalFilter,
    defaultSorting: [
      {
        id: 'createdAt',
        desc: true,
      },
    ],

    globalFilterFn: (row, _, keyword) => {
      keyword = String(keyword).toLowerCase();

      const course = row.original;

      return [course.title, course.slug, course.scope].filter(Boolean).some((v) => String(v).toLowerCase().includes(keyword));
    },
  });

  return {
    columns,
    globalFilter,
    isDeleteOpen,
    isDeleting: deleteCourseMutation.isPending,
    selectedCourseId,
    table,
    onConfirmDelete: () => {
      if (!selectedCourseId) {
        return;
      }

      deleteCourseMutation.mutate(selectedCourseId, {
        onSuccess: () => {
          setSelectedCourseId(null);
          setIsDeleteOpen(false);
        },
      });
    },
    onDeleteDialogChange: (open: boolean) => {
      setIsDeleteOpen(open);

      if (open) {
        return;
      }

      setSelectedCourseId(null);
    },
    onGlobalFilterChange: setGlobalFilter,
  };
}
