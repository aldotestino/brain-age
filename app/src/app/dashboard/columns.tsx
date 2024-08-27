'use client';

import { Patient } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import PatientActions from './patient-actions';

export const columns: ColumnDef<Pick<Patient, 'id' | 'firstName' | 'lastName' | 'email' | 'age' | 'sex' | 'siteId'>>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const patient = row.original;

      return (
        <Link href={`/patient/${patient.id}`} className='hover:underline'>
          {patient.id}
        </Link>
      );
    },
  },
  {
    accessorKey: 'firstName',
    header: 'First Name'
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name'
  }, {
    accessorKey: 'email',
    header: 'Email'
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
