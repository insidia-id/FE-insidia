import { useState } from 'react';
import { useDeleteCourse, useGetCourseById } from '../hooks/useCourses';
import { AccessScope } from '@/lib/types/types';
import { useRouter } from 'next/navigation';
import { getUsersHref } from '../../user/HelperUser';
type CourseDetailControllerProps = {
  courseId: string;
  scope: AccessScope;
};
export function CourseDetailController({ courseId, scope }: CourseDetailControllerProps) {
  const { data: course, isLoading, isError, error } = useGetCourseById(courseId, scope);
  const deleteCourseMutation = useDeleteCourse();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const router = useRouter();

  const onDelete = () => {
    deleteCourseMutation.mutate(courseId, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        router.push(getUsersHref(null, `?scope=${scope}`));
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
