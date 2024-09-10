import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function InfoCard({ predictionId, age, sex, siteId }: {
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
      </CardContent>
    </Card>
  );
}

export default InfoCard;