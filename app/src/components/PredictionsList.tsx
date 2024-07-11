'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

function createUrl(patientId: string, predId: number) {
  return `/patient/${patientId}?predId=${predId}`;
}

function PredictionsList({
  predictions
}: {
  predictions: {id: number, createdAt: Date}[]
}) {

  const sp = useSearchParams();
  const { id } = useParams<{id: string}>();
  
  return (
    <div className='w-56 border-r grid grid-rows-[auto,1fr] overflow-y-hidden'>
      <div className='p-4'>
        <p className='text-lg font-semibold text-muted-foreground'>Predictions</p>
      </div>
      <div className='p-2 overflow-scroll space-y-1'>
        {predictions.map((p, i) => (
          <Link key={p.id} href={createUrl(id, p.id)} className={buttonVariants({ variant: 'link', className: cn('w-full justify-between space-x-2 px-3 py-2 rounded-md', sp.get('predId') === p.id.toString() ? 'bg-muted hover:no-underline' : 'hover:bg-transparent') })}>
            <span className='min-w-0 truncate'>
              {p.id}
            </span>
            {i === 0 && <Badge>New</Badge>}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PredictionsList;