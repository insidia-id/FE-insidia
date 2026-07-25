'use client';

import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { MyCoursesDetailHeader } from '../components/MyCoursesDetailHeader';
import { ModuleSection } from '@/features/admin/courses-module/components/ModuleSection';
import { getActiveMitraContext } from '@/features/admin/user/HelperUser';
import { useMyDetailCourses } from '../hooks/useMyDetailCourses';
import { UserRoleCode } from '@/features/admin/user/types/user.types';

type MyCoursesDetailPageProps = {
  id: string;
  currentProfile: AuthProfileResponse;
};

export function MyCoursesDetailPage({ id, currentProfile }: MyCoursesDetailPageProps) {
  const { DetailCourses, classGroupOptions } = useMyDetailCourses(id);
  const { activeMitraId, activeMitraRole, activeInsidiaRole } = getActiveMitraContext(currentProfile);
  const userRole: UserRoleCode | null = activeMitraRole || activeInsidiaRole;
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <MyCoursesDetailHeader course={DetailCourses} userRole={userRole} />
        <ModuleSection course={DetailCourses} activeMitraId={activeMitraId} classGroupOptions={classGroupOptions} userRole={userRole} />
      </div>
    </div>
  );
}
