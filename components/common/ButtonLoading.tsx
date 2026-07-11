'use client';

import { ComponentProps } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LoadingButtonProps = ComponentProps<typeof Button> & {
  isLoading?: boolean;
};
// Button
export function LoadingButton({ children, isLoading, variant, disabled, ...props }: LoadingButtonProps) {
  return (
    <Button className="cursor-pointer" disabled={isLoading || disabled} variant={variant} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
