import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

function SubmitButton({ children, ...props }: ButtonProps) {

  const { formState } = useFormContext();

  return (
    <Button type="submit" disabled={formState.isSubmitting} {...props}>
      {formState.isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
      {children}
    </Button>
  );
}

export default SubmitButton;