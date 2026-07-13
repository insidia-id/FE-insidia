'use client';

import { useState, useMemo } from 'react';
import { useGetLearningItemsByModuleId } from '@/features/admin/learning-items/hooks/useLearning-Items.query';
import { useGetLessonByLearningItemId } from './useLessons.query';
import { LearningItem } from '@/features/admin/learning-items/types/learnig-items.type';
import { useSearchParams, useRouter } from 'next/navigation';

type UseLessonsPageProps = {
  courseId: string;
  moduleId: string;
  slug: string;
};

export function useLessonsPage({ courseId, moduleId, slug }: UseLessonsPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialLearningItemId = searchParams.get('li');

  const [currentLearningItemId, setCurrentLearningItemId] = useState(initialLearningItemId);

  const { data: learningItems, isLoading: isLearningItemsLoading, isError: isLearningItemsError } = useGetLearningItemsByModuleId(moduleId);

  const lessons = useMemo(() => {
    if (!learningItems || !Array.isArray(learningItems)) return [];
    return (learningItems as LearningItem[]).filter((item: LearningItem) => item.type === 'LESSON');
  }, [learningItems]);

  const { data: currentLesson, isLoading: isCurrentLessonLoading, isError: isCurrentLessonError } = useGetLessonByLearningItemId(currentLearningItemId);

  const currentLearningItem = useMemo(() => {
    return lessons.find((item: LearningItem) => item.id === currentLearningItemId);
  }, [lessons, currentLearningItemId]);

  const currentIndex = useMemo(() => {
    return lessons.findIndex((item: LearningItem) => item.id === currentLearningItemId);
  }, [lessons, currentLearningItemId]);

  const prevLesson = useMemo(() => {
    return currentIndex > 0 ? lessons[currentIndex - 1] : null;
  }, [lessons, currentIndex]);

  const nextLesson = useMemo(() => {
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  }, [lessons, currentIndex]);

  const handleLessonSelect = (learningItemId: string) => {
    router.replace(`?li=${learningItemId}`);
    setCurrentLearningItemId(learningItemId);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isLoading = isLearningItemsLoading || (currentLearningItemId && isCurrentLessonLoading);
  const isError = isLearningItemsError || isCurrentLessonError;

  return {
    lessons,
    currentLesson,
    currentLearningItem,
    prevLesson,
    nextLesson,
    currentIndex,
    isSidebarOpen,
    isLoading,
    isError,
    handleLessonSelect,
    toggleSidebar,
    setIsSidebarOpen,
    slug,
    courseId,
    moduleId,
  };
}
