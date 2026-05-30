import { useEffect, useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCourseById, useUpdateCourse } from '../hooks/useCourses';
import { courseFormSchema, type CourseFormValues } from '../schema/course.schema';
import { joinLines } from '../lib/course.helper';
import { useCurricula } from '@/features/mitra-academic/hooks/useMitraAcademic';

function toFormValues(course: Awaited<ReturnType<typeof useGetCourseById>>['data']): CourseFormValues | null {
  if (!course) {
    return null;
  }

  return {
    title: course.title,
    code: course.code,
    slug: course.slug,
    subtitle: course.subtitle,
    description: course.description,
    status: course.status,
    academicStatus: course.academicStatus,
    level: course.level,
    language: course.language,
    price: course.price,
    salePrice: course.salePrice,
    isFree: course.isFree,
    requirements: course.requirements,
    outcomes: course.outcomes,
    targetUsers: course.targetUsers,
    rejectReason: course.rejectReason,
    scope: course.scope,
    mitraId: course.mitraId ?? undefined,
    curriculumId: course.curriculumId ?? '',
  };
}

export function UpdateCourseController(courseId: string) {
  const { data: course, isLoading, isError, error } = useGetCourseById(courseId);
  const curriculaQuery = useCurricula(course?.scope === 'MITRA' ? (course.mitraId ?? undefined) : undefined);
  const updateCourseMutation = useUpdateCourse();
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
      scope: 'INSIDIA',
      curriculumId: '',
    },
  });
  const curriculumOptions = useMemo(
    () =>
      (curriculaQuery.data ?? []).map((curriculum) => ({
        label: `${curriculum.name}${curriculum.code ? ` (${curriculum.code})` : ''}`,
        value: curriculum.id,
      })),
    [curriculaQuery.data],
  );

  useEffect(() => {
    const values = toFormValues(course);

    if (values) {
      form.reset(values);
    }
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
          requirements: joinLines(course.requirements),
          outcomes: joinLines(course.outcomes),
          targetUsers: joinLines(course.targetUsers),
        }
      : null,
  };
}
