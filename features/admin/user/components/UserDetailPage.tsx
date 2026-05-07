'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, ExternalLink, Link as LinkIcon, Mail, MoreVertical, Pencil, Phone, ShieldCheck, Trash2, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetUserById } from '../hooks/useUser';
import { formatDateTime, formatRole, getStatusVariant, formatStatus, formatBooleanLabel } from './HelperUser';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserDeleteDialog } from './UserDeleteDialog';

type UserDetailPageProps = {
  userId: string;
};

export function UserDetailPage({ userId }: UserDetailPageProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data: user, isLoading, isError, error } = useGetUserById(userId);
  const socialLinks = user?.socialLinks
    ? [
        { key: 'instagram', label: 'Instagram', href: user.socialLinks.instagram },
        { key: 'linkedin', label: 'LinkedIn', href: user.socialLinks.linkedin },
        { key: 'github', label: 'GitHub', href: user.socialLinks.github },
      ].filter((item) => Boolean(item.href))
    : [];

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
                <Link href="/admin/users">
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
                      <Link href={`/admin/users/${userId}/edit`} className="flex items-center gap-2">
                        <Pencil className="size-4" />
                        Edit User
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setIsDeleteOpen(true);
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
                      <h2 className="text-2xl font-semibold text-foreground">{user.name || 'Tanpa nama'}</h2>
                      <p className="text-sm text-muted-foreground">{user.headline || 'Belum ada headline profil'}</p>
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
                    <div className="rounded-xl border p-5">
                      <div className="mb-3 flex items-center gap-2 text-foreground">
                        <Mail className="size-4" />
                        <p className="font-medium">Email</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="mt-2 text-xs text-muted-foreground">Normalized: {user.normalizedEmail}</p>
                    </div>

                    <div className="rounded-xl border p-5">
                      <div className="mb-3 flex items-center gap-2 text-foreground">
                        <Phone className="size-4" />
                        <p className="font-medium">Telepon</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.phone || '-'}</p>
                      <p className="mt-2 text-xs text-muted-foreground">Verified at: {formatDateTime(user.phoneVerifiedAt)}</p>
                    </div>

                    <div className="rounded-xl border p-5">
                      <div className="mb-3 flex items-center gap-2 text-foreground">
                        <ShieldCheck className="size-4" />
                        <p className="font-medium">Role</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatRole(user.role)}</p>
                    </div>

                    <div className="rounded-xl border p-5">
                      <div className="mb-3 flex items-center gap-2 text-foreground">
                        <UserRound className="size-4" />
                        <p className="font-medium">Dibuat Pada</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDateTime(user.createdAt)}</p>
                      <p className="mt-2 text-xs text-muted-foreground">Waktu lengkap: {formatDateTime(user.createdAt, { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border p-5">
                      <p className="mb-3 font-medium text-foreground">Profil</p>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div>
                          <p className="font-medium text-foreground">Bio</p>
                          <p>{user.bio || '-'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Website</p>
                          {user.websiteUrl ? (
                            <a className="inline-flex items-center gap-2 text-primary hover:underline" href={user.websiteUrl} rel="noreferrer" target="_blank">
                              <LinkIcon className="size-4" />
                              {user.websiteUrl}
                            </a>
                          ) : (
                            <p>-</p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Image URL</p>
                          <p className="break-all">{user.image || '-'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border p-5">
                      <p className="mb-3 font-medium text-foreground">Audit</p>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div>
                          <p className="font-medium text-foreground">Email Verified</p>
                          <p>{formatBooleanLabel(user.emailVerified)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Created By</p>
                          <p className="break-all">{user.createdById || '-'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Deleted At</p>
                          <p>{formatDateTime(user.deletedAt)}</p>
                        </div>
                      </div>
                    </div>
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
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSuccess={() => {
          router.push('/admin/users');
        }}
      />
    </>
  );
}
