import { asBoolean, asNullableString, asRecord, asString, unwrapDataPayload, normalizeEnum, asOptionalString, recordPaginationParams, asNumber } from '@/lib/helper/normalizer.helper';
import type { RoleUser, SocialLinks, StatusUser, User, UserDetail, UserMitraRoleRelation, UserRoleRelation, UserScope, UsersResponse, MitraProfile } from './user.types';
import { PaginationResponse } from '@/lib/types/types';

export const MITRA_ROLE_VALUES = ['AKADEMIK', 'MURID', 'GURU', 'WALI_MURID'] as const;
export const INSIDIA_ROLE_VALUES = ['SUPER_ADMIN', 'ADMIN', 'MENTOR', 'USER'] as const;
export const USER_ROLE_VALUES = [...INSIDIA_ROLE_VALUES, ...MITRA_ROLE_VALUES] as const;
export const USER_SCOPE_VALUES = ['INSIDIA', 'MITRA'] as const;
export const USER_STATUS_VALUES = ['ACTIVE', 'SUSPENDED', 'BANNED'] as const;

function normalizeRole(value: unknown): RoleUser {
  return normalizeEnum(value, USER_ROLE_VALUES, 'USER');
}

function normalizeScope(value: unknown): UserScope {
  return normalizeEnum(value, USER_SCOPE_VALUES, 'INSIDIA');
}

function normalizeStatus(value: unknown): StatusUser {
  return normalizeEnum(value, USER_STATUS_VALUES, 'ACTIVE');
}

function normalizeRoleData(value: unknown): UserRoleRelation['role'] {
  const record = asRecord(value);

  return {
    id: asString(record?.id),
    scope: normalizeScope(record?.scope),
    code: normalizeRole(record?.code) as UserRoleRelation['role']['code'],
  };
}

function normalizeInsidiaRole(value: unknown): UserRoleRelation | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  return {
    id: asString(record.id),
    roleId: asString(record.roleId),
    role: normalizeRoleData(record.role),
  };
}

function normalizeMitraProfile(value: unknown): MitraProfile | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const profile: MitraProfile = {
    nip: asOptionalString(record.nip),
    subject: asOptionalString(record.subject),
    bio: asOptionalString(record.bio),
    nis: asOptionalString(record.nis),
    kelas: asOptionalString(record.kelas),
    jurusan: asOptionalString(record.jurusan),
    waliId: asOptionalString(record.waliId),
    position: asOptionalString(record.position),
    division: asOptionalString(record.division),
    note: asOptionalString(record.note),
    pekerjaan: asOptionalString(record.pekerjaan),
    alamat: asOptionalString(record.alamat),
  };
  return Object.fromEntries(Object.entries(profile).filter(([, value]) => value !== undefined)) as MitraProfile;
}
function normalizeMitraRole(value: unknown): UserMitraRoleRelation | null {
  const record = asRecord(value);
  const mitraRecord = asRecord(record?.mitra);

  if (!record) {
    return null;
  }

  return {
    id: asString(record.id),
    roleId: asString(record.roleId),
    mitraId: asString(record.mitraId || mitraRecord?.id),
    mitraName: asNullableString(record.mitraName || mitraRecord?.name),
    mitraSlug: asNullableString(record.mitraSlug || mitraRecord?.slug),
    roleCode: normalizeRole(record.roleCode || asRecord(record.role)?.code) as UserMitraRoleRelation['roleCode'],
    role: normalizeRoleData(record.role),
    profile: normalizeMitraProfile(record.profile),
  };
}

function normalizeMitraRoles(value: unknown): UserMitraRoleRelation[] | null {
  if (Array.isArray(value)) {
    const normalizedRoles = value.map(normalizeMitraRole).filter((role): role is UserMitraRoleRelation => Boolean(role));
    return normalizedRoles.length ? normalizedRoles : null;
  }

  const normalizedRole = normalizeMitraRole(value);
  return normalizedRole ? [normalizedRole] : null;
}

function normalizeSocialLinks(value: unknown): SocialLinks | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const socialLinks: SocialLinks = {
    instagram: asNullableString(record.instagram) ?? undefined,
    linkedin: asNullableString(record.linkedin) ?? undefined,
    github: asNullableString(record.github) ?? undefined,
  };

  return Object.values(socialLinks).some(Boolean) ? socialLinks : null;
}

export function normalizeUser(value: unknown): User {
  const record = asRecord(unwrapDataPayload(value));

  if (!record) {
    throw new Error('Invalid user data');
  }

  return {
    id: asString(record.id),
    email: asString(record.email),
    name: asNullableString(record.name),
    status: normalizeStatus(record.status),
    image: asNullableString(record.image),
    createdAt: asString(record.createdAt),
    updatedAt: asString(record.updatedAt),
    deletedAt: asNullableString(record.deletedAt),
    insidiaRole: normalizeInsidiaRole(record.insidiaRole),
    mitraRoles: normalizeMitraRoles(record.mitraRoles),
  };
}
export function normalizeUsersResponse(value: unknown): UsersResponse {
  const record = asRecord(unwrapDataPayload(value));

  if (!record) {
    throw new Error('Invalid users response');
  }

  const rawUsers = Array.isArray(record.users) ? record.users : [];
  return {
    users: rawUsers.map(normalizeUser),
    ...recordPaginationParams(record as PaginationResponse),
  };
}
export function normalizeUsers(value: unknown): User[] {
  const payload = unwrapDataPayload(value);

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map(normalizeUser);
}

export function normalizeUserDetail(value: unknown): UserDetail {
  const user = normalizeUser(value);
  const record = asRecord(unwrapDataPayload(value));

  if (!record) {
    throw new Error('Invalid user detail data');
  }

  return {
    ...user,
    normalizedEmail: asString(record.normalizedEmail) || user.email.toLowerCase(),
    emailVerified: asBoolean(record.emailVerified),
    phone: asNullableString(record.phone),
    phoneVerifiedAt: asNullableString(record.phoneVerifiedAt),
    bio: asNullableString(record.bio),
    websiteUrl: asNullableString(record.websiteUrl),
    socialLinks: normalizeSocialLinks(record.socialLinks),
    createdById: asNullableString(record.createdById),
  };
}
