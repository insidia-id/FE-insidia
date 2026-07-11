'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CoursesController } from '../controller/CoursesController';
import { COURSE_SCOPE_OPTIONS, getCoursesHref } from '../lib/course.helper';
import type { CourseScope } from '../types/course.types';
import { formatDate, getActiveMitraContext } from '@/features/admin/user/HelperUser';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { Search, Eye, Pencil, Trash2 } from 'lucide-react';

type CoursesPageProps = {
  mitraSlug: string | null;
  initialScope: CourseScope;
  canChangeScope: boolean;
  currentProfile: AuthProfileResponse;
};

export function CoursesPage({ mitraSlug, initialScope, canChangeScope, currentProfile }: CoursesPageProps) {
  const { activeMitraId } = getActiveMitraContext(currentProfile);
  const { scope, courses, isLoading, isError, error, onScopeChange } = CoursesController({
    initialScope,
    canChangeScope,
    mitraId: activeMitraId,
  });
  
  const isMitraView = scope === 'MITRA';
  const entityLabel = isMitraView ? 'Mapel' : 'Course';
  
  // Menyesuaikan jumlah kolom fallback (Aksi tetap terhitung 1 kolom)
  const emptyColumnCount = isMitraView ? 7 : 5;

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8">
      <section className="mx-auto w-full px-4 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground">{`Daftar ${entityLabel}`}</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {isMitraView
                ? 'Mapel mitra memakai entitas course scope MITRA yang terhubung ke kurikulum. Di sini kita bisa melihat data mapel sekaligus atribut course yang menyertainya.'
                : 'Kelola daftar course, pantau status publikasinya, lalu buka detail untuk mengatur modul dan media.'}
            </p>
          </div>

          <Button asChild variant="insidia">
            <Link href={getCoursesHref(mitraSlug, 'create')}>{isMitraView ? 'Tambah Mapel' : 'Tambah Course'}</Link>
          </Button>
        </div>

        <Card>
          {/* CardHeader dengan pembagian kolom SearchBar 60%, Sorting Status 20%, Sorting Tanggal 20% */}
          <CardHeader className="">
            <div className="flex items-center justify-between">
              {/* <div>
                <CardTitle>{`Semua ${entityLabel}`}</CardTitle>
                <CardDescription>{isLoading ? `Memuat data ${entityLabel.toLowerCase()}...` : `${courses.length} ${entityLabel.toLowerCase()} ditemukan`}</CardDescription>
              </div> */}
              
              {canChangeScope && (
                <Select value={scope} onValueChange={(value) => onScopeChange(value as CourseScope)}>
                  <SelectTrigger className="w-[140px] h-9 text-xs">
                    <SelectValue placeholder="Scope" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSE_SCOPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Grid Komposisi Filter & Pencarian */}
            <div className="grid grid-cols-10 gap-3  items-center w-full">
              {/* Search Bar - 60% (col-span-6) */}
              <div className="relative col-span-10 md:col-span-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder={`Cari nama ${entityLabel.toLowerCase()}...`} 
                  className="pl-9 h-10 w-full"
                />
              </div>

              {/* Sorting Status - 20% (col-span-2) */}
              <div className="col-span-5 py-2 md:col-span-2">
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Urut Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sorting Tanggal - 20% (col-span-2) */}
              <div className="col-span-5 md:col-span-2">
                <Select defaultValue="desc">
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Urut Tanggal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Terbaru</SelectItem>
                    <SelectItem value="asc">Terlama</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="">
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
                      {isMitraView && <TableHead>Status Akademik</TableHead>}
                      <TableHead>Konten</TableHead>
                      <TableHead>Dibuat</TableHead>
                      <TableHead className="text-right pr-6">Aksi</TableHead>
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
                          {isMitraView && (
                            <TableCell>
                              <Badge variant={course.academicStatus === 'ACTIVE' ? 'success' : 'outline'}>{course.academicStatus}</Badge>
                            </TableCell>
                          )}
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {course.modulesCount ?? 0} modul • {course._count?.media ?? 0} media
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(course.createdAt)}</TableCell>
                          <TableCell className="text-right pr-4">
                            <div className="flex justify-end gap-1.5">
                              {/* Button Detail -> Icon Mata */}
                              <Button asChild size="icon" variant="ghost" className="h-8 w-8 rounded-md bg-[#21C764] text-white hover:text-foreground hover:bg-muted" title="Detail">
                                <Link href={getCoursesHref(mitraSlug, course.id)}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              
                              {/* Button Edit -> Icon Pen */}
                              <Button asChild size="icon" variant="ghost" className="h-8 w-8 rounded-md bg-blue-600 text-white hover:text-foreground hover:bg-muted" title="Edit">
                                <Link href={getCoursesHref(mitraSlug, `${course.id}/edit`)}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>

                              {/* Button Hapus -> Icon Sampah */}
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 rounded-md bg-[#EC4944] text-white hover:text-foreground hover:bg-muted" 
                                title="Hapus"
                                onClick={() => {
                                  if(confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
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