import { redirect } from 'next/navigation';

type KelasRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function KelasRoutePage({ params }: KelasRoutePageProps) {
  const { slug } = await params;
  redirect(`/mitra/admin/${slug}/academic/rombel`);
}
