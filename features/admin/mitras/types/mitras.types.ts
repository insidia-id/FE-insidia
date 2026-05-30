export type StatusMitra = 'ACTIVE' | 'INACTIVE';
export type MitraVisibilityFilter = 'available' | 'all' | 'deleted';
export type MitraType = 'SEKOLAH' | 'KAMPUS';
export type Mitra = {
  id: string;
  name: string;
  slug: string | null;
  type: MitraType;
  status: StatusMitra;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
