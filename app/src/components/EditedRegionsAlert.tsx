import { DataChangeSchema, Regions, Sides } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileSliders } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useMemo } from 'react';
import { formatGlassBrainRegion } from '@/lib/utils';

function OtherEditedRegions({ 
  other, 
  onSelect  
}: {
  other: { side: Sides, region: Regions }[],
  onSelect: (side: Sides, region: Regions) => void
}) {

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span
          className="underline cursor-help"
          tabIndex={0}
          role="button"
          aria-haspopup="true"
        >
          {other.length} other regions
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-60 p-0">
        <div className="max-h-72 overflow-y-auto p-4">
          <ul className="space-y-2">
            {other.map(r => (
              <li 
                key={`${r.side}_${r.region}`} 
                className="text-sm hover:underline cursor-pointer capitalize" 
                onClick={() => onSelect(r.side, r.region)}
              >
                {formatGlassBrainRegion(`${r.side}.${r.region}`)}
              </li>
            ))}
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>);
}

function EditedRegionsAlert({ 
  dataChange, 
  onSelect 
}: {
  dataChange: DataChangeSchema, 
  onSelect: (side: Sides, region: Regions) => void}
) {

  const { first, other } = useMemo(() => {
    const [first, ...other] = Object.entries(dataChange).flatMap(([side, regions]) => 
      Object.entries(regions)
        .filter(([, value]) => value.percentage !== 0) // Filter regions with percentage !== 0
        .map(([region]) => ({ side: side as Sides, region: region as Regions }))
    );
    return { first, other };
  }, [dataChange]);

  if (!first) {
    return null;
  }

  return (
    <Alert>
      <FileSliders className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        <p>
          <span 
            className='hover:underline cursor-pointer capitalize' 
            onClick={() => onSelect(first.side, first.region)}
          >
            {formatGlassBrainRegion(`${first.side}.${first.region}`)}
          </span>
          {' '}
          {other.length > 0 && 
            <>
              and{' '}
              <OtherEditedRegions other={other} onSelect={onSelect} />
            </>
          }
          {' '}
          have already been modified.
          To use the original values select the &quot;Base&quot; prediction.
        </p>
      </AlertDescription>
    </Alert>
  );
}

export default EditedRegionsAlert;