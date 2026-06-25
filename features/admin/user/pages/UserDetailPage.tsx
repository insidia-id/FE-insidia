'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getStatusVariant, formatStatus, getUsersHref } from '../HelperUser';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserDeleteDialog } from '../components/UserDeleteDialog';
import { UserDetailController } from '../hooks/UserDetailController';
import type { UserScope } from '../types/user.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { getActiveMitraContext } from '../HelperUser';
import { CardInfoSection, CardInfoUser, MitraRoleCard, userInfo, userSections } from '../components/CardDetailUser';

type UserDetailPageProps = {
  userId: string;
  scope?: UserScope;
  currentUserProfile: AuthProfileResponse;
};

export function UserDetailPage({ userId, scope = 'INSIDIA', currentUserProfile }: UserDetailPageProps) {
  const router = useRouter();
  const { activeMitraSlug } = getActiveMitraContext(currentUserProfile);
  const { user, isLoading, isError, error, isDeleteOpen, socialLinks, mitraRoles, onDeleteDialogChange } = UserDetailController(userId, scope);
  return (
    <>
      <main className="min-h-screen bg-muted/30 px-4 py-10">
        <section className="mx-auto w-full max-w-4xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Manajemen User</p>
              <h1 className="text-3xl font-semibold text-foreground">Detail User</h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Lihat data lengkap user berdasarkan akun yang sudah dipilih dari daftar user.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href={getUsersHref(activeMitraSlug, `users?scope=${scope}`)} className="flex items-center gap-2">
                  <ArrowLeft className="size-4" />
                  Kembali ke daftar
                </Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Informasi User</CardTitle>
                  <CardDescription>Ringkasan identitas akun, profil, verifikasi, dan data audit user.</CardDescription>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="size-4" />
                      <span className="sr-only">Buka menu aksi</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href={getUsersHref(activeMitraSlug, `users/${userId}/edit?scope=${scope}`)} className="flex items-center gap-2">
                        <Pencil className="size-4" />
                        Edit User
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        onDeleteDialogChange(true);
                      }}
                    >
                      <Trash2 className="size-4" />
                      Hapus User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : isError ? (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Gagal memuat detail user.'}</div>
              ) : user ? (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">User ID</p>
                      <p className="font-mono text-sm text-foreground">{user.id}</p>
                      <h2 className="text-2xl font-semibold text-foreground">{user.name || 'User'}</h2>
                      <p className="text-sm text-muted-foreground">{user.bio || 'Belum ada bio profil'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="h-7 px-3 text-sm" variant={getStatusVariant(user.status)}>
                        {formatStatus(user.status)}
                      </Badge>
                      <Badge className="h-7 px-3 text-sm" variant={user.emailVerified ? 'default' : 'outline'}>
                        Email {user.emailVerified ? 'Terverifikasi' : 'Belum Verifikasi'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {userInfo(user).map((card) => (
                      <CardInfoUser key={card.label} icon={card.icon} label={card.label} value={card.value} subtitle={card.subtitle} />
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {userSections(user).map((section) => (
                      <CardInfoSection key={section.title} title={section.title} items={section.items} />
                    ))}
                  </div>

                  <div className="rounded-xl border p-5">
                    <p className="mb-3 font-medium text-foreground">Social Links</p>
                    {socialLinks.length ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {socialLinks.map((item) => (
                          <a key={item.key} className="flex items-center gap-3 rounded-lg border p-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground" href={item.href} rel="noreferrer" target="_blank">
                            <ExternalLink className="size-4" />
                            <span className="font-medium">{item.label}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Belum ada social link.</p>
                    )}
                  </div>

                  <div className="rounded-xl border p-5">
                    <p className="mb-3 font-medium text-foreground">Penugasan Mitra</p>
                    {mitraRoles.length ? (
                      <div className="space-y-3">
                        {mitraRoles.map((mitraRole) => (
                          <MitraRoleCard key={mitraRole.mitraId} mitraRole={mitraRole} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">User ini belum memiliki penugasan mitra.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border p-4 text-sm text-muted-foreground">Data user tidak ditemukan.</div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <UserDeleteDialog
        userId={userId}
        scope={scope}
        open={isDeleteOpen}
        onOpenChange={onDeleteDialogChange}
        onSuccess={() => {
          router.push(getUsersHref(activeMitraSlug, 'users'));
        }}
      />
    </>
  );
}
