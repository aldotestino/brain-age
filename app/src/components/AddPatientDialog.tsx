'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PatientForm from './PatientForm';
import { addPatient } from '@/server/actions';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { PatientSchema } from '@/lib/types';

function AddPatientDialog() {

  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  async function onSubmit(values: PatientSchema) {
    try {
      await addPatient(values);
    }catch (e: any) {
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore, riprova più tardi.',
        variant: 'destructive'
      });
    }finally {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='space-x-2'>
          <Plus className='h-4 w-4'/>
          <span>Add Patient</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add patient</DialogTitle>
          <DialogDescription>
            Add a new patient.
          </DialogDescription>
        </DialogHeader>
        <PatientForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}

export default AddPatientDialog;