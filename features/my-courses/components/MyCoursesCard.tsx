'use client';

import Link from 'next/link';
import { useMemo } from 'react';
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

const SOFT_GRADIENT_VARIANTS = [
  {
    baseGradient: 'from-[#7A28E3] via-[#8557E5] to-[#6012C5]',
    orbs: (
      <>
        <div className="absolute -top-12 -left-10 w-44 h-44 rounded-full bg-[#A855F7]/40 blur-2xl group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-[#16E4D0]/30 blur-3xl group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-32 h-32 rounded-full bg-[#EC4899]/20 blur-2xl" />
      </>
    ),
  },
  {
    baseGradient: 'from-[#6366F1] via-[#7C3AED] to-[#4338CA]',
    orbs: (
      <>
        <div className="absolute -top-16 -right-10 w-52 h-52 rounded-full bg-[#06B6D4]/30 blur-3xl group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#E0E7FF]/25 blur-2xl group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute bottom-1/4 right-1/4 w-36 h-36 rounded-full bg-[#8B5CF6]/40 blur-2xl" />
      </>
    ),
  },
  {
    baseGradient: 'from-[#4F46E5] via-[#8557E5] to-[#581C87]',
    orbs: (
      <>
        <div className="absolute top-0 -right-12 w-48 h-48 rounded-full bg-[#F43F5E]/25 blur-3xl group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute -bottom-12 left-0 w-44 h-44 rounded-full bg-[#A855F7]/35 blur-2xl group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-10 left-10 w-28 h-28 rounded-full bg-[#38BDF8]/25 blur-xl" />
      </>
    ),
  },
  {
    baseGradient: 'from-[#8B5CF6] via-[#6366F1] to-[#3B82F6]',
    orbs: (
      <>
        <div className="absolute -bottom-14 -left-10 w-52 h-52 rounded-full bg-[#D946EF]/25 blur-3xl group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute -top-10 right-0 w-40 h-40 rounded-full bg-[#60A5FA]/30 blur-2xl group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-[#A855F7]/30 blur-2xl" />
      </>
    ),
  },
];

export function MyCoursesCard({ course, viewMode = 'grid' }: MyCourseCardProps) {
  const isInsidia = course.scope === 'INSIDIA';
  const isList = viewMode === 'list';
  const teacherName = course.teacher?.name ?? 'Belum Ditentukan';
  const teacherInitial = course.teacher?.name?.charAt(0).toUpperCase() ?? 'U';
  const variant = useMemo(() => {
    const key = String(course.id || course.title);
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % SOFT_GRADIENT_VARIANTS.length;
    return SOFT_GRADIENT_VARIANTS[index];
  }, [course.id, course.title]);

  const statusConfig = {
    INSIDIA: {
      color: 'bg-purple-100/90 text-purple-700 border-purple-200 backdrop-blur-md',
      label: 'INSIDIA',
      icon: <GraduationCap className="h-3 w-3" />,
    },
    MITRA: {
      color: 'bg-white/70 text-cyan-600 border-blue-200/50 backdrop-blur-md shadow-sm',
      label: 'MITRA',
      icon: <Building2 className="h-3 w-3" />,
    },
  };
  const href = `my-courses/${course.id}`;
  const status = statusConfig[course.scope];

  return (
    <Card className={cn('group overflow-hidden border-gray-200 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl p-0', isList ? 'flex flex-col sm:flex-row' : 'flex flex-col')}>
      <div className={cn('relative overflow-hidden bg-gradient-to-br flex items-center justify-center p-6 text-center select-none', variant.baseGradient, isList ? 'w-full sm:w-64 h-52 sm:h-auto flex-shrink-0' : 'w-full h-70 rounded-t-[inherit]')}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] z-0" />
        <div className="absolute inset-0 pointer-events-none z-0">
          {variant.orbs}
        </div>
        <div className="absolute top-3 left-3 z-10">
          <Badge className={cn('border px-2.5 py-1 text-xs font-semibold shadow-xs', status.color)}>
            <span className="flex items-center gap-1.5">
              {status.icon}
              {status.label}
            </span>
          </Badge>
        </div>
        <div className="relative z-10 px-2">
          <span className="block text-2xl sm:text-3xl uppercase font-bold tracking-wider text-white/30 group-hover:text-white/60 group-hover:scale-105 transition-all duration-500 line-clamp-2 leading-wide drop-shadow-sm">
            {course.title}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 pt-3 bg-white">
        <div>
          <h1 className="mt-0 text-xl font-semibold text-gray-900 transition-colors group-hover:text-[#8557E5] line-clamp-2">
            {course.title}
          </h1>

          {course.subtitle && <p className="mt-1 line-clamp-2 text-sm text-gray-500">{course.subtitle}</p>}

          {isList && course.description && <p className="mt-3 line-clamp-2 text-sm text-gray-500">{course.description}</p>}

          <div className="mt-4 flex flex-wrap gap-2">
            {!isInsidia && course.mitraName && (
              <div className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 text-xs text-cyan-700 border border-cyan-200">
                <Building2 className="h-3.5 w-3.5 text-cyan-700" />
                {course.mitraName}
              </div>
            )}

            {!isInsidia && course.curriculum && (
              <div className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 text-xs text-cyan-700 border border-cyan-200">
                <GraduationCap className="h-3.5 w-3.5 text-cyan-700" />
                {course.curriculum}
              </div>
            )}

            <div className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 text-xs text-cyan-700 border border-cyan-200">
              <Calendar className="h-3.5 w-3.5 text-cyan-700" />
              {formatDate(course.createdAt)}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8557E5]/30 bg-[#8557E5]/10 shrink-0">
              <span className="text-sm font-semibold text-[#8557E5]">{teacherInitial}</span>
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Pengajar</p>
              <p className="truncate text-sm font-semibold text-gray-800">{teacherName}</p>
            </div>
          </div>

          <Button asChild variant="ghost" size="sm" className="text-[#8557E5] hover:bg-[#8557E5]/10 hover:text-[#6f44c9]">
            <Link href={href} className="flex items-center gap-1 font-semibold">
              Lihat
              <ChevronRight className="ml-0.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}