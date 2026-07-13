'use client';

import Link from 'next/link';
import { Building2, Calendar, ChevronRight, GraduationCap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { formatDate } from '@/lib/helper/normalizer.helper';
import { cn } from '@/lib/utils';

import { MyCourseResponse } from '../types/my-courses.types';

interface MyCourseCardProps {
  course: MyCourseResponse;
  viewMode?: 'grid' | 'list';
}

export function MyCoursesCard({ course, viewMode = 'grid' }: MyCourseCardProps) {
  const isInsidia = course.scope === 'INSIDIA';
  const isList = viewMode === 'list';
  const teacherName = course.teacher?.name ?? 'Belum ditentukan';
  const teacherInitial = course.teacher?.name?.charAt(0).toUpperCase() ?? 'U';

  const statusConfig = {
    INSIDIA: {
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      label: 'INSIDIA',
      icon: <GraduationCap className="h-3 w-3" />,
    },
    MITRA: {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      label: 'MITRA',
      icon: <Building2 className="h-3 w-3" />,
    },
  };
  const href = `my-courses/${course.id}`;

  const status = statusConfig[course.scope];

  return (
    <Card className={cn('group overflow-hidden border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl', isList ? 'flex flex-col sm:flex-row' : 'flex flex-col')}>
      <div className={cn('relative overflow-hidden bg-gray-100', isList ? 'w-full sm:w-64 h-52 sm:h-auto flex-shrink-0' : 'w-full h-35')}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#E1D6F8]/50 via-[#835DE3]/50 to-[#835DE3]" />

        <div className="absolute top-3 left-3">
          <Badge className={cn('border', status.color)}>
            <span className="flex items-center gap-1">
              {status.icon}
              {status.label}
            </span>
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="min-h-[56px] text-lg font-semibold leading-7 text-gray-900 transition-colors group-hover:text-[#8557E5] line-clamp-2">{course.title}</h3>

          {course.subtitle && <p className="mt-1 line-clamp-2 text-sm text-gray-500">{course.subtitle}</p>}

          {isList && course.description && <p className="mt-3 line-clamp-2 text-sm text-gray-500">{course.description}</p>}

          <div className="mt-4 flex flex-wrap gap-2">
            {!isInsidia && course.mitraName && (
              <div className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-600">
                <Building2 className="h-3.5 w-3.5" />
                {course.mitraName}
              </div>
            )}

            {!isInsidia && course.curriculum && (
              <div className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-600">
                <GraduationCap className="h-3.5 w-3.5" />
                {course.curriculum}
              </div>
            )}

            <div className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-600">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(course.createdAt)}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8557E5]/10">
              <span className="text-sm font-semibold text-[#8557E5]">{teacherInitial}</span>
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500">Pengajar</p>
              <p className="truncate text-sm font-medium text-gray-900">{teacherName}</p>
            </div>
          </div>

          <Button asChild variant="ghost" size="sm" className="text-[#8557E5] hover:bg-[#8557E5]/10 hover:text-[#6f44c9]">
            <Link href={href} className="flex items-center gap-1">
              Lihat
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
