import { MitraRole } from '@/features/admin/user/types/user.types';
import { BulkTemplateConfig, ExcelTemplateRow } from '../types/bulk.types';

const COMMON_BULK_RULES = ['Format file yang didukung: CSV, XLSX, dan XLS.', 'Template tersedia dalam format CSV dan Excel.'];

function createCsv(rows: string[]) {
  return rows.join('\n');
}

export function getBulkUserTemplate(scope: string, isAkademikMitraContext: boolean, roleCode?: MitraRole): BulkTemplateConfig {
  const roleTemplates: Record<
    MitraRole,
    {
      profileFields: string[];
      profileExample: Record<string, string>;
    }
  > = {
    MURID: {
      profileFields: ['nis', 'kelas', 'jurusan'],
      profileExample: {
        nis: '2024001',
        kelas: '12 IPA 1',
        jurusan: 'IPA',
      },
    },

    GURU: {
      profileFields: ['nip', 'subject'],
      profileExample: {
        nip: '198001012000011001',
        subject: 'Matematika',
      },
    },

    AKADEMIK: {
      profileFields: ['position', 'division', 'note'],
      profileExample: {
        position: 'Kepala Sekolah',
        division: 'Administrasi',
        note: 'Catatan opsional',
      },
    },

    WALI_MURID: {
      profileFields: ['pekerjaan', 'alamat'],
      profileExample: {
        pekerjaan: 'Pegawai Swasta',
        alamat: 'Jl. Contoh No. 123',
      },
    },
  };

  if (scope === 'MITRA') {
    if (!roleCode) {
      throw new Error('roleCode wajib diisi untuk scope MITRA');
    }

    const roleTemplate = roleTemplates[roleCode];

    if (isAkademikMitraContext) {
      const baseRow = {
        email: `${roleCode.toLowerCase()}1@example.com`,
        name: `${roleCode} Satu`,
        phone: '081234567890',
        mitraRoles: roleCode,
        status: 'ACTIVE',
      };

      const templateRow: ExcelTemplateRow = {
        ...baseRow,
        ...roleTemplate.profileExample,
      };

      const headers = ['email', 'name', 'phone', 'mitraRoles', 'status', ...roleTemplate.profileFields];

      const values = headers.map((header) => String(templateRow[header] ?? ''));

      return {
        template: {
          fileName: `template-bulk-user-${roleCode.toLowerCase()}.csv`,
          content: createCsv([headers.join(','), values.join(',')]),
        },

        templateRows: [templateRow],

        rules: [...COMMON_BULK_RULES, 'Kolom minimum: `email`, `mitraRoles`, dan `status`.', '`name` dan `phone` bersifat opsional.', `Template khusus role ${roleCode}.`],
      };
    }

    const baseRow = {
      email: `${roleCode.toLowerCase()}1@example.com`,
      name: `${roleCode} Satu`,
      phone: '081234567890',
      scope: 'MITRA',
      role: 'USER',
      mitraRoles: roleCode,
      mitraId: 'isi-mitra-id',
      status: 'ACTIVE',
    };

    const templateRow: ExcelTemplateRow = {
      ...baseRow,
      ...roleTemplate.profileExample,
    };

    const headers = ['email', 'name', 'phone', 'scope', 'role', 'mitraRoles', 'mitraId', 'status', ...roleTemplate.profileFields];

    const values = headers.map((header) => String(templateRow[header] ?? ''));

    return {
      template: {
        fileName: `template-bulk-user-mitra-${roleCode.toLowerCase()}.csv`,
        content: createCsv([headers.join(','), values.join(',')]),
      },

      templateRows: [templateRow],

      rules: [
        ...COMMON_BULK_RULES,
        'Kolom minimum: `email`, `scope`, `role`, `mitraRoles`, `mitraId`, dan `status`.',
        'Untuk user mitra, isi `scope` dengan `MITRA`.',
        'Untuk user mitra, isi `role` dengan `USER`.',
        `Template khusus role ${roleCode}.`,
      ],
    };
  }

  const templateRows: ExcelTemplateRow[] = [
    {
      email: 'mentor1@example.com',
      name: 'Mentor Satu',
      phone: '081234567892',
      scope: 'INSIDIA',
      role: 'MENTOR',
      status: 'ACTIVE',
    },
    {
      email: 'user1@example.com',
      name: 'User Satu',
      phone: '081234567893',
      scope: 'INSIDIA',
      role: 'USER',
      status: 'ACTIVE',
    },
  ];

  return {
    template: {
      fileName: 'template-bulk-user-insidia.csv',

      content: createCsv(['email,name,phone,scope,role,status', 'mentor1@example.com,Mentor Satu,081234567892,INSIDIA,MENTOR,ACTIVE', 'user1@example.com,User Satu,081234567893,INSIDIA,USER,ACTIVE']),
    },

    templateRows,

    rules: [
      ...COMMON_BULK_RULES,
      'Kolom minimum: `email`, `scope`, `role`, dan `status`.',
      '`name` dan `phone` bersifat opsional.',
      'Untuk user Insidia, isi `scope` dengan `INSIDIA`.',
      'Isi `role` dengan salah satu role Insidia yang diizinkan.',
    ],
  };
}

export function getBulkModulePermissionTemplate(): BulkTemplateConfig {
  const templateRows: ExcelTemplateRow[] = [
    {
      module: 'Management User Mitra',
      moduleDescription: 'Module untuk mengelola user pada mitra',
      scope: 'MITRA',
      permissionName: 'Buat User Mitra',
      permissionCode: 'user.create.mitra',
      permissionDescription: 'Permission untuk membuat user pada mitra',
    },
  ];
  return {
    template: {
      fileName: 'template-bulk-module-permission.csv',
      content: createCsv([
        'module,moduleDescription,scope,permissionName,permissionCode,permissionDescription',
        'Management User Mitra,Module untuk mengelola user pada mitra,MITRA,Buat User Mitra,user.create.mitra,Permission untuk membuat user pada mitra',
      ]),
    },

    templateRows,
    rules: [...COMMON_BULK_RULES, 'Kolom minimum: `module`, `moduleDescription`, `scope`, `permissionName`, `permissionCode`, dan `permissionDescription`.'],
  };
}
