import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PredictionWithExplanation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

function PredictionCard({ prediction, age }: Pick<PredictionWithExplanation, 'prediction'> & {age: number}) {

  const bag = useMemo(() => prediction - age, [prediction, age]);

  return (
    <Card className='col-span-3 flex flex-col justify-between'>
      <CardHeader>
        <CardTitle>Prediction</CardTitle>
        <CardDescription>This is the brain age predicted for the patient</CardDescription>
      </CardHeader>
      <CardContent className='flex gap-10'>
        <p>
          <span className='text-5xl font-bold'>{prediction.toFixed(2)}</span>{' '}
          <span className='text-muted-foreground text-xl font-semibold'>Years</span>
        </p>
        <p>
          <span className={cn('text-5xl font-bold', Math.abs(bag) < 3 ? 'text-green-600' : 'text-red-600')}>{bag > 0 && '+'}{bag.toFixed(2)}</span>{' '}
          <span className='text-muted-foreground text-xl font-semibold'>BAG</span>
        </p>
      </CardContent>
    </Card>
  );
}

export default PredictionCard;