import { useEffect, useMemo, useRef } from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCourseById, useUpdateCourse } from '../hooks/useCourses';
import { courseFormSchema, type CourseFormValues } from '../schema/course.schema';
import { joinLines } from '../lib/course.helper';
import { useCurricula } from '@/features/mitra-academic/curriculum/hooks/useCurriculum';
import { defaultInsidiaCourseValues, defaultMitraCourseValues, toFormValues } from '../lib/course.helper';
import { AccessScope } from '../../access-control/types/access-control.types';
import { CourseDetail } from '../types/course.types';

type UpdateCourseControllerProps = {
  courseId: string;
  scope: AccessScope;
  activeMitraId: string | null;
};

export function UpdateCourseController({ activeMitraId, courseId, scope }: UpdateCourseControllerProps) {
  const { data: course, isLoading, isError, error } = useGetCourseById(courseId, scope);
  const updateCourseMutation = useUpdateCourse();
  const form = useForm<CourseFormValues, unknown, CourseFormValues>({
    resolver: zodResolver(courseFormSchema) as Resolver<CourseFormValues>,
    defaultValues: scope === 'MITRA' ? defaultMitraCourseValues(course?.scope === 'MITRA' ? course.mitraId : undefined) : defaultInsidiaCourseValues(),
  });

  const selectedMitraId = useWatch({
    control: form.control,
    name: 'mitraId',
  });
  const curriculaQuery = useCurricula(selectedMitraId || activeMitraId || '');

  const curriculumOptions = useMemo(
    () =>
      (curriculaQuery.data ?? []).map((curriculum) => ({
        label: `${curriculum.name}${curriculum.code ? ` (${curriculum.code})` : ''}`,
        value: curriculum.id,
      })),
    [curriculaQuery.data],
  );

  useEffect(() => {
    if (!course) return;
    const values = toFormValues(course as CourseDetail);
    form.reset(values);
  }, [course, form]);

  const onSubmit = (data: CourseFormValues, onSuccess?: () => void) => {
    updateCourseMutation.mutate(
      { courseId, data },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return {
    form,
    course,
    curriculumOptions,
    isLoading,
    isError,
    error,
    isSubmitting: updateCourseMutation.isPending,
    onSubmit,
    preview: course
      ? {
          requirements: joinLines(course.scope === 'INSIDIA' ? (course.requirements ?? []) : []),
          outcomes: joinLines(course.scope === 'INSIDIA' ? (course.outcomes ?? []) : []),
          targetUsers: joinLines(course.scope === 'INSIDIA' ? (course.targetUsers ?? []) : []),
        }
      : null,
  };
}
