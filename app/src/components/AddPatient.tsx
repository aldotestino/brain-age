'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/lib/hooks/use-toast';
import { sexItems } from '@/lib/data';
import { AddPatientSchema } from '@/lib/types';
import { addPatientSchema } from '@/lib/validators';
import { addPatient } from '@/server/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import EasySelect from './EasySelect';
import FileInput from './FileInput';
import SubmitButton from '@/components/SubmitButton';

function AddPatient() {

  const [open, setOpen] = useState(false);

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
        setOpen(false);
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
      setOpen(false);
      toast({
        title: 'Sucess',
        description: 'Patient created successfully',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-full sm:w-auto'>
          <Plus className='size-4 mr-2'/>
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add patient</DialogTitle>
          <DialogDescription>
            Add a new patient.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className='py-4 space-y-4'>
              <div className='flex gap-4'>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="taxIdCode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Tax ID Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex gap-4'>
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input {...field} type='number' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <SubmitButton>Add</SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddPatient;