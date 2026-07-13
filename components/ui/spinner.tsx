import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return <Loader role="status" aria-label="Loading" className={cn('size-4 animate-spin', className)} {...props} />;
}
export function SpinnerCustom() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
    </div>
  );
}
export { Spinner };
