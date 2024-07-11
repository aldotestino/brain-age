import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PredictionWithExplanation } from '@/lib/types';

function PredictionCard({ prediction }: Pick<PredictionWithExplanation, 'prediction'>) {
  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle>Prediction</CardTitle>
        <CardDescription>This is the brain age predicted for the patient</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <span className='text-4xl font-bold'>{prediction.toFixed(2)}</span>{' '}
          <span className='text-muted-foreground text-lg font-semibold'>Years</span>
        </p>
      </CardContent>
    </Card>
  );
}

export default PredictionCard;