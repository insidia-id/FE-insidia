import { redirect } from 'next/navigation';

type AngkatanRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AngkatanRoutePage({ params }: AngkatanRoutePageProps) {
  const { slug } = await params;
  redirect(`/mitra/admin/${slug}/academic/kelas-angkatan`);
}
