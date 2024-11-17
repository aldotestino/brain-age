import EasySelect from '@/components/EasySelect';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { itemsPerPageItems } from '@/lib/data';
import { useQueryStates } from 'nuqs';
import { tableParser } from './table-params';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
 
function Paginator({
  pages,
  prevPage,
  nextPage,
}: {
  pages: number;
  prevPage: number | null;
  nextPage: number | null;
}) {

  const [{ p, n }, setTableParams] = useQueryStates(tableParser, { clearOnDefault: true, history: 'push', shallow: false });

  return (
    <div className='w-full flex flex-col gap-4 sm:flex-row items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Label>Items</Label>
        <EasySelect
          className='w-20'
          value={n.toString()}
          onValueChange={v => setTableParams(prev => ({ ...prev, n: parseInt(v) }))}
          items={itemsPerPageItems} 
        />
      </div>
      <div className='flex items-center gap-1'>
        <Button variant="ghost" onClick={() => setTableParams(prev => ({ ...prev, p: prevPage }))} className={cn(!prevPage && 'pointer-events-none opacity-50')}>
          <ChevronLeft className='w-4 h-4' />
          <span>Previous</span>
        </Button>
        {prevPage && <Button variant="ghost" className='hidden sm:block' onClick={() => setTableParams(prev => ({ ...prev, p: 1 }))}>1</Button>}
        {prevPage && (prevPage !== 1) && <Ellipsis className='hidden sm:block w-4 h-4' />}
        <Button variant="outline">{p}</Button>
        {nextPage && (nextPage !== pages) && <Ellipsis className='hidden sm:block w-4 h-4' />}
        {nextPage && <Button variant="ghost" className='hidden sm:block' onClick={() => setTableParams(prev => ({ ...prev, p: pages }))}>{pages}</Button>}
        <Button variant="ghost" onClick={() => setTableParams(prev => ({ ...prev, p: nextPage }))} className={cn(!nextPage && 'pointer-events-none opacity-50')}>
          <span>Next</span>
          <ChevronRight className='w-4 h-4' />
        </Button>
      </div>
    </div>
  );
}

export default Paginator;