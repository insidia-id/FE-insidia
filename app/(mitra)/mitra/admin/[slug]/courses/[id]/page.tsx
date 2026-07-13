import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { CourseDetailPage } from '@/features/admin/courses/pages/CourseDetailPage';
import { AccessScope } from '@/features/admin/access-control/types/access-control.types';

type MitraCourseDetailPageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
  searchParams: Promise<{
    scope: AccessScope;
  }>;
};

export default async function MitraCourseDetailPage({ params, searchParams }: MitraCourseDetailPageProps) {
  const profile = await getProfileUser();
  const { slug, id } = await params;
  const { scope } = await searchParams;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/courses/${id}`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);

  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <CourseDetailPage courseId={id} mitraSlug={slug} scope={scope} />;
}
