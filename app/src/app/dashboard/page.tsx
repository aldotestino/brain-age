import { columns } from './columns';
import { DataTable } from './data-table';
import { getPatients } from '@/server/queries';

async function DashboardPage({ 
  searchParams: {
    q = '',
    p = '1',
    n = '8',
  }
}: {
  searchParams: {
    q: string;
    p: string;
    n: string;
  }
}) {

  const { patients, total, pages, prevPage, nextPage } = await getPatients({
    q,
    p: parseInt(p),
    n: parseInt(n),
  });

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
        itemsPerPage={parseInt(n)}
        currentQuery={q}
        currentPage={parseInt(p)} 
        prevPage={prevPage} 
        nextPage={nextPage} 
      />
    </main>
  );
}

export default DashboardPage;