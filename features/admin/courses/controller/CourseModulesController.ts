import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCourseModule, useDeleteCourseModule, useGetCourseModules, useUpdateCourseModule } from '../hooks/useCourses';
import { courseModuleFormSchema, type CourseModuleFormValues } from '../schema/course.schema';
import type { CourseModule } from '../types/course.types';

const defaultValues: CourseModuleFormValues = {
  title: '',
  summary: null,
  sortOrder: 0,
};

function toFormValues(module?: CourseModule | null): CourseModuleFormValues {
  if (!module) {
    return defaultValues;
  }

  return {
    title: module.title,
    summary: module.summary,
    sortOrder: module.sortOrder,
  };
}

export function CourseModulesController(courseId: string) {
  const { data: modules = [], isLoading, isError, error } = useGetCourseModules(courseId);
  const createMutation = useCreateCourseModule(courseId);
  const updateMutation = useUpdateCourseModule(courseId);
  const deleteMutation = useDeleteCourseModule(courseId);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<CourseModule | null>(null);

  const form = useForm<CourseModuleFormValues, unknown, CourseModuleFormValues>({
    resolver: zodResolver(courseModuleFormSchema) as Resolver<CourseModuleFormValues>,
    defaultValues,
  });

  useEffect(() => {
    form.reset(toFormValues(editingModule));
  }, [editingModule, form]);

  const onCreate = () => {
    setEditingModule(null);
    form.reset({
      ...defaultValues,
      sortOrder: modules.length,
    });
    setIsFormOpen(true);
  };

  const onEdit = (module: CourseModule) => {
    setEditingModule(module);
    setIsFormOpen(true);
  };

  const onSubmit = (data: CourseModuleFormValues) => {
    if (editingModule) {
      updateMutation.mutate(
        { moduleId: editingModule.id, data },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingModule(null);
            form.reset(defaultValues);
          },
        },
      );

      return;
    }

    createMutation.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
        form.reset(defaultValues);
      },
    });
  };

  const onDelete = () => {
    if (!moduleToDelete) {
      return;
    }

    deleteMutation.mutate(moduleToDelete.id, {
      onSuccess: () => {
        setModuleToDelete(null);
      },
    });
  };

  return {
    modules,
    form,
    editingModule,
    moduleToDelete,
    isLoading,
    isError,
    error,
    isFormOpen,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    onCreate,
    onEdit,
    onSubmit,
    onDelete,
    onDeleteTargetChange: setModuleToDelete,
    onFormOpenChange: setIsFormOpen,
  };
}
