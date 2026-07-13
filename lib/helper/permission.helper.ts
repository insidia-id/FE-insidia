export const Permissions = {
  userPermissions: {
    create: {
      INSIDIA: 'user.create.insidia',
      MITRA: 'user.create.mitra',
    },
    view: {
      INSIDIA: 'user.view.insidia',
      MITRA: 'user.view.mitra',
    },
    update: {
      INSIDIA: 'user.update.insidia',
      MITRA: 'user.update.mitra',
    },
    delete: {
      INSIDIA: 'user.remove.insidia',
      MITRA: 'user.remove.mitra',
    },
  },

  mitraPermissions: {
    create: {
      MITRA: 'mitra.create',
    },
    view: {
      MITRA: 'mitra.view',
    },
    update: {
      MITRA: 'mitra.update',
    },
    delete: {
      MITRA: 'mitra.delete',
    },
  },

  coursePermissions: {
    create: {
      INSIDIA: 'course.create.insidia',
      MITRA: 'course.create.mitra',
    },
    view: {
      INSIDIA: 'course.view.insidia',
      MITRA: 'course.view.mitra',
    },
    update: {
      INSIDIA: 'course.update.insidia',
      MITRA: 'course.update.mitra',
    },
    remove: {
      INSIDIA: 'course.remove.insidia',
      MITRA: 'course.remove.mitra',
    },
  },

  rolePermissions: {
    create: {
      INSIDIA: 'roles.create.insidia',
      MITRA: 'roles.create.mitra',
    },
    view: {
      INSIDIA: 'roles.view.insidia',
      MITRA: 'roles.view.mitra',
    },
    update: {
      INSIDIA: 'roles.update.insidia',
      MITRA: 'roles.update.mitra',
    },
    remove: {
      INSIDIA: 'roles.remove.insidia',
      MITRA: 'roles.remove.mitra',
    },
  },

  Permissions: {
    view: {
      INSIDIA: 'permissions.view.insidia',
      MITRA: 'permissions.view.mitra',
    },
    manage: {
      INSIDIA: 'permissions.manage.insidia',
      MITRA: 'permissions.manage.mitra',
    },
  },
  MyCoursePermissions: {
    view: {
      INSIDIA: 'myclasscourse.view.insidia',
      MITRA: 'myclasscourse.view.mitra',
    },
  },
  MyClassPermissions: {
    view: {
      INSIDIA: 'myclassgroup.view.insidia',
      MITRA: 'myclassgroup.view.mitra',
    },
  },
} as const;
