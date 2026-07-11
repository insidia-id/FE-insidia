import { memo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CourseScopeRender } from './CourseScopeRender';
import { CreateCourseInsidiaFormValues, CreateCourseMitraFormValues } from '../schema/course.schema';
import { AccessScope } from '../../access-control/types/access-control.types';
import { UserRoleCode } from '../../user/types/user.types';
import type { CourseFormValues } from '../schema/course.schema';

export type CourseScopeProps = {
  scope: AccessScope;
  form: UseFormReturn<CourseFormValues>;
  isLoadingCourses?: boolean;
  curriculumOptions: Array<{ label: string; value: string }>;
  mitraOptions?: Array<{ label: string; value: string }>;
  isLoadingMitras?: boolean;
  userRole: UserRoleCode | null;
  setMitraQuery?: (query: string) => void;
};

export const CourseScopeRow = memo(({ scope, form, isLoadingCourses, curriculumOptions, mitraOptions, isLoadingMitras, userRole, setMitraQuery }: CourseScopeProps) => {
  return (
    <CourseScopeRender scope={scope} form={form} isLoadingCourses={isLoadingCourses} curriculumOptions={curriculumOptions} mitraOptions={mitraOptions} isLoadingMitras={isLoadingMitras} userRole={userRole} setMitraQuery={setMitraQuery} />
  );
});
