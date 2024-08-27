import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DeletePrediction from './DeletePrediction';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

function InfoCard({ parametersChanged, predictionId, age, sex, siteId }: {
  parametersChanged: string[];
  predictionId: number;
  age: number;
  sex: string;
  siteId: number;
}) {
  return (
    <Card className='col-span-2'>
      <CardHeader>
        <CardTitle>Info</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <div className='flex items-center gap-2 justify-between'>
          <p className='text-lg font-semibold text-muted-foreground'>Parameters changed</p>
          {parametersChanged.length > 0 ? 
            <Popover>
              <PopoverTrigger className='hover:underline'>{parametersChanged.length}</PopoverTrigger>
              <PopoverContent className='max-h-52 overflow-y-scroll divide-y'>
                {parametersChanged.map((tag) => (
                  <p key={tag} className="text-sm py-1">
                    {tag}
                  </p>
                ))}
              </PopoverContent>
            </Popover> : 
            <p>{parametersChanged.length}</p>
          }
        </div> */}
        <div className='flex items-center gap-2 justify-between'>
          <p className='text-lg font-semibold text-muted-foreground'>Age</p>
          <p>{age}</p>
        </div>
        <div className='flex items-center gap-2 justify-between'>
          <p className='text-lg font-semibold text-muted-foreground'>Sex</p>
          <p>{sex}</p>
        </div>
        <div className='flex items-center gap-2 justify-between'>
          <p className='text-lg font-semibold text-muted-foreground'>Site ID</p>
          <p>{siteId}</p>
        </div>
        {/* <div className='flex items-center gap-2 justify-between'>
          <p className='text-lg font-semibold text-muted-foreground'>Actions</p>
          <DeletePrediction predictionId={predictionId} />
        </div> */}
      </CardContent>
    </Card>
  );
}

export default InfoCard;