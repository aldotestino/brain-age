import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeletePrediction from './DeletePrediction';

function InfoCard({ parametersChanged, predictionId }: {
  parametersChanged: string[];
  predictionId: number;
}) {
  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle>Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-2 justify-between'>
          <p className='text-lg font-semibold text-muted-foreground'>Parameters changed</p>
          <p className='text-lg'>{parametersChanged.length}</p>
        </div>
        <div className='flex items-center gap-2 justify-between'>
          <p className='text-lg font-semibold text-muted-foreground'>Actions</p>
          <DeletePrediction predictionId={predictionId} />
        </div>
      </CardContent>
    </Card>
  );
}

export default InfoCard;