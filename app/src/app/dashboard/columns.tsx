'use client';

import { Patient } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';


export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
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
