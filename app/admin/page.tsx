import { redirect } from 'next/navigation';
import { ShieldCheck, Users, BookOpenCheck } from 'lucide-react';
import { auth } from '@/auth/auth.config';
import { getRoleLandingPath } from '@/auth/redirect';

const stats = [
  {
    label: 'Akses',
    value: 'Admin',
    icon: ShieldCheck,
  },
  {
    label: 'Pengguna',
    value: 'Kelola',
    icon: Users,
  },
  {
    label: 'Program',
    value: 'Pantau',
    icon: BookOpenCheck,
  },
];

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (session.user.role?.toUpperCase() !== 'ADMIN') {
    redirect(getRoleLandingPath(session.user.role));
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-6xl space-y-8">
        <div className="rounded-lg border bg-background p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Dashboard Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">Selamat datang, {session.user.name ?? session.user.email}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Halaman awal admin sudah siap. Kamu bisa lanjut isi modul manajemen dari sini.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-lg border bg-background p-5 shadow-sm">
              <item.icon className="size-5 text-[#2F99B2]" aria-hidden="true" />
              <p className="mt-4 text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
