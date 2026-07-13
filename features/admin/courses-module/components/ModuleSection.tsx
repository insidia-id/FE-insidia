'use client';

import { useEffect, useState } from 'react';
import { useCourseModules } from '@/features/admin/courses-module/hooks/useCourses-module';
import { MyCourseResponse } from '@/features/my-courses/types/my-courses.types';
import { ModuleToolbar } from './ModuleToolbar';
import { ModuleList } from './ModuleList';
import { ModuleFormDialog } from './ModuleFormDialog';
import { ModuleDeleteDialog } from './ModuleDeleteDialog';
import { FormDialog } from '@/components/dialog/DialogForm';
import { SelectField } from '@/components/common/form';
import { UserRoleCode } from '@/features/admin/user/types/user.types';
interface ModuleSectionProps {
  course: MyCourseResponse | undefined;
  activeMitraId: string | null;
  classGroupOptions: { label: string; value: string }[];
  userRole: UserRoleCode | null;
}

export function ModuleSection({ course, activeMitraId, classGroupOptions, userRole }: ModuleSectionProps) {
  const [selectedClassGroupCourseId, setSelectedClassGroupCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (classGroupOptions.length === 1 && !selectedClassGroupCourseId) {
      setSelectedClassGroupCourseId(classGroupOptions[0].value);
    }
  }, [classGroupOptions.length, selectedClassGroupCourseId, classGroupOptions]);

  const { modules, form, editingModule, moduleToDelete, isLoading, isError, error, isFormOpen, isSubmitting, isDeleting, onCreate, onEdit, onSubmit, onDelete, onDeleteTargetChange, onFormOpenChange } = useCourseModules({
    courseId: course?.id || '',
    classGroupCourseId: selectedClassGroupCourseId,
    activeMitraId: activeMitraId,
  });

  if (!course) {
    return null;
  }

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border my-3 border-gray-100/80 overflow-hidden">
        {classGroupOptions.length > 1 && (
          <div className="p-4 sm:p-6 border-b w-1/2 border-gray-100">
            <SelectField placeholder="Pilih Kelas Grup" value={selectedClassGroupCourseId || ''} onChange={setSelectedClassGroupCourseId} options={classGroupOptions} disabled={isLoading} />
          </div>
        )}

        <ModuleToolbar userRole={userRole} moduleCount={modules.length} onAddModule={onCreate} disabled={!selectedClassGroupCourseId || isLoading} />

        <ModuleList userRole={userRole} modules={modules} courseId={course.id} isLoading={isLoading} isError={isError} error={error} onEdit={onEdit} onDelete={onDeleteTargetChange} />
      </div>

      <FormDialog open={isFormOpen} onOpenChange={onFormOpenChange} title={editingModule ? 'Edit Modul' : 'Tambah Modul'} description={editingModule ? 'Ubah informasi modul' : 'Tambahkan modul baru'}>
        <ModuleFormDialog activeMitraId={activeMitraId} classGroupOptions={classGroupOptions} form={form} onSubmit={onSubmit} onOpenChange={onFormOpenChange} isSubmitting={isSubmitting} isEditing={Boolean(editingModule)} />
      </FormDialog>

      <ModuleDeleteDialog
        module={moduleToDelete}
        onOpenChange={(open) => {
          if (!open) {
            onDeleteTargetChange(null);
          }
        }}
        onConfirm={onDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
