import { useGetLessonByLearningItemId, useDeleteLesson, useUpdateLesson } from './useLessons.query';

type UseLessonProps = {
  learningItemId: string | undefined | null;
  lessonId: string;
};

export function useLesson({ learningItemId, lessonId }: UseLessonProps) {
  const { data: lesson, isLoading: isLessonLoading, isError: isLessonError } = useGetLessonByLearningItemId(learningItemId);

  const deleteLessonMutation = useDeleteLesson();

  const updateLessonMutation = useUpdateLesson();

  return {
    lesson,
    isLessonLoading,
    isLessonError,

    isPublished: lesson?.published ?? false,
    isPublishing: updateLessonMutation.isPending,

    isDeleting: deleteLessonMutation.isPending,
  };
}
