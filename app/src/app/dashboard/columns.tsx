'use client';

import { buttonVariants } from '@/components/ui/button';
import { Patient } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';


export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const patient = row.original;

      return (
        <Link href={`/patient/${patient.id}`} className={buttonVariants({ variant: 'link' })}>
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
  }
];
