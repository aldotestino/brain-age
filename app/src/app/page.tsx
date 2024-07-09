'use client';

import PredExp from '@/components/PredExp';
import Sidebar from '@/components/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PredictionWithExplanation, Values } from '@/lib/types';
import { cn } from '@/lib/utils';
import { predictAndExplain } from '@/server/actions';
import { useState } from 'react';

export default function Home() {

  const [selected, setSelected] = useState('');
  const [predictionWithExplanation, setPredictionWithExplanation] = useState<{
    [key: string]: PredictionWithExplanation
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: Values) {
    setIsLoading(true);
    const data = await predictAndExplain(values);
    setSelected(data.id);
    setPredictionWithExplanation(pv => ({ [data.id]: data, ...pv }));
    setIsLoading(false);
  }

  return (
    <div className="h-screen grid grid-cols-[auto,auto,1fr]">
      <Sidebar onSubmit={onSubmit} isLoading={isLoading} />
      {Object.keys(predictionWithExplanation).length > 0 ? 
        <div className='w-56 border-r grid grid-rows-[auto,1fr] overflow-y-hidden'>
          <div className='p-4'>
            <p className='text-lg font-semibold text-muted-foreground'>Predictions</p>
          </div>
          <div className='p-2 overflow-scroll space-y-1'>
            {Object.keys(predictionWithExplanation).map((key, i) => (
              <Button key={key} onClick={() => setSelected(key)} className={cn('w-full justify-start space-x-2', selected === key ? 'bg-muted hover:no-underline' : 'hover:bg-transparent')} variant="link">
                <span className='min-w-0 truncate'>
                  {key}
                </span>
                {i === 0 && <Badge>New</Badge>}
              </Button>
            ))}
          </div>
        </div> : 
        <span></span>}
      <PredExp predictionWithExplanation={predictionWithExplanation[selected] || null} />
    </div>
  );
}
