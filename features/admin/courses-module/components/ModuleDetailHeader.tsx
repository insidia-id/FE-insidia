'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CourseModule } from '../types/courses-module.types';
import { Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

type ModuleDetailHeaderProps = {
  module: CourseModule;
  mitraSlug: string;
  courseId: string;
  onEdit: () => void;
  onDelete: () => void;
};

export function ModuleDetailHeader({ module, mitraSlug, courseId, onEdit, onDelete }: ModuleDetailHeaderProps) {
  const courseName = module.course?.title || module.classGroupCourse?.courseMitra.course.title || module.courseInsidia?.course.title || 'Mata Pelajaran';
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href={`/mitra/${mitraSlug}/my-courses`} className="hover:text-gray-700">
          Semua Mata Pelajaran
        </Link>
        <span>/</span>
        <Link href={`/mitra/${mitraSlug}/my-courses/${courseId}`} className="hover:text-gray-700">
          {courseName}
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-900">{module.title}</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{module.title}</h1>
            <Badge variant={module.isPublished ? 'default' : 'secondary'}>{module.isPublished ? 'Published' : 'Draft'}</Badge>
          </div>
          {module.summary && <p className="text-sm text-gray-600 max-w-3xl">{module.summary}</p>}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Module
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Module
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
