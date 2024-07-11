'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddPatientForm } from './PatientForm';
import { useState } from 'react';
import { Plus } from 'lucide-react';

function AddPatientDialog() {

  const [open, setOpen] = useState(false);

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
        <AddPatientForm closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default AddPatientDialog;