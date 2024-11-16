'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm } from 'react-hook-form';
import { AddPatientSchema, UpdatePatientSchema } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { addPatientSchema, updatePatientSchema } from '@/lib/validators';
import FileInput from './FileInput';
import { addPatient, updatePatient } from '@/server/actions';
import { ComponentProps, use } from 'react';
import EasySelect from './EasySelect';
import { sexItems } from '@/lib/data';
import { useToast } from '@/components/ui/use-toast';

function Field({
  name,
  label,
  formControl,
  ...inputProps
}: ComponentProps<typeof Input> & {
  name: string,
  label: string,
  formControl: Control<any>
}) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} {...inputProps} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function AddPatientForm({
  closeDialog,
}: {
  closeDialog: () => void;
}) {

  const { toast } = useToast();

  const form = useForm<AddPatientSchema>({
    defaultValues: {
      firstName: '',
      lastName: '',
      taxIdCode: '',
      age: 1,
      sex: 'Male',
      siteId: 1,
    },
    resolver: zodResolver(addPatientSchema)
  });

  function onRemoveFile() {
    form.resetField('data');
  }

  function onError() {
    form.setError('data', {
      type: 'manual',
      message: 'Invalid JSON file'
    });
  }

  async function onSubmit(values: AddPatientSchema) {
    const err = await addPatient(values);
    if(err) {
      if(err === 'Prediction failed, try again later') {
        closeDialog();
        toast({
          title: 'Error',
          description: err,
          variant: 'destructive'
        });
      } else {
        form.setError('taxIdCode', {
          type: 'manual',
          message: err
        });
      }
    } else {
      closeDialog();
      toast({
        title: 'Sucess',
        description: 'Patient created successfully',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className='py-4 space-y-4'>
          <div className='flex gap-4'>
            <Field name="firstName" label="First name" formControl={form.control} />
            <Field name="lastName" label="Last name" formControl={form.control} />
          </div>
          <Field name="taxIdCode" label="Tax Id Code" formControl={form.control} />
          <div className='flex gap-4'>
            <Field name="age" label="Age" type='number' min={1} formControl={form.control} />
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Sex</FormLabel>
                  <FormControl>
                    <EasySelect items={sexItems} value={field.value} onValueChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Field name="siteId" label="Site ID" type='number' min={1} formControl={form.control} />
          <FormField
            control={form.control}
            name="data"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <FileInput onChange={field.onChange} onRemoveFile={onRemoveFile} onError={onError} />
                </FormControl>
                {fieldState.invalid && <p className="text-sm font-medium text-destructive">Invalid JSON file</p>}
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner className="mr-2" />}
            <span>Continue</span>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function UpdatePatientForm({
  patientId,
  defaultValues,
  closeDialog,
}: {
  patientId: number;
  defaultValues: UpdatePatientSchema;
  closeDialog: () => void;
}) {

  const { toast } = useToast();

  const form = useForm<UpdatePatientSchema>({
    defaultValues,
    resolver: zodResolver(updatePatientSchema)
  });

  async function onSubmit(values: UpdatePatientSchema) {
    const err = await updatePatient({ patientId, values });
    if(err) {
      form.setError('taxIdCode', {
        type: 'manual',
        message: err
      });
    }else {
      closeDialog();
      toast({
        title: 'Sucess',
        description: 'Patient updated successfully',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className='space-y-4 py-4'>
          <div className='flex gap-4'>
            <Field name="firstName" label="First name" formControl={form.control} />
            <Field name="lastName" label="Last name" formControl={form.control} />
          </div>
          <Field name="taxIdCode" label="Tax Id Code" formControl={form.control} />
          <div className='flex gap-4'>
            <Field name="age" label="Age" type='number' min={1} formControl={form.control} />
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Sex</FormLabel>
                  <FormControl>
                    <EasySelect items={sexItems} value={field.value} onValueChange={field.onChange}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Field name="siteId" label="Site ID" type='number' min={1} formControl={form.control} />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner className="mr-2" />}
            <span>Continue</span>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export {
  AddPatientForm,
  UpdatePatientForm
};