'use client';
import { BookOpen } from 'lucide-react';
import { CourseStats } from '../components/MyCoursesStatsCard';
import { useMyCourses } from '../hooks/useMyCourses';
import { useMyCourseTable } from '../hooks/useMycourseTable';
import { MyCoursesSearch } from '../components/MyCoursesSearch';
import { MyCourseGrid } from '../components/MyCoursesGrid';

export function MyCoursesPage() {
  const { totalCourse, setViewMode, viewMode, isLoading, error, courses } = useMyCourses();
  const { table, globalFilter, onGlobalFilterChange } = useMyCourseTable(courses || []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="flex items-start gap-4 mb-6 sm:mb-8">
          <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-[#8557E5]/10 items-center justify-center flex-shrink-0">
            <BookOpen className="h-6 w-6 text-[#8557E5]" fill="none" stroke="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Mata Pelajaran</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Temukan dan kelola semua mata pelajaran yang tersedia</p>
          </div>
        </div>
        <CourseStats stats={{ totalClassGroupCourses: totalCourse }} />
        <MyCoursesSearch globalFilter={globalFilter} onGlobalFilterChange={onGlobalFilterChange} viewMode={viewMode} setViewMode={setViewMode} />
        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-gray-500">Memuat mata pelajaran...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-red-500">Terjadi kesalahan saat memuat mata pelajaran.</span>
            </div>
          ) : (
            <MyCourseGrid table={table} viewMode={viewMode} />
          )}
        </div>
      </div>
    </div>
  );
}
