import { Button, ButtonProps } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import React from 'react';
import { useFormContext } from 'react-hook-form';

function SubmitButton({ children, ...props }: ButtonProps) {

  const { formState } = useFormContext();

  return (
    <Button type="submit" disabled={formState.isSubmitting} {...props}>
      {formState.isSubmitting && <Spinner className="size-4 mr-2" />}
      {children}
    </Button>
  );
}

export default SubmitButton;