import { Badge } from '@/components/ui/badge';
import { MyCourseResponse } from '../types/my-courses.types';
import { Calendar, Building2, Clock, BookOpen, FileText, Users, GraduationCap } from 'lucide-react';
import { formatDate } from '@/lib/helper/normalizer.helper';
import { formatDuration } from '../lib/MyCourses.helper';
type MyCoursesDetailHeaderProps = {
  course: MyCourseResponse | undefined;
};
export const MyCoursesDetailHeader = ({ course }: MyCoursesDetailHeaderProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-r from-[#8557E5]/20 to-purple-100/20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 border-0">
              {course?.scope === 'INSIDIA' ? (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  INSIDIA
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  MITRA
                </span>
              )}
            </Badge>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{course?.title}</h1>
          {course?.subtitle && <p className="text-gray-500 text-sm sm:text-base mb-4">{course.subtitle}</p>}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Terakhir update {formatDate(course?.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{course?.teacher?.name}</span>
            </div>
            {course?.mitraName && (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                <span>{course.mitraName}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-4">
            <div className="flex items-center gap-1.5">
              <span>{course?.description}</span>
            </div>
          </div>
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
