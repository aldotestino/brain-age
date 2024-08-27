'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import UpdatePatient from '@/components/UpdatePatient';
import DeletePatient from '@/components/DeletePatient';
import { Button } from '@/components/ui/button';
import { Patient } from '@prisma/client';
import { useState } from 'react';

function PatientActions({
  patient
}: {
  patient: Pick<Patient, 'id' | 'firstName' | 'lastName' | 'email' | 'age' | 'sex' | 'siteId'>;
}) {

  const { id, ...defaultValues } = patient;
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);


  return (
    <DropdownMenu open={showDropdownMenu} onOpenChange={setShowDropdownMenu}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open the menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='w-48'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UpdatePatient patientId={id} defaultValues={defaultValues} />
        <DeletePatient patientId={id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default PatientActions;