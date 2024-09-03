'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import Paginator from './paginator';
import AddPatient from '@/components/AddPatient';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  total,
  pages,
  itemsPerPage,
  currentPage,
  currentQuery,
  nextPage,
  prevPage,
  columns,
  data,
}: DataTableProps<TData, TValue> &  {
  total: number
  pages: number
  itemsPerPage: number
  nextPage: number | null
  prevPage: number | null
  currentPage: number
  currentQuery: string
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [query, setQuery] = useState(currentQuery);
  
  const debouncedQuery = useDebounce(query, 500);
  const router = useRouter();

  useEffect(() => {
    if (debouncedQuery !== currentQuery) {
      if(debouncedQuery === '') {
        router.push('/dashboard');
      } else {
        router.push(`/dashboard?q=${debouncedQuery}`);
      }
    }
  }, [debouncedQuery, currentQuery, router]);

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row items-center gap-2 sm:justify-between'>
        <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
          <div className='flex items-center relative w-full sm:max-w-72'>
            <Search className="absolute left-2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patient..."
              className="pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        currentQuery={currentQuery}
        nextPage={nextPage} 
        prevPage={prevPage} 
      />
    </div>
  );
}