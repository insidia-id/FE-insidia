import { redirect } from 'next/navigation';
import { CardVerifyOtp } from '@/features/auth/components/CardVerifyOtp';

type VerifyOtpPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    token?: string | string[];
  }>;
};

export default async function VerifyOtpPage({ searchParams }: VerifyOtpPageProps) {
  const params = await searchParams;

  const callbackUrl = Array.isArray(params.callbackUrl) ? params.callbackUrl[0] : params.callbackUrl;

  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  if (!token) {
    redirect('/login');
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full px-4 py-12">
      <section className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl items-center justify-center">
        <CardVerifyOtp token={token} callbackUrl={callbackUrl} />
      </section>
    </main>
  );
}
