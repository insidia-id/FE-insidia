import { asBoolean, asNullableString, asNumberOrDefault, asRecord, asString, unwrapDataPayload, normalizeEnum } from '@/lib/helper/normalizer.helper';
import type { RoleUser, SocialLinks, StatusUser, User, UserDetail, UserMitraRoleRelation, UserRoleRelation, UserScope } from './user.types';

const USER_ROLE_VALUES = ['SUPER_ADMIN', 'ADMIN', 'MENTOR', 'USER', 'AKADEMIK', 'MURID', 'GURU', 'WALI_MURID'] as const;
const USER_SCOPE_VALUES = ['INSIDIA', 'MITRA'] as const;
const USER_STATUS_VALUES = ['ACTIVE', 'SUSPENDED', 'BANNED'] as const;

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
    code: normalizeRole(record?.code),
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

function normalizeMitraRole(value: unknown): UserMitraRoleRelation | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  return {
    id: asString(record.id),
    roleId: asString(record.roleId),
    mitraId: asString(record.mitraId),
    role: normalizeRoleData(record.role),
  };
}

function normalizeMitraRoles(value: unknown): UserMitraRoleRelation | null {
  if (Array.isArray(value)) {
    return value.map(normalizeMitraRole).find((role): role is UserMitraRoleRelation => Boolean(role)) ?? null;
  }

  return normalizeMitraRole(value);
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
