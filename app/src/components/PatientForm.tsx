import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm } from 'react-hook-form';
import { PatientSchema } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { Patient } from '@prisma/client';
import { patientSchema } from '@/lib/validators';

function Field({
  name,
  label,
  placeholder,
  formControl
}: {
  name: keyof Pick<PatientSchema, 'firstName' | 'lastName' | 'email'>,
  label: string,
  placeholder?: string,
  formControl: Control<PatientSchema>
}) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function PatientForm({
  submitButtonLabel = 'Continue',
  defaultValues,
  onSubmit
}: {
  submitButtonLabel?: string;
  defaultValues?: PatientSchema;
  onSubmit: (values: PatientSchema) => void;
}) {
  
  const form = useForm<PatientSchema>({
    resolver: zodResolver(patientSchema),
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
      email: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className='flex gap-4'>
          <Field name="firstName" label="First name" formControl={form.control} />
          <Field name="lastName" label="Last name" formControl={form.control} />
        </div>
        <Field name="email" label="Email" formControl={form.control} />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner className="mr-2" />}
            {submitButtonLabel}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default PatientForm;