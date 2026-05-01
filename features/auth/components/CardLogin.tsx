import { LoginForm } from '../form/CredentialsLoginForm';
import { Card, CardContent } from '@/components/ui/card';
import { GoogleSignInButton } from './GoogleSignInButton';

type CardLoginProps = {
  callbackUrl?: string;
  errorMessage?: string | null;
  isGoogleLoginEnabled?: boolean;
};

export function CardLogin({ callbackUrl, errorMessage, isGoogleLoginEnabled }: CardLoginProps) {
  return (
    <Card className="h-full rounded-3xl border-white/55 bg-white/94 shadow-[0_30px_80px_-45px_rgba(8,42,66,0.65)] backdrop-blur-xl">
      <CardContent className="flex h-full flex-col justify-center p-6 md:p-8">
        <div className="mb-7 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Selamat datang kembali</p>
          <h2 className="mt-2 text-2xl font-bold text-[#303760]">Masuk ke akun kamu</h2>
          <p className="mt-2 text-sm text-muted-foreground">Siap lanjut? Masuk sekarang dan lanjutkan progress belajarmu.</p>
        </div>

        {errorMessage && <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{errorMessage}</p>}

        <LoginForm />
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">atau</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <GoogleSignInButton callbackUrl={callbackUrl} disabled={!isGoogleLoginEnabled} />

        <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">Dengan masuk, kamu menyetujui syarat &amp; ketentuan serta kebijakan privasi Insidia.</p>
      </CardContent>
    </Card>
  );
}
