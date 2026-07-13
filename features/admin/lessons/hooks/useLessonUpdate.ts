import { useUpdateLesson } from './useLessons.query';
import { Lesson } from '../types/lessons.types';
import { useEffect } from 'react';
import { UpdatableLessonValues, updatableLessonsSchema } from '../schema/lessons.schema';
import { useForm } from 'react-hook-form';
import { toformLessonValues } from '../helper/lessons.helper';
import { zodResolver } from '@hookform/resolvers/zod';
type UseLessonUpdateProps = {
  lessons: Lesson;
};

export function useLessonUpdate({ lessons }: UseLessonUpdateProps) {
  const updateLessonMutation = useUpdateLesson();

  const form = useForm<UpdatableLessonValues>({
    resolver: zodResolver(updatableLessonsSchema),
    defaultValues: toformLessonValues(lessons),
  });
  useEffect(() => {
    form.reset(toformLessonValues(lessons));
  }, [lessons, form]);

  const onSubmit = (data: UpdatableLessonValues, onSuccess?: () => void) => {
    updateLessonMutation.mutate(
      { learningItemId: lessons.id, data },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };
  return { form, onSubmit, isUpdating: updateLessonMutation.isPending };
}
