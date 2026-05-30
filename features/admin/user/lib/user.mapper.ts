export function getNameInitials(role: string) {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'super admin';
    case 'ADMIN':
      return 'admin';
    case 'MENTOR':
      return 'mentor';
    case 'USER':
      return 'user';
    case 'AKADEMIK':
      return 'akademik';
    default:
      return role.toLowerCase();
  }
}
