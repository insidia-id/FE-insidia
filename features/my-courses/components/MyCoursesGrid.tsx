import { Table } from '@tanstack/react-table';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { MyCourseResponse } from '../types/my-courses.types';
import { MyCoursesCard } from './MyCoursesCard';

interface MyCourseGridProps {
  table: Table<MyCourseResponse>;
  viewMode: 'grid' | 'list';
}

export function MyCourseGrid({ table, viewMode }: MyCourseGridProps) {
  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return (
      <Card className="flex h-64 items-center justify-center border-dashed">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Mata pelajaran tidak ditemukan</h3>
          <p className="mt-1 text-sm text-gray-500">Coba ubah kata kunci pencarian atau filter yang digunakan.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('grid gap-6', viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
      {rows.map((row) => {
        return <MyCoursesCard key={row.original.id} course={row.original} viewMode={viewMode} />;
      })}
    </div>
  );
}
