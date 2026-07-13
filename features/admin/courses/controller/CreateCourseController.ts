import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseFormSchema, type CourseFormValues } from '../schema/course.schema';
import { useCreateCourse } from '../hooks/useCourses';
import { useCurricula } from '@/features/mitra-academic/curriculum/hooks/useCurriculum';
import { useMemo } from 'react';
import { mapToCreateCourseDto } from '../mapper/course.mapper';
import { defaultInsidiaCourseValues, defaultMitraCourseValues } from '../lib/course.helper';

export function CreateCourseController(mitraId?: string) {
  const form = useForm<CourseFormValues, unknown, CourseFormValues>({
    resolver: zodResolver(courseFormSchema) as Resolver<CourseFormValues, unknown>,
    defaultValues: mitraId ? defaultMitraCourseValues(mitraId) : defaultInsidiaCourseValues(),
  });
  const selectedMitraId = useWatch({
    control: form.control,
    name: 'mitraId',
  });
  const curriculaQuery = useCurricula(mitraId ?? selectedMitraId);
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
    const payload = mapToCreateCourseDto(data);
    createCourseMutation.mutate(payload, {
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
