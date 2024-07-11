'use client';

import { Patient } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import PatientActions from './actions';

export const columns: ColumnDef<Patient>[] = [
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
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  }, {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'actions',
    cell: ({ row }) => <PatientActions patient={row.original} />,
  },
];
