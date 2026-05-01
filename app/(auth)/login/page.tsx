import { Suspense } from 'react';
import { getLoginErrorMessage } from '@/features/auth/error/login-error';
import { getSafeCallbackPath } from '@/auth/redirect';
import { CardLogin } from '@/features/auth/components/CardLogin';
import CardSectionLogin from '@/features/auth/components/CardSectionLogin';

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackParam = Array.isArray(params.callbackUrl) ? params.callbackUrl[0] : params.callbackUrl;
  const errorParam = Array.isArray(params.error) ? params.error[0] : params.error;
  const callbackUrl = getSafeCallbackPath(callbackParam);
  const isGoogleLoginEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <main className="w-full px-0 py-6 md:px-4 md:py-12">
      <section className="mx-auto flex w-full max-w-6xl items-center justify-center">
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <CardSectionLogin />

          <div className="flex w-full justify-center">
            <Suspense fallback={<div className="h-64 w-full max-w-md rounded-lg border bg-background" />}>
              <CardLogin callbackUrl={callbackUrl} errorMessage={getLoginErrorMessage(errorParam ?? null)} isGoogleLoginEnabled={isGoogleLoginEnabled} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
