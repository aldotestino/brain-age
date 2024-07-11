import { columns } from './columns';
import { DataTable } from './data-table';
import { getPatients } from '@/server/queries';

async function DashboardPage({ 
  searchParams 
}: {
  searchParams: {
    q: string;
    p: number;
    n: number;
  }
}) {

  const { patients, total, pages, prevPage, nextPage } = await getPatients(searchParams);

  return (
    <main className="container max-w-screen-lg space-y-10 py-10">
      <header>
        <h1 className='text-4xl font-bold'>Patients</h1>
      </header>
      <DataTable 
        columns={columns} 
        data={patients}
        total={total}
        pages={pages}
        currentQuery={searchParams.q}
        currentPage={searchParams.p} 
        prevPage={prevPage} 
        nextPage={nextPage} 
      />
    </main>
  );
}

export default DashboardPage;