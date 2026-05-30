import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { UpdateCoursePage } from '@/features/admin/courses/components/UpdateCoursePage';

type MitraEditCoursePageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function MitraEditCoursePage({ params }: MitraEditCoursePageProps) {
  const profile = await getProfileUser();
  const { slug, id } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/courses/${id}/edit`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);

  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <UpdateCoursePage courseId={id} mitraSlug={slug} disableScopeField />;
}
