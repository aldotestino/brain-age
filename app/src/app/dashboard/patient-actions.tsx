'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowUpRight, MoreHorizontal } from 'lucide-react';
import UpdatePatient from '@/components/UpdatePatient';
import DeletePatient from '@/components/DeletePatient';
import { Button, buttonVariants } from '@/components/ui/button';
import { Patient } from '@prisma/client';
import Link from 'next/link';

function PatientActions({
  patient
}: {
  patient: Pick<Patient, 'id' | 'firstName' | 'lastName' | 'taxIdCode' | 'age' | 'sex' | 'siteId'>;
}) {

  const { id, ...defaultValues } = patient;

  return (
    <div className='inline-flex'>
      <Link href={`/patient/${id}`} className={buttonVariants({ size: 'sm', variant: 'outline', className: 'rounded-r-none border-r-0 focus-visible:z-10' })}>
        <ArrowUpRight className='size-4 mr-2' />
        Open
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className='size-9 rounded-l-none focus-visible:z-10'>
            <span className="sr-only">Open the menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className='w-48'>
          <UpdatePatient patientId={id} defaultValues={defaultValues} />
          <DeletePatient patientId={id} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default PatientActions;