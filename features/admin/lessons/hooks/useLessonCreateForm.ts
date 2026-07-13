'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lessonsSchema, type LessonsSchema } from '../schema/lessons.schema';
import { defaultLessonValues } from '../helper/lessons.helper';
import { useCreateLesson } from './useLessons.query';
import { useRouter } from 'next/navigation';

interface UseCreateLessonProps {
  moduleId: string;
  courseId: string;
  slug: string;
}

export function useLessonCreateForm({ moduleId, courseId, slug }: UseCreateLessonProps) {
  const createMutation = useCreateLesson();
  const form = useForm<LessonsSchema>({
    resolver: zodResolver(lessonsSchema),
    defaultValues: defaultLessonValues(),
  });
  const router = useRouter();

  const handleSubmit = form.handleSubmit(async (data) => {
    createMutation.mutate(
      { moduleId, data },
      {
        onSuccess: () => {
          form.reset(defaultLessonValues());
          router.push(`/mitra/${slug}/my-courses/${courseId}/module/${moduleId}/lessons`);
        },
      },
    );
  });
  const handleCancel = () => {
    router.push(`/mitra/${slug}/my-courses/${courseId}/module/${moduleId}`);
  };
  return {
    form,
    handleSubmit,
    isSubmitting: createMutation.isPending,
    handleCancel,
  };
}
