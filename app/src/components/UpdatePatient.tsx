'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {  UpdatePatientSchema } from '@/lib/types';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import { UpdatePatientForm } from './PatientForm';


function UpdatePatient({
  patientId,
  defaultValues,
}: {
  patientId: number;
  defaultValues: UpdatePatientSchema;
}) {

  const [open, setOpen] = useState(false);

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
        <UpdatePatientForm closeDialog={() => setOpen(false)} defaultValues={defaultValues} patientId={patientId} />
      </DialogContent>
    </Dialog>
  );
}

export default UpdatePatient;