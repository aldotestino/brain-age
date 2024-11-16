'use client';

import { Patient } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import PatientActions from './patient-actions';
import { buttonVariants } from '@/components/ui/button';

export const columns: ColumnDef<Pick<Patient, 'id' | 'firstName' | 'lastName' | 'taxIdCode' | 'age' | 'sex' | 'siteId'>>[] = [
  {
    id: 'open',
    cell: ({ row }) => {
      const patient = row.original;

      return (
        <Link href={`/patient/${patient.id}`} className={buttonVariants({ className: 'h-8', variant: 'outline' })} >
          Open
        </Link>
      );
    }
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'firstName',
    header: 'First Name'
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name'
  }, {
    accessorKey: 'taxIdCode',
    header: 'Tax Id Code'
  }, {
    accessorKey: 'age',
    header: 'Age'
  }, {
    accessorKey: 'sex',
    header: 'Sex'
  }, {
    accessorKey: 'siteId',
    header: 'Site ID'
  }, {
    id: 'actions',
    cell: ({ row }) => <PatientActions patient={row.original} />,
  },
];
