import { useState } from 'react';
import { useDeleteCourse, useGetCourseById } from '../hooks/useCourses';

export function CourseDetailController(courseId: string, onDeleted?: () => void) {
  const { data: course, isLoading, isError, error } = useGetCourseById(courseId);
  const deleteCourseMutation = useDeleteCourse();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const onDelete = () => {
    deleteCourseMutation.mutate(courseId, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        onDeleted?.();
      },
    });
  };

  return {
    course,
    isLoading,
    isError,
    error,
    isDeleteOpen,
    isDeleting: deleteCourseMutation.isPending,
    onDelete,
    onDeleteOpenChange: setIsDeleteOpen,
  };
}
