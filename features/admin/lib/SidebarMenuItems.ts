import type { MenuItem } from '../types/Admin';
export const superAdminMenuItems: MenuItem[] = [
  {
    title: 'Beranda',
    icon: 'House',
    href: '/',
    exact: true,
  },
  {
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/admin',
    exact: true,
  },
  {
    title: 'Manajemen User',
    icon: 'Users',
    href: '/admin/users',
    submenu: [
      { title: 'Semua User', href: '/admin/users', icon: 'Users', exact: true },
      { title: 'Tambah User', href: '/admin/users/create', icon: 'UserPlus' },
      // { title: 'Instructor', href: '/super-admin/users?role=instructor', icon: 'GraduationCap' },
      // { title: 'Student', href: '/super-admin/users?role=student', icon: 'User' },
      // { title: 'User Nonaktif', href: '/admin/users?status=inactive', icon: 'UserX' },
    ],
  },
  {
    title: 'Role & Permission',
    icon: 'Shield',
    href: '/admin/access-control',
    exact: true,
  },
  //   {
  //     title: 'Kursus',
  //     icon: 'BookOpen',
  //     href: '/super-admin/courses',
  //     submenu: [
  //       { title: 'Semua Kursus', href: '/super-admin/courses', icon: 'BookOpen', exact: true },
  //       { title: 'Draft', href: '/super-admin/courses?status=draft', icon: 'FileText' },
  //       { title: 'Published', href: '/super-admin/courses?status=published', icon: 'CheckCircle' },
  //       { title: 'Archived', href: '/super-admin/courses?status=archived', icon: 'Archive' },
  //       { title: 'Kategori Kursus', href: '/super-admin/courses/categories', icon: 'Tags' },
  //     ],
  //   },
  //   {
  //     title: 'Materi Pembelajaran',
  //     icon: 'Library',
  //     href: '/super-admin/contents',
  //     submenu: [
  //       { title: 'Semua Materi', href: '/super-admin/contents', icon: 'Library', exact: true },
  //       { title: 'Video', href: '/super-admin/contents?type=video', icon: 'Video' },
  //       { title: 'Dokumen', href: '/super-admin/contents?type=document', icon: 'FileText' },
  //       { title: 'Quiz', href: '/super-admin/contents?type=quiz', icon: 'CircleHelp' },
  //       { title: 'Assignment', href: '/super-admin/contents?type=assignment', icon: 'ClipboardList' },
  //     ],
  //   },
  //   {
  //     title: 'Kelas',
  //     icon: 'School',
  //     href: '/super-admin/classes',
  //     submenu: [
  //       { title: 'Semua Kelas', href: '/super-admin/classes', icon: 'School', exact: true },
  //       { title: 'Aktif', href: '/super-admin/classes?status=active', icon: 'CheckCircle' },
  //       { title: 'Selesai', href: '/super-admin/classes?status=completed', icon: 'BadgeCheck' },
  //       { title: 'Terjadwal', href: '/super-admin/classes?status=scheduled', icon: 'CalendarClock' },
  //     ],
  //   },
  //   {
  //     title: 'Enrollment',
  //     icon: 'UserPlus',
  //     href: '/super-admin/enrollments',
  //     submenu: [
  //       { title: 'Semua Enrollment', href: '/super-admin/enrollments', icon: 'UserPlus', exact: true },
  //       { title: 'Aktif', href: '/super-admin/enrollments?status=active', icon: 'CheckCircle' },
  //       { title: 'Pending', href: '/super-admin/enrollments?status=pending', icon: 'Clock' },
  //       { title: 'Selesai', href: '/super-admin/enrollments?status=completed', icon: 'BadgeCheck' },
  //     ],
  //   },
  //   {
  //     title: 'Sertifikat',
  //     icon: 'Award',
  //     href: '/super-admin/certificates',
  //     submenu: [
  //       { title: 'Semua Sertifikat', href: '/super-admin/certificates', icon: 'Award', exact: true },
  //       { title: 'Template Sertifikat', href: '/super-admin/certificates/templates', icon: 'FileBadge' },
  //       { title: 'Terbitkan Sertifikat', href: '/super-admin/certificates/issue', icon: 'Send' },
  //       { title: 'Verifikasi Sertifikat', href: '/super-admin/certificates/verify', icon: 'ShieldCheck' },
  //     ],
  //   },
  //   {
  //     title: 'Assessment',
  //     icon: 'ClipboardCheck',
  //     href: '/super-admin/assessments',
  //     submenu: [
  //       { title: 'Quiz', href: '/super-admin/assessments/quizzes', icon: 'CircleHelp' },
  //       { title: 'Assignment', href: '/super-admin/assessments/assignments', icon: 'ClipboardList' },
  //       { title: 'Bank Soal', href: '/super-admin/assessments/question-bank', icon: 'Database' },
  //       { title: 'Penilaian', href: '/super-admin/assessments/grading', icon: 'ClipboardCheck' },
  //     ],
  //   },
  //   {
  //     title: 'Laporan',
  //     icon: 'BarChart3',
  //     href: '/super-admin/reports',
  //     submenu: [
  //       { title: 'Ringkasan', href: '/super-admin/reports', icon: 'TrendingUp', exact: true },
  //       { title: 'Progress Siswa', href: '/super-admin/reports/student-progress', icon: 'LineChart' },
  //       { title: 'Performa Kursus', href: '/super-admin/reports/course-performance', icon: 'BarChart3' },
  //       { title: 'Aktivitas Instructor', href: '/super-admin/reports/instructors', icon: 'GraduationCap' },
  //       { title: 'Ekspor Data', href: '/super-admin/reports/export', icon: 'Download' },
  //     ],
  //   },
  //   {
  //     title: 'Pengaturan LMS',
  //     icon: 'Settings',
  //     href: '/super-admin/settings',
  //     submenu: [
  //       { title: 'General', href: '/super-admin/settings', icon: 'Settings', exact: true },
  //       { title: 'Role & Permission', href: '/super-admin/settings/roles', icon: 'Shield' },
  //       { title: 'Learning Path', href: '/super-admin/settings/learning-paths', icon: 'Route' },
  //       { title: 'Notifikasi', href: '/super-admin/settings/notifications', icon: 'Bell' },
  //       { title: 'Integrasi', href: '/super-admin/settings/integrations', icon: 'Plug' },
  //     ],
  //   },
];
export const adminMenuItems: MenuItem[] = [
  {
    title: 'Beranda',
    icon: 'House',
    href: '/',
    exact: true,
  },
  {
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/admin',
    exact: true,
  },
  {
    title: 'Manajemen User',
    icon: 'Users',
    href: '/admin/users',
    submenu: [
      { title: 'Semua User', href: '/admin/users', icon: 'Users', exact: true },
      { title: 'Tambah User', href: '/admin/users/create', icon: 'UserPlus' },
    ],
  },
];
type DashboardRole = 'SUPER_ADMIN' | 'ADMIN' | 'MENTOR';

function isDashboardRole(role?: string | null): role is DashboardRole {
  return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'MENTOR';
}

export const getSidebarItemsByRole = (role?: string | null): MenuItem[] => {
  if (!isDashboardRole(role)) {
    return [];
  }

  switch (role) {
    case 'SUPER_ADMIN':
      return superAdminMenuItems;

    case 'ADMIN':
      return adminMenuItems;

    default:
      return [];
  }
};

export const getRoleLabel = (role?: string | null) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Admin';

    case 'ADMIN':
      return 'Admin';

    case 'MENTOR':
      return 'Mentor';

    default:
      return 'User';
  }
};
