import { redirect } from 'next/navigation';

type KelasSiswaRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function KelasSiswaRoutePage({ params }: KelasSiswaRoutePageProps) {
  const { slug } = await params;
  redirect(`/mitra/admin/${slug}/academic/rombel-murid`);
}
