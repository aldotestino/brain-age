import { Features } from '@/lib/types';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

function DependantFeature({
  featureName,
  calcData,
  percentage
}: {
  featureName: Features;
  calcData: number;
  percentage: number;
}) {
  return (
    <div className='space-y-2'>
      <div className='flex items-baseline justify-between'>
        <Label>{featureName}</Label>
        <p className='text-lg font-semibold text-muted-foreground'>{calcData.toFixed(2)}</p>
      </div>
      <div className='grid grid-cols-[1fr,auto] gap-1'>
        <Slider min={-100} max={100} disabled className='opacity-50' value={[percentage]} />
        <span className='w-20 text-right'>{percentage >= 0 && '+'}{percentage.toFixed(2)}%</span>
      </div>
    </div>
  );
}

export default DependantFeature;