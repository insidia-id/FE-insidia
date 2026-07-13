import type { ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';

export type AcademicStatus = 'ACTIVE' | 'INACTIVE';

export type SelectOption = {
  label: string;
  value: string;
};

export type AcademicFieldConfig<TFormValues extends FieldValues> = {
  name: keyof TFormValues & string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select';
  placeholder?: string;
  options?: SelectOption[];
};

export type CrudMutationSet<TFormValues> = {
  createMutation: {
    mutate: (data: TFormValues, options?: { onSuccess?: () => void }) => void;
    isPending: boolean;
  };
  updateMutation: {
    mutate: (payload: { id: string; data: TFormValues }, options?: { onSuccess?: () => void }) => void;
    isPending: boolean;
  };
  deleteMutation: {
    mutate: (id: string, options?: { onSuccess?: () => void }) => void;
    isPending: boolean;
  };
};

export type NavigationCard = {
  title: string;
  description: string;
  href: string;
  meta?: string;
  count?: number;
  icon?: ReactNode;
};
