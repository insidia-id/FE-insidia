import { ColumnDef } from '@tanstack/react-table';
import { MyCourseResponse } from '../types/my-courses.types';

export function useMyCourseColumns() {
  const columns: ColumnDef<MyCourseResponse>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
    },
    {
      accessorKey: 'mitra.totalClassGroupCourses',
      header: 'Total Class',
      sortingFn: (a, b) => (a.original.totalClassGroupCourses ?? 0) - (b.original.totalClassGroupCourses ?? 0),
    },
  ];

  return columns;
}
