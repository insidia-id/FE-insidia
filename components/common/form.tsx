import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type BaseFieldProps = {
  label: string;
  id: string;
  placeholder?: string;
  error?: string | null;
};

type TextFieldProps = BaseFieldProps & React.ComponentProps<typeof Input>;

type TextAreaFieldProps = BaseFieldProps & React.ComponentProps<typeof Textarea>;

export function TextField({ label, id, placeholder, error, ...props }: TextFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} placeholder={placeholder} {...props} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function TextAreaField({ label, id, placeholder, error, ...props }: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} placeholder={placeholder} {...props} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  options: readonly {
    label: string;
    value: string;
  }[];
  placeholder: string;
  error?: string | null;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
