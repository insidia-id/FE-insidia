import { BookOpen, Building2, FolderKanban, GraduationCap, House, LayoutDashboard, Shield, UserPlus, Users } from 'lucide-react';

export const iconMap = {
  House,
  LayoutDashboard,
  Users,
  UserPlus,
  Shield,
  Building2,
  BookOpen,
  FolderKanban,
  GraduationCap,
};

export type IconName = keyof typeof iconMap;
