import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { CourseDetailPage } from '@/features/admin/courses/components/CourseDetailPage';

type MitraCourseDetailPageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function MitraCourseDetailPage({ params }: MitraCourseDetailPageProps) {
  const profile = await getProfileUser();
  const { slug, id } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/courses/${id}`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);

  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <CourseDetailPage courseId={id} mitraSlug={slug} />;
}
