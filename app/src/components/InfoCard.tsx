import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
          <p>{parametersChanged.length}</p>
          {/* <Popover>
            <PopoverTrigger className='hover:underline'>{parametersChanged.length}</PopoverTrigger>
            <PopoverContent className='max-h-52 overflow-y-scroll divide-y'>
              {parametersChanged.map((tag) => (
                <p key={tag} className="text-sm py-1">
                  {tag}
                </p>
              ))}
            </PopoverContent>
          </Popover> */}
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