'use client';

import { CourseModule } from '@/features/admin/courses-module/types/courses-module.types';
import { ModuleCard } from './ModuleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, BookOpen } from 'lucide-react';
import { UserRoleCode } from '../../user/types/user.types';

interface ModuleListProps {
  modules: CourseModule[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onEdit: (module: CourseModule) => void;
  onDelete: (module: CourseModule) => void;
  courseId?: string;
  userRole: UserRoleCode | null;
}

export function ModuleList({ modules, isLoading, isError, error, onEdit, onDelete, courseId, userRole }: ModuleListProps) {
  if (isLoading) {
    return (
      <div className="divide-y divide-gray-100">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-4 sm:px-6 py-4 flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 sm:px-6 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">Gagal memuat modul</h3>
          <p className="text-sm text-gray-500">{error?.message || 'Terjadi kesalahan saat memuat data modul'}</p>
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="px-4 sm:px-6 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">Belum ada modul</h3>
          <p className="text-sm text-gray-500">Tambahkan modul pertama untuk memulai</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {modules.map((module, index) => (
        <ModuleCard userRole={userRole} key={module.id} courseId={courseId} module={module} index={index} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
