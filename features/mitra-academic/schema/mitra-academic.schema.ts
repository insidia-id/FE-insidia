import { z } from 'zod';

const nullableString = z.preprocess((value) => (value === '' ? null : value), z.string().trim().min(1).nullable().optional());

export const academicStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);

export const academicYearFormSchema = z.object({
  name: z.string().trim().min(1, 'Nama tahun ajaran wajib diisi'),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
  status: academicStatusSchema,
});

export const semesterFormSchema = z.object({
  academicYearId: z.string().min(1, 'Tahun ajaran wajib dipilih'),
  name: z.string().trim().min(1, 'Nama semester wajib diisi'),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
  status: academicStatusSchema,
});

export const curriculumFormSchema = z.object({
  name: z.string().trim().min(1, 'Nama kurikulum wajib diisi'),
  code: nullableString,
  description: nullableString,
  status: academicStatusSchema,
});

export const subjectFormSchema = z.object({
  curriculumId: z.string().min(1, 'Kurikulum wajib dipilih'),
  name: z.string().trim().min(1, 'Nama mapel wajib diisi'),
  code: z.string().trim().min(1, 'Kode mapel wajib diisi'),
  description: nullableString,
  status: academicStatusSchema,
});

export const academicClassFormSchema = z.object({
  academicYearId: z.string().min(1, 'Tahun ajaran wajib dipilih'),
  semesterId: z.string().min(1, 'Semester wajib dipilih'),
  curriculumId: z.string().min(1, 'Kurikulum wajib dipilih'),
  name: z.string().trim().min(1, 'Nama kelas wajib diisi'),
  level: z.string().trim().min(1, 'Level kelas wajib diisi'),
  status: academicStatusSchema,
});

export const classGroupFormSchema = z.object({
  classId: z.string().min(1, 'Kelas wajib dipilih'),
  name: z.string().trim().min(1, 'Nama rombel wajib diisi'),
  waliKelasId: z.string().optional().or(z.literal('')),
  status: academicStatusSchema,
});

export const classGroupCourseFormSchema = z.object({
  classGroupId: z.string().min(1, 'Rombel wajib dipilih'),
  courseId: z.string().min(1, 'Mapel wajib dipilih'),
  teacherId: z.string().min(1, 'Guru wajib dipilih'),
  academicYearId: z.string().min(1, 'Tahun ajaran wajib dipilih'),
  semesterId: z.string().min(1, 'Semester wajib dipilih'),
  status: academicStatusSchema,
});

export const classGroupStudentFormSchema = z.object({
  classGroupId: z.string().min(1, 'Rombel wajib dipilih'),
  studentId: z.string().min(1, 'Murid wajib dipilih'),
  academicYearId: z.string().min(1, 'Tahun ajaran wajib dipilih'),
  semesterId: z.string().min(1, 'Semester wajib dipilih'),
  status: academicStatusSchema,
});

export type AcademicYearFormValues = z.infer<typeof academicYearFormSchema>;
export type SemesterFormValues = z.infer<typeof semesterFormSchema>;
export type CurriculumFormValues = z.infer<typeof curriculumFormSchema>;
export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
export type AcademicClassFormValues = z.infer<typeof academicClassFormSchema>;
export type ClassGroupFormValues = z.infer<typeof classGroupFormSchema>;
export type ClassGroupCourseFormValues = z.infer<typeof classGroupCourseFormSchema>;
export type ClassGroupStudentFormValues = z.infer<typeof classGroupStudentFormSchema>;
