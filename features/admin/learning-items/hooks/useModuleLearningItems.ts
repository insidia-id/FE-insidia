'use client';

import { useRouter } from 'next/navigation';
import { useGetLearningItemsByModuleId, useReorderLearningItems } from './useLearning-Items.query';
import { LearningItemType } from '../types/learnig-items.type';
import { useDeleteLesson, useUpdateLesson } from '../../lessons/hooks/useLessons.query';

interface UseModuleLearningItemsProps {
  moduleId: string;
  courseId: string;
  slug: string;
}

interface LearningItemResponse {
  id: string;
  title: string;
  type: LearningItemType;
  sortOrder: number;
  isPublished: boolean;
  lesson?: {
    id: string;
  };
  [key: string]: any;
}

export function useModuleLearningItems({ moduleId, courseId, slug }: UseModuleLearningItemsProps) {
  const router = useRouter();

  const { data: learningItems = [], isLoading } = useGetLearningItemsByModuleId(moduleId);

  const reorderItems = useReorderLearningItems(moduleId);

  const items = (learningItems as LearningItemResponse[]) || [];

  const deleteItem = useDeleteLesson();
  const updateLesson = useUpdateLesson();

  const handleTogglePublish = (itemId: string, currentPublished: boolean) => {
    updateLesson.mutate({
      learningItemId: itemId ?? '',
      data: {
        published: !currentPublished,
      },
      moduleId: moduleId,
    });
  };

  const handleDeleteItem = (LearningItemId: string, itemId: string) => {
    deleteItem.mutate({ learningItemId: LearningItemId, lessonId: itemId, moduleId: moduleId });
  };

  const handleOpenItem = (itemId: string, type: LearningItemType) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (type === 'LESSON') {
      console.log('Navigating to lesson editor for item:', itemId);
      router.push(`/mitra/${slug}/courses/${courseId}/module/${moduleId}/lessons?li=${item.id}`);
    } else if (type === 'QUIZ') {
      console.log('Quiz editor not implemented yet');
    } else if (type === 'ASSIGNMENT') {
      console.log('Assignment editor not implemented yet');
    }
  };

  const handleReorder = (reorderedItems: Array<{ id: string; sortOrder: number }>) => {
    reorderItems.mutate(reorderedItems);
  };

  return {
    learningItems: items,
    isLoading,
    handleTogglePublish,
    handleDeleteItem,
    handleOpenItem,
    handleReorder,
    isReordering: reorderItems.isPending,
    isDeleting: deleteItem.isPending,
  };
}
