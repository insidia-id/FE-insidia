import { Badge } from '@/components/ui/badge';
import { MyCourseResponse } from '../types/my-courses.types';
import { Calendar, Building2, Clock, BookOpen, FileText, Users, GraduationCap } from 'lucide-react';
import { formatDate } from '@/lib/helper/normalizer.helper';
import { formatDuration } from '../lib/MyCourses.helper';
import { UserRoleCode } from '@/features/admin/user/types/user.types';
import { cn } from '@/lib/utils';

type MyCoursesDetailHeaderProps = {
  course: MyCourseResponse | undefined;
  userRole: UserRoleCode | null;
};

export const MyCoursesDetailHeader = ({ course }: MyCoursesDetailHeaderProps) => {
  const isInsidia = course?.scope === 'INSIDIA';

  const statusConfig = {
    INSIDIA: {
      color: 'bg-purple-100/90 text-purple-700 border-purple-200 backdrop-blur-md',
      label: 'INSIDIA',
      icon: <GraduationCap className="h-3 w-3" />,
    },
    MITRA: {
      color: 'bg-white/60 text-cyan-600 border-blue-200/50 backdrop-blur-md shadow-sm',
      label: 'MITRA',
      icon: <Building2 className="h-3 w-3" />,
    },
  };

  const status = statusConfig[course?.scope ?? 'INSIDIA'];

  return (
    <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden p-0">
      <div className="relative">
        <div className="relative w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-[#7A28E3] via-[#8557E5] to-[#6012C5] flex items-center justify-center p-6 text-center select-none overflow-hidden rounded-t-[inherit]">
          <div 
            className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" 
          />
          <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-purple-300/20 blur-lg" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-purple-400/20 blur-lg" />
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Badge className={cn('border px-2.5 py-1 text-xs font-semibold shadow-xs', status.color)}>
              <span className="flex items-center gap-1.5">
                {status.icon}
                {status.label}
              </span>
            </Badge>
          </div>
          <div className="relative z-0 px-4 max-w-3xl">
            <span className="block text-2xl sm:text-4xl lg:text-5xl uppercase font-bold tracking-wider text-white/25 line-clamp-2 leading-tight drop-shadow-sm">
              {course?.title}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-6 bg-white">
          <h1 className="mt-0 text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{course?.title}</h1>
          {course?.subtitle && <p className="text-gray-500 text-sm sm:text-base mb-4">{course.subtitle}</p>}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Terakhir update {formatDate(course?.updatedAt)}</span>
            </div>
            {course?.teacher?.name && (
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-gray-400" />
                <span>{course.teacher.name}</span>
              </div>
            )}
            {!isInsidia && course?.mitraName && (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span>{course.mitraName}</span>
              </div>
            )}
          </div>

          {course?.description && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-4">
              <div className="flex items-center gap-1.5">
                <span>{course.description}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 sm:px-6 py-4 bg-gray-50/50">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#8557E5]/10 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-[#8557E5]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Modul</p>
              <p className="text-sm font-semibold text-gray-900">{course?.totalModules || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pelajaran</p>
              <p className="text-sm font-semibold text-gray-900">{course?.totalLearningItems || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
              <Clock className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Durasi</p>
              <p className="text-sm font-semibold text-gray-900">{formatDuration(0)}</p>
            </div>
          </div>
          <div className="flex-1 min-w-[150px]">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden"></div>
          </div>
        </div>
      </div>
    </div>
  );
};