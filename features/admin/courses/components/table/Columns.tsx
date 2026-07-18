import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { type CourseDetail } from '../../types/course.types';
import { isInsidiaCourse, isMitraCourse } from '../../mapper/course.mapper';
import { AccessScope } from '@/features/admin/access-control/types/access-control.types';
import { formatDate } from '@/features/mitra-academic/shared/lib/formatters';
import { getUsersHref } from '@/features/admin/user/HelperUser';

type UseCourseColumnsProps = {
  onDeleteRequest: (courseId: string) => void;
  scope: AccessScope;
  mitraSlug: string | null;
};

export function useCourseColumns({ onDeleteRequest, scope, mitraSlug }: UseCourseColumnsProps) {
  return useMemo(() => {
    const baseColumns: ColumnDef<CourseDetail>[] = [
      {
        accessorKey: 'name',
        header: 'Mata Pelajaran',
        cell: ({ row }) => {
          const course = row.original;
          return (
            <div className="min-w-[220px]">
              <p className="font-medium">{course.title}</p>
              <p className="text-xs text-muted-foreground">{course.slug}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'scope',
        header: 'Scope',
        cell: ({ row }) => row.original.scope,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button variant="ghost" className="px-0" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Dibuat
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
    ];

    const mitraColumns: ColumnDef<CourseDetail>[] = [
      {
        accessorKey: 'curriculum.name',
        header: 'Kurikulum',
        cell: ({ row }) => {
          const course = row.original;
          if (!isMitraCourse(course)) return '-';

          return course.curriculum?.name || '-';
        },
      },
      {
        accessorKey: 'academicStatus',
        header: 'Status Akademik',
        cell: ({ row }) => {
          const course = row.original;

          if (!isMitraCourse(course)) return '-';

          return <Badge variant={course.academicStatus === 'ACTIVE' ? 'success' : 'outline'}>{course.academicStatus}</Badge>;
        },
      },
    ];

    const insidiaColumns: ColumnDef<CourseDetail>[] = [
      {
        accessorKey: 'price',
        header: 'Harga',
        cell: ({ row }) => {
          const course = row.original;

          if (!isInsidiaCourse(course)) return '-';

          return course.isFree ? 'Gratis' : `Rp${course.salePrice ?? course.price}`;
        },
      },
    ];

    const actionColumn: ColumnDef<CourseDetail> = {
      id: 'actions',
      header: '',
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const course = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={getUsersHref(mitraSlug, `courses/${course.id}?scope=${scope}`)} className="flex items-center">
                    <Eye className="mr-2 size-4" />
                    Detail
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={getUsersHref(mitraSlug, `courses/${course.id}/edit?scope=${scope}`)} className="flex items-center">
                    <Pencil className="mr-2 size-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onDeleteRequest(course.id)} className="text-destructive">
                  <Trash2 className="mr-2 size-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    };

    return [...baseColumns, ...(scope === 'MITRA' ? mitraColumns : insidiaColumns), actionColumn];
  }, [scope, onDeleteRequest]);
}
