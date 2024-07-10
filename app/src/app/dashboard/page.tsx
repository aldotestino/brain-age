import { Patient } from '@/lib/types';
import { columns } from './columns';
import { DataTable } from './data-table';

export const patients: Patient[] = [{
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@gmail.com'
}, {
  id: 2,
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@gmail.com'
}, {
  id: 3,
  firstName: 'Sam',
  lastName: 'Smith',
  email: 'sam.smith@gmail.com'
}];

function DashboardPage({ 
  searchParams 
}: {
  searchParams: {
    q: string;
    p: number;
    n: number;
  }
}) {
  return (
    <main className="container max-w-screen-lg space-y-10 py-10">
      <header>
        <h1 className='text-4xl font-bold'>Patients</h1>
      </header>
      <DataTable columns={columns} data={patients} />
    </main>
  );
}

export default DashboardPage;