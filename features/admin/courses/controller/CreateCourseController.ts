import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseFormSchema, createCourseInsidiaFormSchema, CreateCourseInsidiaFormValues, createCourseMitraFormSchema, CreateCourseMitraFormValues, type CourseFormValues } from '../schema/course.schema';
import type { CourseScope } from '../types/course.types';
import { useCreateCourse } from '../hooks/useCourses';
import { useCurricula } from '@/features/mitra-academic/curriculum/hooks/useCurriculum';
import { useMemo } from 'react';
import { mapToCreateCourseDto } from '../mapper/course.mappe';

const defaultValues = (mitraId?: string): CourseFormValues => ({
  title: '',
  code: '',
  slug: '',
  subtitle: null,
  description: null,

  scope: 'MITRA',

  academicStatus: 'ACTIVE',

  level: 'ALL_LEVEL',
  price: 0,
  salePrice: null,
  isFree: true,
  requirements: [],
  outcomes: [],
  targetUsers: [],

  mitraId: mitraId ?? '',
  curriculumId: '',
});

export function CreateCourseController(mitraId?: string) {
  const form = useForm<CourseFormValues, unknown, CourseFormValues>({
    resolver: zodResolver(courseFormSchema) as Resolver<CourseFormValues, unknown>,
    defaultValues: defaultValues(mitraId),
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
