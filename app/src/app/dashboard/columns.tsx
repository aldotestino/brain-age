'use client';

import { Patient } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import PatientActions from './patient-actions';

export const columns: ColumnDef<Pick<Patient, 'id' | 'firstName' | 'lastName' | 'taxIdCode' | 'age' | 'sex' | 'siteId'>>[] = [
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
