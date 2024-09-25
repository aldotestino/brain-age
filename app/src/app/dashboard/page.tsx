import { columns } from './columns';
import { DataTable } from './data-table';
import { getPatients } from '@/server/queries';
import { tableParamsCache } from './table-params';

async function DashboardPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {

  const { patients, total, pages, prevPage, nextPage } = await getPatients(tableParamsCache.parse(searchParams));  

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
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </main>
  );
}

export default DashboardPage;