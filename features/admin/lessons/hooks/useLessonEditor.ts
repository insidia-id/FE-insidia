'use client';

import { useState } from 'react';
import { useGetLessonByLearningItemId, useUpdateLesson } from './useLessons.query';

interface UseLessonEditorProps {
  learningItemId: string;
  lessonId: string;
}

interface LessonData {
  id: string;
  title: string;
  contentJson?: string | null;
  contentHtml?: string | null;
  [key: string]: any;
}

export function useLessonEditor({ learningItemId, lessonId }: UseLessonEditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  const { data: lessonData, isLoading } = useGetLessonByLearningItemId(learningItemId);
  const lesson = lessonData as LessonData | undefined;
  const updateLesson = useUpdateLesson();

  const handleSave = async (content: { contentJson: string; contentHtml: string }) => {
    if (!lesson) return;

    setIsSaving(true);
    try {
      await updateLesson.mutateAsync({
        learningItemId: learningItemId,
        data: {
          contentJson: content.contentJson,
          contentHtml: content.contentHtml,
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    lesson,
    isLoading,
    isSaving,
    handleSave,
  };
}
