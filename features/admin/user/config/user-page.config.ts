import type { RoleUser, UserScope } from '../types/user.types';

export type UserTableColumnId = 'name' | 'role' | 'status' | 'createdAt' | 'actions' | 'nip' | 'subject' | 'nis' | 'kelas' | 'jurusan' | 'pekerjaan' | 'position' | 'division';

export type UserManagementPageKey = 'all' | 'academic' | 'teacher' | 'student' | 'guardian';

export type UserManagementPageConfig = {
  key: UserManagementPageKey;
  title: string;
  description: string;
  roleCode?: RoleUser;
  scope?: UserScope;
  allowRoleFilter: boolean;
  allowScopeFilter: boolean;
  columns: UserTableColumnId[];
  createLabel: string;
  bulkUploadLabel: string;
  emptyTitle: string;
  emptyDescription: string;
};

export const USER_ROLE_PAGE_CONFIG: Record<UserManagementPageKey, UserManagementPageConfig> = {
  all: {
    key: 'all',
    title: 'Semua User',
    description: 'Pantau seluruh akun user, cari data yang dibutuhkan, lalu buka detail user untuk melihat informasi lebih lengkap.',
    allowRoleFilter: true,
    allowScopeFilter: true,
    columns: ['name', 'role', 'status', 'createdAt', 'actions'],
    createLabel: 'Tambah User',
    bulkUploadLabel: 'Bulk Upload User',
    emptyTitle: 'Belum ada user',
    emptyDescription: 'Belum ada user yang cocok dengan filter saat ini.',
  },
  academic: {
    key: 'academic',
    title: 'Akademik',
    description: 'Kelola akun user akademik yang terhubung dengan mitra dan pantau statusnya dari satu halaman khusus.',
    roleCode: 'AKADEMIK',
    scope: 'MITRA',
    allowRoleFilter: false,
    allowScopeFilter: false,
    columns: ['name', 'position', 'division', 'status', 'createdAt', 'actions'],
    createLabel: 'Tambah Akademik',
    bulkUploadLabel: 'Bulk Upload Akademik',
    emptyTitle: 'Belum ada user akademik',
    emptyDescription: 'Belum ada user akademik yang ditemukan.',
  },
  teacher: {
    key: 'teacher',
    title: 'Guru',
    description: 'Kelola akun guru, cek status user, dan buka detail akun guru dari daftar yang terfokus.',
    roleCode: 'GURU',
    scope: 'MITRA',
    allowRoleFilter: false,
    allowScopeFilter: false,
    columns: ['name', 'nip', 'subject', 'status', 'createdAt', 'actions'],
    createLabel: 'Tambah Guru',
    bulkUploadLabel: 'Bulk Upload Guru',
    emptyTitle: 'Belum ada user guru',
    emptyDescription: 'Belum ada user guru yang ditemukan.',
  },
  student: {
    key: 'student',
    title: 'Murid',
    description: 'Kelola akun murid dan cek data user yang sudah terdaftar untuk kebutuhan operasional mitra.',
    roleCode: 'MURID',
    scope: 'MITRA',
    allowRoleFilter: false,
    allowScopeFilter: false,
    columns: ['name', 'nis', 'kelas', 'jurusan', 'status', 'createdAt', 'actions'],
    createLabel: 'Tambah Murid',
    bulkUploadLabel: 'Bulk Upload Murid',
    emptyTitle: 'Belum ada user murid',
    emptyDescription: 'Belum ada user murid yang ditemukan.',
  },
  guardian: {
    key: 'guardian',
    title: 'Wali Murid',
    description: 'Lihat dan kelola akun wali murid tanpa perlu memfilter ulang dari daftar semua user.',
    roleCode: 'WALI_MURID',
    scope: 'MITRA',
    allowRoleFilter: false,
    allowScopeFilter: false,
    columns: ['name', 'pekerjaan', 'status', 'createdAt', 'actions'],
    createLabel: 'Tambah Wali Murid',
    bulkUploadLabel: 'Bulk Upload Wali Murid',
    emptyTitle: 'Belum ada user wali murid',
    emptyDescription: 'Belum ada user wali murid yang ditemukan.',
  },
};
