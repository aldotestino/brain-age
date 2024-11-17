'use client';

import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from './ui/button';
import { useQueryStates } from 'nuqs';
import { patientParser } from '@/app/patient/[id]/patient-params';
import { Prediction } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';

function History({
  predictions
}: {
  predictions: Pick<Prediction, 'id' | 'isBase' | 'createdAt'>[]
}) {

  const [{ predId }, setPatientParams] = useQueryStates(patientParser, { clearOnDefault: true, history: 'push', shallow: false });
  
  return (
    <div className='h-full p-4 overflow-y-auto space-y-1'>
      {predictions.map((p, i) => (
        <Button 
          key={p.id} 
          onClick={() => setPatientParams({ predId: p.id })} 
          variant="link" 
          className={cn('w-full flex justify-between gap-2', (predId === p.id || (predId === null && p.isBase)) ? 'bg-background hover:no-underline shadow-sm' : 'hover:bg-transparent text-muted-foreground')}
        >
          <span className='min-w-0 truncate normal-case'>
            {formatDistanceToNow(p.createdAt, { addSuffix: true })}
          </span>
          {p.isBase ? <Badge>Base</Badge> : null}
        </Button>
      ))}
    </div>
  );
}

export default History;