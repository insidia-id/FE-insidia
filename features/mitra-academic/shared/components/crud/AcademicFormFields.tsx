'use client';

import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AcademicStatus, SelectOption } from '../../types/common.types';
import { ACADEMIC_STATUS_OPTIONS } from '../../constants/academic.constants';

type SelectFieldProps = {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string | null;
  placeholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  isError?: boolean;
  disabled?: boolean;
};

export function AcademicSelectField({ label, value, onChange, options, error, placeholder, emptyMessage = 'Belum ada data', isLoading = false, isError = false, disabled = false }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder ?? `Pilih ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="__loading" disabled>
              Memuat data...
            </SelectItem>
          ) : isError ? (
            <SelectItem value="__error" disabled>
              Gagal memuat data
            </SelectItem>
          ) : options.length ? (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="__empty" disabled>
              {emptyMessage}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

type StatusSelectFieldProps = {
  value: AcademicStatus;
  onChange: (value: AcademicStatus) => void;
  error?: string | null;
  disabled?: boolean;
};

export function AcademicStatusSelectField({ value, onChange, error, disabled = false }: StatusSelectFieldProps) {
  return (
    <AcademicSelectField
      label="Status"
      value={value}
      onChange={(nextValue) => onChange(nextValue as AcademicStatus)}
      options={ACADEMIC_STATUS_OPTIONS}
      error={error}
      placeholder="Pilih status"
      disabled={disabled}
    />
  );
}

type AcademicFormActionsProps = {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
};

export function AcademicFormActions({ isSubmitting, isEditing, onCancel }: AcademicFormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Batal
      </Button>
      <LoadingButton type="submit" variant="insidia" isLoading={isSubmitting}>
        {isEditing ? 'Perbarui' : 'Simpan'}
      </LoadingButton>
    </div>
  );
}
