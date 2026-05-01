import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
