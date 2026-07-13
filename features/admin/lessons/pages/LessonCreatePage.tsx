'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonCreateForm } from '../components/LessonCreateForm';
import { useLessonCreateForm } from '../hooks/useLessonCreateForm';

type LessonCreatePageProps = {
  slug: string;
  courseId: string;
  moduleId: string;
};

export function LessonCreatePage({ slug, courseId, moduleId }: LessonCreatePageProps) {
  const { form, handleSubmit, isSubmitting, handleCancel } = useLessonCreateForm({ moduleId, courseId, slug });

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Materi Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Isi semua detail materi termasuk konten</p>
        </div>
      </div>

      <LessonCreateForm form={form} isSubmitting={isSubmitting} onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
