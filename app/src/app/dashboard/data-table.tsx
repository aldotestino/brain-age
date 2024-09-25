'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Paginator from './paginator';
import AddPatient from '@/components/AddPatient';
import { useQueryStates } from 'nuqs';
import { tableParser } from './table-params';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  total,
  pages,
  prevPage,
  nextPage,
}: DataTableProps<TData, TValue> &  {
  total: number
  pages: number
  nextPage: number | null
  prevPage: number | null
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [{ q }, setTableParams] = useQueryStates(tableParser, { clearOnDefault: true, history: 'push', shallow: false, throttleMs: 500 });

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row items-center gap-2 sm:justify-between'>
        <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
          <div className='flex items-center relative w-full sm:max-w-72'>
            <Search className="absolute left-2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patient..."
              className="pl-8"
              value={q}
              onChange={(e) => setTableParams(prev => ({ ...prev, q: e.target.value }))}
            />
          </div>
          <p className='text-large font-semibold text-muted-foreground'>{total} patients</p>
        </div>
        <AddPatient />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Paginator 
        pages={pages}
        nextPage={nextPage} 
        prevPage={prevPage} 
      />
    </div>
  );
}