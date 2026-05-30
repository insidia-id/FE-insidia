'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/features/admin/user/HelperUser';
import { MitraAcademicPageController } from '../controller/MitraAcademicPageController';
import { AcademicCrudCard } from './AcademicCrudCard';
import {
  academicClassFormSchema,
  academicYearFormSchema,
  classGroupCourseFormSchema,
  classGroupFormSchema,
  classGroupStudentFormSchema,
  curriculumFormSchema,
  semesterFormSchema,
  subjectFormSchema,
  type AcademicClassFormValues,
  type AcademicYearFormValues,
  type ClassGroupCourseFormValues,
  type ClassGroupFormValues,
  type ClassGroupStudentFormValues,
  type CurriculumFormValues,
  type SemesterFormValues,
  type SubjectFormValues,
} from '../schema/mitra-academic.schema';
import type { AcademicStatus } from '../types/mitra-academic.types';

export function MitraAcademicPage({ mitraId, mitraName }: { mitraId: string; mitraName: string }) {
  const controller = MitraAcademicPageController(mitraId);

  if (controller.isLoading) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-10">
        <section className="mx-auto w-full max-w-6xl space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </section>
      </main>
    );
  }

  if (controller.error) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-10">
        <section className="mx-auto w-full max-w-6xl">
          <Card>
            <CardContent className="p-6">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{controller.error instanceof Error ? controller.error.message : 'Gagal memuat data akademik mitra.'}</div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Mitra Academic</p>
          <h1 className="text-3xl font-semibold text-foreground">Manajemen Akademik {mitraName}</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Kelola struktur akademik mitra dari tahun ajaran sampai relasi rombel dan mapel. Semua resource dipisah per card agar state form dan tampilan tidak bercampur dalam satu file besar.
          </p>
        </div>

        <div className="grid gap-6">
          <AcademicCrudCard
            title="Tahun Ajaran"
            description="Atur periode akademik utama yang akan dipakai semester dan kelas."
            items={controller.academicYears}
            schema={academicYearFormSchema}
            defaultValues={
              {
                name: '',
                startDate: '',
                endDate: '',
                status: 'ACTIVE',
              } satisfies AcademicYearFormValues
            }
            fields={[
              { name: 'name', label: 'Nama Tahun Ajaran', type: 'text', placeholder: '2026/2027' },
              { name: 'startDate', label: 'Tanggal Mulai', type: 'date' },
              { name: 'endDate', label: 'Tanggal Selesai', type: 'date' },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ],
              },
            ]}
            columns={[
              { header: 'Nama', render: (item) => item.name },
              { header: 'Periode', render: (item) => `${formatDate(item.startDate)} - ${formatDate(item.endDate)}` },
              { header: 'Status', render: (item) => <Badge variant={getAcademicStatusVariant(item.status)}>{item.status}</Badge> },
            ]}
            getItemId={(item) => item.id}
            getItemLabel={(item) => `Tahun ajaran "${item.name}"`}
            toFormValues={(item) => ({
              name: item?.name ?? '',
              startDate: item?.startDate?.slice(0, 10) ?? '',
              endDate: item?.endDate?.slice(0, 10) ?? '',
              status: item?.status ?? 'ACTIVE',
            })}
            mutations={controller.academicYearMutations}
          />

          <AcademicCrudCard
            title="Semester"
            description="Hubungkan semester ke tahun ajaran yang aktif."
            items={controller.semesters}
            schema={semesterFormSchema}
            defaultValues={
              {
                academicYearId: controller.academicYearOptions[0]?.value ?? '',
                name: '',
                startDate: '',
                endDate: '',
                status: 'ACTIVE',
              } satisfies SemesterFormValues
            }
            fields={[
              { name: 'academicYearId', label: 'Tahun Ajaran', type: 'select', options: controller.academicYearOptions },
              { name: 'name', label: 'Nama Semester', type: 'text', placeholder: 'Semester Ganjil' },
              { name: 'startDate', label: 'Tanggal Mulai', type: 'date' },
              { name: 'endDate', label: 'Tanggal Selesai', type: 'date' },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ],
              },
            ]}
            columns={[
              { header: 'Nama', render: (item) => item.name },
              { header: 'Tahun Ajaran', render: (item) => item.academicYear.name },
              { header: 'Periode', render: (item) => `${formatDate(item.startDate)} - ${formatDate(item.endDate)}` },
              { header: 'Status', render: (item) => <Badge variant={getAcademicStatusVariant(item.status)}>{item.status}</Badge> },
            ]}
            getItemId={(item) => item.id}
            getItemLabel={(item) => `Semester "${item.name}"`}
            toFormValues={(item) => ({
              academicYearId: item?.academicYearId ?? controller.academicYearOptions[0]?.value ?? '',
              name: item?.name ?? '',
              startDate: item?.startDate?.slice(0, 10) ?? '',
              endDate: item?.endDate?.slice(0, 10) ?? '',
              status: item?.status ?? 'ACTIVE',
            })}
            mutations={controller.semesterMutations}
          />

          <AcademicCrudCard
            title="Kurikulum"
            description="Data kurikulum akan dipakai saat membuat mapel dan kelas akademik."
            items={controller.curricula}
            schema={curriculumFormSchema}
            defaultValues={
              {
                name: '',
                code: null,
                description: null,
                status: 'ACTIVE',
              } satisfies CurriculumFormValues
            }
            fields={[
              { name: 'name', label: 'Nama Kurikulum', type: 'text' },
              { name: 'code', label: 'Kode', type: 'text', placeholder: 'MERDEKA' },
              { name: 'description', label: 'Deskripsi', type: 'textarea' },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ],
              },
            ]}
            columns={[
              { header: 'Nama', render: (item) => item.name },
              { header: 'Kode', render: (item) => item.code ?? '-' },
              { header: 'Status', render: (item) => <Badge variant={getAcademicStatusVariant(item.status)}>{item.status}</Badge> },
            ]}
            getItemId={(item) => item.id}
            getItemLabel={(item) => `Kurikulum "${item.name}"`}
            toFormValues={(item) => ({
              name: item?.name ?? '',
              code: item?.code ?? null,
              description: item?.description ?? null,
              status: item?.status ?? 'ACTIVE',
            })}
            mutations={controller.curriculumMutations}
          />

          <AcademicCrudCard
            title="Mapel"
            description="Mapel mitra memakai entitas course scope MITRA yang terhubung ke kurikulum."
            items={controller.subjects}
            schema={subjectFormSchema}
            defaultValues={
              {
                curriculumId: controller.curriculumOptions[0]?.value ?? '',
                name: '',
                code: '',
                description: null,
                status: 'ACTIVE',
              } satisfies SubjectFormValues
            }
            fields={[
              { name: 'curriculumId', label: 'Kurikulum', type: 'select', options: controller.curriculumOptions },
              { name: 'name', label: 'Nama Mapel', type: 'text' },
              { name: 'code', label: 'Kode Mapel', type: 'text' },
              { name: 'description', label: 'Deskripsi', type: 'textarea' },
              {
                name: 'status',
                label: 'Status Akademik',
                type: 'select',
                options: [
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ],
              },
            ]}
            columns={[
              { header: 'Mapel', render: (item) => `${item.name}${item.code ? ` (${item.code})` : ''}` },
              { header: 'Kurikulum', render: (item) => item.curriculum?.name ?? '-' },
              { header: 'Status', render: (item) => <Badge variant={getAcademicStatusVariant(item.status)}>{item.status}</Badge> },
            ]}
            getItemId={(item) => item.id}
            getItemLabel={(item) => `Mapel "${item.name}"`}
            toFormValues={(item) => ({
              curriculumId: item?.curriculumId ?? controller.curriculumOptions[0]?.value ?? '',
              name: item?.name ?? '',
              code: item?.code ?? '',
              description: item?.description ?? null,
              status: item?.status ?? 'ACTIVE',
            })}
            mutations={controller.subjectMutations}
          />

          <AcademicCrudCard
            title="Kelas Angkatan"
            description="kelas Angkatan atau kelas akademik, sebagai pengelompokan utama siswa selama periode tertentu. Kelas ini yang akan dipakai untuk membuat rombel."
            items={controller.academicClasses}
            schema={academicClassFormSchema}
            defaultValues={
              {
                academicYearId: controller.academicYearOptions[0]?.value ?? '',
                semesterId: controller.semesterOptions[0]?.value ?? '',
                curriculumId: controller.curriculumOptions[0]?.value ?? '',
                name: '',
                level: '',
                status: 'ACTIVE',
              } satisfies AcademicClassFormValues
            }
            fields={[
              { name: 'academicYearId', label: 'Tahun Ajaran', type: 'select', options: controller.academicYearOptions },
              { name: 'semesterId', label: 'Semester', type: 'select', options: controller.semesterOptions },
              { name: 'curriculumId', label: 'Kurikulum', type: 'select', options: controller.curriculumOptions },
              { name: 'name', label: 'Angkatan', type: 'text' },
              { name: 'level', label: 'Level', type: 'text', placeholder: 'Kelas 10' },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ],
              },
            ]}
            columns={[
              { header: 'Angakatan', render: (item) => `${item.name} • ${item.level}` },
              { header: 'Semester', render: (item) => item.semester.name },
              { header: 'Kurikulum', render: (item) => item.curriculum.name },
              { header: 'Status', render: (item) => <Badge variant={getAcademicStatusVariant(item.status)}>{item.status}</Badge> },
            ]}
            getItemId={(item) => item.id}
            getItemLabel={(item) => `Kelas "${item.name}"`}
            toFormValues={(item) => ({
              academicYearId: item?.academicYearId ?? controller.academicYearOptions[0]?.value ?? '',
              semesterId: item?.semesterId ?? controller.semesterOptions[0]?.value ?? '',
              curriculumId: item?.curriculumId ?? controller.curriculumOptions[0]?.value ?? '',
              name: item?.name ?? '',
              level: item?.level ?? '',
              status: item?.status ?? 'ACTIVE',
            })}
            mutations={controller.academicClassMutations}
          />

          <AcademicCrudCard
            title="Rombel"
            description="Rombel mengelompokkan siswa di dalam kelas akademik dan dapat memiliki wali kelas."
            items={controller.classGroups}
            schema={classGroupFormSchema}
            defaultValues={
              {
                classId: controller.academicClassOptions[0]?.value ?? '',
                name: '',
                waliKelasId: 'NONE',
                status: 'ACTIVE',
              } satisfies ClassGroupFormValues
            }
            fields={[
              { name: 'classId', label: 'Kelas Akademik', type: 'select', options: controller.academicClassOptions },
              { name: 'name', label: 'Nama Rombel', type: 'text' },
              { name: 'waliKelasId', label: 'Wali Kelas', type: 'select', options: [{ label: 'Tanpa wali kelas', value: 'NONE' }, ...controller.teacherOptions] },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ],
              },
            ]}
            columns={[
              { header: 'Rombel', render: (item) => item.name },
              { header: 'Kelas', render: (item) => item.academicClass.name },
              { header: 'Wali Kelas', render: (item) => item.waliKelas?.name ?? item.waliKelas?.email ?? '-' },
              { header: 'Status', render: (item) => <Badge variant={getAcademicStatusVariant(item.status)}>{item.status}</Badge> },
            ]}
            getItemId={(item) => item.id}
            getItemLabel={(item) => `Rombel "${item.name}"`}
            toFormValues={(item) => ({
              classId: item?.classId ?? controller.academicClassOptions[0]?.value ?? '',
              name: item?.name ?? '',
              waliKelasId: item?.waliKelasId ?? 'NONE',
              status: item?.status ?? 'ACTIVE',
            })}
            mutations={controller.classGroupMutations}
          />

          <AcademicCrudCard
            title="Rombel Mapel"
            description="Relasi antara rombel, mapel, guru, tahun ajaran, dan semester."
            items={controller.classGroupCourses}
            schema={classGroupCourseFormSchema}
            defaultValues={
              {
                classGroupId: controller.classGroupOptions[0]?.value ?? '',
                courseId: controller.subjectOptions[0]?.value ?? '',
                teacherId: controller.teacherOptions[0]?.value ?? '',
                academicYearId: controller.academicYearOptions[0]?.value ?? '',
                semesterId: controller.semesterOptions[0]?.value ?? '',
                status: 'ACTIVE',
              } satisfies ClassGroupCourseFormValues
            }
            fields={[
              { name: 'classGroupId', label: 'Rombel', type: 'select', options: controller.classGroupOptions },
              { name: 'courseId', label: 'Mapel', type: 'select', options: controller.subjectOptions },
              { name: 'teacherId', label: 'Guru', type: 'select', options: controller.teacherOptions },
              { name: 'academicYearId', label: 'Tahun Ajaran', type: 'select', options: controller.academicYearOptions },
              { name: 'semesterId', label: 'Semester', type: 'select', options: controller.semesterOptions },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ],
              },
            ]}
            columns={[
              { header: 'Rombel', render: (item) => item.classGroup.name },
              { header: 'Mapel', render: (item) => item.subject.name },
              { header: 'Guru', render: (item) => item.teacher.name ?? item.teacher.email },
              { header: 'Semester', render: (item) => `${item.academicYear.name} • ${item.semester.name}` },
              { header: 'Status', render: (item) => <Badge variant={getAcademicStatusVariant(item.status)}>{item.status}</Badge> },
            ]}
            getItemId={(item) => item.id}
            getItemLabel={(item) => `Relasi rombel-mapel "${item.classGroup.name} - ${item.subject.name}"`}
            toFormValues={(item) => ({
              classGroupId: item?.classGroupId ?? controller.classGroupOptions[0]?.value ?? '',
              courseId: item?.subject.id ?? controller.subjectOptions[0]?.value ?? '',
              teacherId: item?.teacherId ?? controller.teacherOptions[0]?.value ?? '',
              academicYearId: item?.academicYearId ?? controller.academicYearOptions[0]?.value ?? '',
              semesterId: item?.semesterId ?? controller.semesterOptions[0]?.value ?? '',
              status: item?.status ?? 'ACTIVE',
            })}
            mutations={controller.classGroupCourseMutations}
          />

          <AcademicCrudCard
            title="Rombel Murid"
            description="Relasi antara murid, rombel, tahun ajaran, dan semester aktif."
            items={controller.classGroupStudents}
            schema={classGroupStudentFormSchema}
            defaultValues={
              {
                classGroupId: controller.classGroupOptions[0]?.value ?? '',
                studentId: controller.studentOptions[0]?.value ?? '',
                academicYearId: controller.academicYearOptions[0]?.value ?? '',
                semesterId: controller.semesterOptions[0]?.value ?? '',
                status: 'ACTIVE',
              } satisfies ClassGroupStudentFormValues
            }
            fields={[
              { name: 'classGroupId', label: 'Rombel', type: 'select', options: controller.classGroupOptions },
              { name: 'studentId', label: 'Murid', type: 'select', options: controller.studentOptions },
              { name: 'academicYearId', label: 'Tahun Ajaran', type: 'select', options: controller.academicYearOptions },
              { name: 'semesterId', label: 'Semester', type: 'select', options: controller.semesterOptions },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ],
              },
            ]}
            columns={[
              { header: 'Rombel', render: (item) => item.classGroup.name },
              { header: 'Murid', render: (item) => item.student.name ?? item.student.email },
              { header: 'Kelas', render: (item) => item.classGroup.academicClass.name },
              { header: 'Semester', render: (item) => `${item.academicYear.name} â€¢ ${item.semester.name}` },
              { header: 'Status', render: (item) => <Badge variant={getAcademicStatusVariant(item.status)}>{item.status}</Badge> },
            ]}
            getItemId={(item) => item.id}
            getItemLabel={(item) => `Relasi rombel-murid "${item.classGroup.name} - ${item.student.name ?? item.student.email}"`}
            toFormValues={(item) => ({
              classGroupId: item?.classGroupId ?? controller.classGroupOptions[0]?.value ?? '',
              studentId: item?.studentId ?? controller.studentOptions[0]?.value ?? '',
              academicYearId: item?.academicYearId ?? controller.academicYearOptions[0]?.value ?? '',
              semesterId: item?.semesterId ?? controller.semesterOptions[0]?.value ?? '',
              status: item?.status ?? 'ACTIVE',
            })}
            mutations={controller.classGroupStudentMutations}
          />
        </div>
      </section>
    </main>
  );
}

function getAcademicStatusVariant(status: AcademicStatus): 'success' | 'outline' {
  return status === 'ACTIVE' ? 'success' : 'outline';
}
