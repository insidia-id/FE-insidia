import 'server-only';

import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole, getRoleLandingPath } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { getMyAcademicClasses, getMyAcademicSubjects } from '@/features/mitra-academic/api/api.server';
import { getAcademicErrorMessage, shouldLoadAcademicOverview } from '../lib/mitra-dashboard.helper';
import type { MitraDashboardData } from '../types/mitra-dashboard.types';

export async function getMitraDashboardData(slug: string): Promise<MitraDashboardData> {
  const profile = await getProfileUser();

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/${slug}`);
  }

  if (profile.status === 'BANNED') {
    redirect('/force-logout');
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);

  if (!activeMitraRole) {
    redirect(getRoleLandingPath(profile.insidiaRole, profile.mitraRoles));
  }

  if (activeMitraRole.mitraSlug && activeMitraRole.mitraSlug !== slug) {
    redirect(`/mitra/${activeMitraRole.mitraSlug}`);
  }

  const roleCode = activeMitraRole.roleCode;
  const shouldLoad = shouldLoadAcademicOverview(roleCode);

  let classes: MitraDashboardData['academicOverview']['classes'] = [];
  let courses: MitraDashboardData['academicOverview']['courses'] = [];
  let error: string | null = null;

  if (shouldLoad) {
    try {
      [classes, courses] = await Promise.all([getMyAcademicClasses(), getMyAcademicSubjects()]);
    } catch (caughtError) {
      error = getAcademicErrorMessage(caughtError);
    }
  }
  return {
    slug,
    userLabel: profile.name ?? profile.email,
    activeMitraRole,
    roleCode,
    accountStatus: profile.status,
    isAcademicAdmin: roleCode === 'AKADEMIK',
    academicOverview: {
      classes,
      courses,
      error,
      shouldLoad,
    },
  };
}
