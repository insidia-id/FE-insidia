import { useEffect, useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDeleteCourseModule, useUpdateCourseModule, useCreateClassGroupCourseModule, useGetClassGroupCourseModules } from './courses-module.query';

import { courseModuleFormSchema, CourseModuleFormValues } from '../schema/courses-module.schema';

import { CourseModule } from '../types/courses-module.types';

import { defaultCourseModuleValues, toCourseModuleFormValues } from '../lib/courses-module.mapper';

export interface UseCourseModulesOptions {
  courseId: string;
  classGroupCourseId?: string | null;
  activeMitraId: string | null;
}

export function useCourseModules({ courseId, classGroupCourseId, activeMitraId }: UseCourseModulesOptions) {
  const updateMutation = useUpdateCourseModule(courseId);

  const deleteMutation = useDeleteCourseModule(courseId);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);

  const [moduleToDelete, setModuleToDelete] = useState<CourseModule | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<CourseModuleFormValues, unknown, CourseModuleFormValues>({
    resolver: zodResolver(courseModuleFormSchema) as Resolver<CourseModuleFormValues>,
    defaultValues: defaultCourseModuleValues,
  });

  useEffect(() => {
    form.reset(toCourseModuleFormValues(editingModule));
  }, [editingModule, form]);

  const createMutation = useCreateClassGroupCourseModule(classGroupCourseId || null, courseId);
  const { data: modules = [], isLoading, isError, error } = useGetClassGroupCourseModules(classGroupCourseId);

  function onCreate() {
    setEditingModule(null);

    form.reset({
      ...defaultCourseModuleValues,
      mitraId: activeMitraId || null,
      classGroupCourseId: classGroupCourseId || null,
      sortOrder: modules.length,
    });

    setIsFormOpen(true);
  }

  function onEdit(module: CourseModule) {
    setEditingModule(module);
    setIsFormOpen(true);
  }

  function createModule(data: CourseModuleFormValues) {
    createMutation.mutate(
      { ...data, mitraId: activeMitraId || null },
      {
        onSuccess: () => {
          setIsFormOpen(false);
          form.reset(defaultCourseModuleValues);
        },
      },
    );
  }

  function updateModule(data: CourseModuleFormValues) {
    if (!editingModule) return;
    updateMutation.mutate(
      {
        moduleId: editingModule.id,
        data,
      },
      {
        onSuccess: () => {
          setIsFormOpen(false);
          setEditingModule(null);
          form.reset(defaultCourseModuleValues);
        },
      },
    );
  }

  function onSubmit(data: CourseModuleFormValues) {
    return editingModule ? updateModule(data) : createModule(data);
  }

  function onDelete() {
    if (!moduleToDelete) return;

    deleteMutation.mutate(moduleToDelete.id, {
      onSuccess: () => setModuleToDelete(null),
    });
  }

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
