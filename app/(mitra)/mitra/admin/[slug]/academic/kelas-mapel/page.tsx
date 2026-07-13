import { redirect } from 'next/navigation';

type KelasMapelRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function KelasMapelRoutePage({ params }: KelasMapelRoutePageProps) {
  const { slug } = await params;
  redirect(`/mitra/admin/${slug}/academic/rombel-mapel`);
}
