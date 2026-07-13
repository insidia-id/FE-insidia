'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LessonEditor } from '../components/LessonEditor';
import { useLessonEditor } from '../hooks/useLessonEditor';

import { AuthProfileResponse } from '@/features/auth/types/auth.types';

type LessonEditorPageProps = {
  slug: string;
  courseId: string;
  moduleId: string;
  learningItemId: string;
  lessonId: string;
  currentProfile: AuthProfileResponse;
};

export function LessonEditorPage({ slug, courseId, moduleId, learningItemId, lessonId, currentProfile }: LessonEditorPageProps) {
  const router = useRouter();
  const { lesson, isLoading, isSaving, handleSave } = useLessonEditor({ learningItemId, lessonId });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-500">
          <Loader2 className="h-12 w-12 animate-spin mb-4 text-[#8557e5]" />
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Lesson Not Found</h3>
          <p className="mt-1 text-sm text-gray-500 mb-4">The lesson you are looking for does not exist.</p>
          <Button onClick={() => router.push(`/mitra/${slug}/courses/${courseId}/module/${moduleId}`)}>Back to Module</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push(`/mitra/${slug}/courses/${courseId}/module/${moduleId}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Module
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{lesson.title || 'Untitled Lesson'}</h1>
                <p className="text-xs text-gray-500">Lesson Editor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LessonEditor initialContentJson={lesson.contentJson} initialContentHtml={lesson.contentHtml} isSaving={isSaving} onSave={handleSave} />
      </div>
    </div>
  );
}
