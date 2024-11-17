import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PredictionWithExplanation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

function ResultCard({ prediction, age }: Pick<PredictionWithExplanation, 'prediction'> & {age: number}) {

  const bag = useMemo(() => prediction - age, [prediction, age]);

  return (
    <Card className='h-full grid grid-rows-[auto,1fr,auto] col-span-3'>
      <CardHeader>
        <CardTitle>Predicted Age</CardTitle>
        <CardDescription>This is the brain age predicted for the patient</CardDescription>
      </CardHeader>
      <span /> {/* Spacer */}
      <CardContent className='h-full flex gap-10'>
        <p>
          <span className='text-5xl font-bold'>{prediction.toFixed(2)}</span>{' '}
          <span className='text-muted-foreground text-xl font-semibold'>Years</span>
        </p>
        <p>
          <span className={cn('text-5xl font-bold', bag > 0 ? 'text-red-600' : 'text-green-600')}>{bag > 0 && '+'}{bag.toFixed(2)}</span>{' '}
          <span className='text-muted-foreground text-xl font-semibold'>BAG</span>
        </p>
      </CardContent>
    </Card>
  );
}

export default ResultCard;