import { redirect } from 'next/navigation';
import { auth } from '@/auth/auth.config';
import { getRoleLandingPath } from '@/auth/redirect';

export default async function AuthRedirectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }
  redirect(getRoleLandingPath(session.user.role));
}
