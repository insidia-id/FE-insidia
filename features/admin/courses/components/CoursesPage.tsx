'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CoursesController } from '../controller/CoursesController';
import { COURSE_SCOPE_OPTIONS, COURSE_STATUS_FILTER_OPTIONS, formatCourseScope, formatCourseStatus, getCourseStatusVariant, getCoursesHref } from '../lib/course.helper';
import type { CourseScope } from '../types/course.types';
import { formatDate } from '@/features/admin/user/HelperUser';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';

type CoursesPageProps = {
  mitraSlug: string | null;
  initialScope: CourseScope;
  canChangeScope: boolean;
  currentProfile: AuthProfileResponse;
};

export function CoursesPage({ mitraSlug, initialScope, canChangeScope, currentProfile }: CoursesPageProps) {
  const { scope, statusFilter, courses, isLoading, isError, error, onScopeChange, onStatusFilterChange } = CoursesController({
    initialScope,
    canChangeScope,
    mitraId: currentProfile.mitraRoles?.mitraId,
  });
  const isMitraView = scope === 'MITRA';
  const entityLabel = isMitraView ? 'Mapel Mitra' : 'Course';
  const emptyColumnCount = isMitraView ? 9 : 7;

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">{isMitraView ? 'Manajemen Mapel Mitra' : 'Manajemen Course'}</p>
            <h1 className="text-3xl font-semibold text-foreground">{`Daftar ${entityLabel}`}</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{isMitraView ? 'Mapel mitra memakai entitas course scope MITRA yang terhubung ke kurikulum. Di sini kita bisa melihat data mapel sekaligus atribut course yang menyertainya.' : 'Kelola daftar course, pantau status publikasinya, lalu buka detail untuk mengatur modul dan media.'}</p>
          </div>

          <Button asChild variant="insidia">
            <Link href={getCoursesHref(mitraSlug, 'create')}>{isMitraView ? 'Tambah Mapel' : 'Tambah Course'}</Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle>{`Semua ${entityLabel}`}</CardTitle>
              <CardDescription>{isLoading ? `Memuat data ${entityLabel.toLowerCase()}...` : `${courses.length} ${entityLabel.toLowerCase()} ditemukan`}</CardDescription>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {canChangeScope && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Scope</p>
                  <Select value={scope} onValueChange={(value) => onScopeChange(value as CourseScope)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Pilih scope" />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSE_SCOPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as typeof statusFilter)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSE_STATUS_FILTER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Gagal memuat data course.'}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isMitraView ? 'Mapel' : 'Course'}</TableHead>
                      {isMitraView && <TableHead>Kurikulum</TableHead>}
                      <TableHead>Scope</TableHead>
                      <TableHead>Status</TableHead>
                      {isMitraView && <TableHead>Status Akademik</TableHead>}
                      <TableHead>Harga</TableHead>
                      <TableHead>Konten</TableHead>
                      <TableHead>Dibuat</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={emptyColumnCount} className="py-8 text-center text-sm text-muted-foreground">
                          {`Belum ada ${entityLabel.toLowerCase()} untuk filter yang dipilih.`}
                        </TableCell>
                      </TableRow>
                    ) : (
                      courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{course.title}</p>
                              <p className="text-xs text-muted-foreground">{course.code ? `${course.code} • ${course.slug}` : course.slug}</p>
                            </div>
                          </TableCell>
                          {isMitraView && <TableCell>{course.curriculum?.name ?? '-'}</TableCell>}
                          <TableCell>{formatCourseScope(course.scope)}</TableCell>
                          <TableCell>
                            <Badge variant={getCourseStatusVariant(course.status)}>{formatCourseStatus(course.status)}</Badge>
                          </TableCell>
                          {isMitraView && (
                            <TableCell>
                              <Badge variant={course.academicStatus === 'ACTIVE' ? 'success' : 'outline'}>{course.academicStatus}</Badge>
                            </TableCell>
                          )}
                          <TableCell>{course.isFree ? 'Gratis' : `Rp${course.salePrice ?? course.price}`}</TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {course._count.modules} modul • {course._count.media} media
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(course.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button asChild size="sm" variant="outline">
                                <Link href={getCoursesHref(mitraSlug, course.id)}>Detail</Link>
                              </Button>
                              <Button asChild size="sm" variant="insidia">
                                <Link href={getCoursesHref(mitraSlug, `${course.id}/edit`)}>Edit</Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
