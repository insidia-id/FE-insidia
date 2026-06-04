import { BulkTemplateConfig, ExcelTemplateRow } from '../types/bulk.types';

const COMMON_BULK_RULES = ['Format file yang didukung: CSV, XLSX, dan XLS.', 'Template tersedia dalam format CSV dan Excel.'];

function createCsv(rows: string[]) {
  return rows.join('\n');
}

export function getBulkUserTemplate(scope: string, isAkademikMitraContext: boolean): BulkTemplateConfig {
  if (scope === 'MITRA') {
    if (isAkademikMitraContext) {
      const templateRows: ExcelTemplateRow[] = [
        {
          email: 'murid1@example.com',
          name: 'Murid Satu',
          phone: '081234567890',
          mitraRole: 'MURID',
          status: 'ACTIVE',
        },
        {
          email: 'guru1@example.com',
          name: 'Guru Satu',
          phone: '081234567891',
          mitraRole: 'GURU',
          status: 'ACTIVE',
        },
      ];

      return {
        template: {
          fileName: 'template-bulk-user-mitra-akademik.csv',

          content: createCsv(['email,name,phone,mitraRole,status', 'murid1@example.com,Murid Satu,081234567890,MURID,ACTIVE', 'guru1@example.com,Guru Satu,081234567891,GURU,ACTIVE']),
        },

        templateRows,

        rules: [...COMMON_BULK_RULES, 'Kolom minimum: `email`, `mitraRole`, dan `status`. `name` dan `phone` opsional.'],
      };
    }

    const templateRows: ExcelTemplateRow[] = [
      {
        email: 'murid1@example.com',
        name: 'Murid Satu',
        phone: '081234567890',
        scope: 'MITRA',
        role: 'USER',
        mitraRole: 'MURID',
        mitraId: 'isi-mitra-id',
        status: 'ACTIVE',
      },
      {
        email: 'guru1@example.com',
        name: 'Guru Satu',
        phone: '081234567891',
        scope: 'MITRA',
        role: 'USER',
        mitraRole: 'GURU',
        mitraId: 'isi-mitra-id',
        status: 'ACTIVE',
      },
    ];

    return {
      template: {
        fileName: 'template-bulk-user-mitra.csv',

        content: createCsv([
          'email,name,phone,scope,role,mitraRole,mitraId,status',
          'murid1@example.com,Murid Satu,081234567890,MITRA,USER,MURID,isi-mitra-id,ACTIVE',
          'guru1@example.com,Guru Satu,081234567891,MITRA,USER,GURU,isi-mitra-id,ACTIVE',
        ]),
      },

      templateRows,

      rules: [
        ...COMMON_BULK_RULES,
        'Kolom minimum: `email`, `scope`, `role`, `mitraRole`, `mitraId`, dan `status`.',
        'Untuk user mitra, isi `scope` dengan `MITRA` dan `role` dengan `USER`.',
        'Isi `mitraRole` dengan salah satu: `AKADEMIK`, `GURU`, `MURID`, atau `WALI_MURID`.',
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

    rules: [...COMMON_BULK_RULES, 'Kolom minimum: `email`, `scope`, `role`, dan `status`. `name` dan `phone` opsional.', 'Untuk user Insidia, isi `scope` dengan `INSIDIA`.', 'Isi `role` dengan salah satu role Insidia yang diizinkan.'],
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
