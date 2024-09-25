'use client';

import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from './ui/button';
import { useQueryStates } from 'nuqs';
import { patientParser } from '@/app/patient/[id]/patient-params';

function PredictionsList({
  predictions
}: {
  predictions: {id: number, label: string, isNew: boolean, isBase: boolean}[]
}) {

  const [{ predId }, setPatientParams] = useQueryStates(patientParser, { clearOnDefault: true, history: 'push', shallow: false });
  
  return (
    <div className='w-56 border-r grid grid-rows-[auto,1fr] overflow-y-hidden bg-muted'>
      <div className='p-4'>
        <p className='text-lg font-semibold text-muted-foreground'>Predictions</p>
      </div>
      <div className='p-2 overflow-scroll space-y-1'>
        {predictions.map((p, i) => (
          <Button onClick={() => setPatientParams({ predId: p.id })} key={p.id} variant="link" className={cn('w-full justify-between space-x-2 px-3 py-2 rounded-md', predId === p.id ? 'bg-white hover:no-underline' : 'hover:bg-transparent')}>
            <span className='min-w-0 truncate normal-case'>
              {p.label}
            </span>
            {p.isBase ? <Badge>Base</Badge> : p.isNew ? <Badge>New</Badge> : null}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default PredictionsList;