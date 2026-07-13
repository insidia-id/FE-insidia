import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useDataTable } from '@/lib/hooks/useDataTable';
import { MyCourseResponse } from '../types/my-courses.types';
import { useMyCourseColumns } from '../columns/useMycolumns';

export function useMyCourseTable(courses: MyCourseResponse[]) {
  const [globalFilter, setGlobalFilter] = useState('');
  const columns = useMyCourseColumns();

  const table = useDataTable({
    data: courses,
    columns,
    globalFilter,
    onGlobalFilterChange: setGlobalFilter,
    defaultSorting: [
      {
        id: 'title',
        desc: false,
      },
    ],
    globalFilterFn: (row, _, keyword) => {
      keyword = String(keyword).toLowerCase();

      const course = row.original;

      return [course.title, course.subtitle, course.slug].filter(Boolean).some((x) => String(x).toLowerCase().includes(keyword));
    },
  });

  return {
    table,
    globalFilter,
    onGlobalFilterChange: setGlobalFilter,
  };
}
