import { useState } from 'react';
import { useGetUserById } from '../hooks/useUser';
import type { UserScope } from '../types/user.types';

export function UserDetailController(userId: string, scope: UserScope = 'INSIDIA', mitraId?: string) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data: user, isLoading, isError, error } = useGetUserById(userId, scope, mitraId);

  const socialLinks = user?.socialLinks
    ? [
        { key: 'instagram', label: 'Instagram', href: user.socialLinks.instagram },
        { key: 'linkedin', label: 'LinkedIn', href: user.socialLinks.linkedin },
        { key: 'github', label: 'GitHub', href: user.socialLinks.github },
      ].filter((item) => Boolean(item.href))
    : [];

  return {
    user,
    isLoading,
    isError,
    error,
    isDeleteOpen,
    socialLinks,
    onDeleteDialogChange: setIsDeleteOpen,
  };
}
