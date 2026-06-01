export const Permissions = {
  userPermissions: {
    createUserInsidia: 'user.create.insidia',
    viewUserInsidia: 'user.view.insidia',
    updateUserInsidia: 'user.update.insidia',
    deleteUserInsidia: 'user.delete.insidia',

    createUserMitra: 'user.create.mitra',
    viewUserMitra: 'user.view.mitra',
    updateUserMitra: 'user.update.mitra',
    deleteUserMitra: 'user.delete.mitra',
  },

  mitraPermissionCodes: {
    create: 'mitra.create',
    view: 'mitra.view',
    update: 'mitra.update',
    delete: 'mitra.delete',
  },

  coursePermissionCodes: {
    create: 'course.create.insidia',
    view: 'course.view.insidia',
    update: 'course.update.insidia',
    remove: 'course.remove.insidia',

    createMitra: 'course.create.mitra',
    viewMitra: 'course.view.mitra',
    updateMitra: 'course.update.mitra',
    removeMitra: 'course.remove.mitra',
  },

  RolePermissionCodes: {
    createRoleInsidia: 'roles.create.insidia',
    viewRoleInsidia: 'roles.view.insidia',
    updateRoleInsidia: 'roles.update.insidia',
    removeRoleInsidia: 'roles.remove.insidia',

    createRoleMitra: 'roles.create.mitra',
    viewRoleMitra: 'roles.view.mitra',
    updateRoleMitra: 'roles.update.mitra',
    removeRoleMitra: 'roles.remove.mitra',
  },

  permissionCodes: {
    viewMitraPermissions: 'permissions.view.mitra',
    manageMitraPermissions: 'permissions.manage.mitra',
    viewInsidiaPermissions: 'permissions.view.insidia',
    manageInsidiaPermissions: 'permissions.manage.insidia',
  },
} as const;
