import { columns } from './columns';
import { DataTable } from './data-table';
import { getCachedPatients } from '@/server/queries';
import { tableParamsCache } from './table-params';

async function DashboardPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {

  const sp = tableParamsCache.parse(searchParams);
  const { patients, total, pages, prevPage, nextPage } = await getCachedPatients(sp);  

  return (
    <main className="w-full max-w-screen-lg mx-auto px-4 py-10 space-y-10">
      <h1 className='text-4xl font-bold'>Patients</h1>
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