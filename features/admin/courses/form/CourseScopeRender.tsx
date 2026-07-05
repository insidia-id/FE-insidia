import { UseFormReturn } from 'react-hook-form';
import { AccessScope } from '@/lib/types/types';
import { CourseMitraForm } from './CourseMitraForm';
import { CourseInsidiaForm } from './CourseInsidiaForm';
import { CreateCourseInsidiaFormValues, CreateCourseMitraFormValues } from '../schema/course.schema';
import { UserRoleCode } from '../../user/types/user.types';
import type { CourseFormValues } from '../schema/course.schema';
type Props = {
  scope: AccessScope;
  form: UseFormReturn<CourseFormValues>;
  isLoadingCourses?: boolean;
  curriculumOptions: Array<{ label: string; value: string }>;
  mitraOptions?: Array<{ label: string; value: string }>;
  isLoadingMitras?: boolean;
  userRole: UserRoleCode | null;
  setMitraQuery?: (query: string) => void;
};

export function CourseScopeRender({ scope, form, isLoadingCourses, curriculumOptions, mitraOptions, isLoadingMitras, userRole, setMitraQuery }: Props) {
  switch (scope) {
    case 'INSIDIA':
      return <CourseInsidiaForm form={form} isLoadingCourses={isLoadingCourses} />;

    case 'MITRA':
      return <CourseMitraForm form={form} isLoadingCourses={isLoadingCourses} curriculumOptions={curriculumOptions} mitraOptions={mitraOptions} isLoadingMitras={isLoadingMitras} userRole={userRole} setMitraQuery={setMitraQuery} />;
    default:
      return null;
  }
}
