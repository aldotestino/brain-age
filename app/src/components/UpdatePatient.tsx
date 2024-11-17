'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { UpdatePatientSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/lib/hooks/use-toast';
import { updatePatientSchema } from '@/lib/validators';
import { updatePatient } from '@/server/actions';
import { useForm } from 'react-hook-form';
import EasySelect from '@/components/EasySelect';
import { sexItems } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import SubmitButton from '@/components/SubmitButton';


function UpdatePatient({
  patientId,
  defaultValues,
}: {
  patientId: number;
  defaultValues: UpdatePatientSchema;
}) {

  const [open, setOpen] = useState(false);

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
      setOpen(false);
      toast({
        title: 'Sucess',
        description: 'Patient updated successfully',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()} className='space-x-2'>
          <SquarePen className="h-4 w-4" />
          <span>Update</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update patient</DialogTitle>
          <DialogDescription>
            You are updating patient with id {patientId}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className='space-y-4 py-4'>
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
                        <EasySelect items={sexItems} value={field.value} onValueChange={field.onChange}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="siteId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Site ID</FormLabel>
                    <FormControl>
                      <Input {...field} type='number' min={1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <SubmitButton>Update</SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdatePatient;