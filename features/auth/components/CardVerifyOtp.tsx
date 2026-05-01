import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { VerifyOtpForm } from '../form/VerifyOtpForm';

type CardVerifyOtpProps = {
  token: string;
  callbackUrl?: string;
};

export function CardVerifyOtp({ callbackUrl, token }: CardVerifyOtpProps) {
  const loginHref = callbackUrl
    ? {
        pathname: '/login',
        query: { callbackUrl },
      }
    : '/login';

  return (
    <Card className="w-full max-w-md rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle>Verifikasi OTP</CardTitle>
        <CardDescription>Masukkan kode OTP yang dikirim ke email kamu.</CardDescription>
      </CardHeader>

      <CardContent>
        <VerifyOtpForm token={token} callbackUrl={callbackUrl} />
      </CardContent>

      <CardFooter>
        <Button asChild variant="ghost" size="sm" className="px-0">
          <Link href={loginHref}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Ganti email
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
