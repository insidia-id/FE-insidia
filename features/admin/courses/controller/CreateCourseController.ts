import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseFormSchema, type CourseFormValues } from '../schema/course.schema';
import type { CourseScope } from '../types/course.types';
import { useCreateCourse } from '../hooks/useCourses';
import { useCurricula } from '@/features/mitra-academic/hooks/useMitraAcademic';
import { useMemo } from 'react';

export function CreateCourseController(scope: CourseScope, mitraId?: string) {
  const curriculaQuery = useCurricula(scope === 'MITRA' ? mitraId : undefined);
  const form = useForm<CourseFormValues, unknown, CourseFormValues>({
    resolver: zodResolver(courseFormSchema) as Resolver<CourseFormValues>,
    defaultValues: {
      title: '',
      code: null,
      slug: '',
      subtitle: null,
      description: null,
      status: 'DRAFT',
      academicStatus: 'ACTIVE',
      level: 'ALL_LEVEL',
      language: 'id',
      price: 0,
      salePrice: null,
      isFree: true,
      requirements: [],
      outcomes: [],
      targetUsers: [],
      rejectReason: null,
      scope,
      mitraId,
      curriculumId: '',
    },
  });
  const createCourseMutation = useCreateCourse();
  const curriculumOptions = useMemo(
    () =>
      (curriculaQuery.data ?? []).map((curriculum) => ({
        label: `${curriculum.name}${curriculum.code ? ` (${curriculum.code})` : ''}`,
        value: curriculum.id,
      })),
    [curriculaQuery.data],
  );

  const onSubmit = (data: CourseFormValues, onSuccess?: (courseId: string) => void) => {
    createCourseMutation.mutate(data, {
      onSuccess: (course) => {
        onSuccess?.(course.id);
      },
    });
  };

  return {
    form,
    curriculumOptions,
    isSubmitting: createCourseMutation.isPending,
    onSubmit,
  };
}
