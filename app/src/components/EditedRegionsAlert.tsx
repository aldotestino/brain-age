import { TriangleAlert } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { DataChangeSchema, Regions, Sides } from '@/lib/types';
import { useMemo } from 'react';
import { formatGlassBrainRegion } from '@/lib/utils';

function EditedRegionsAlert({
  dataChange,
  onSelect
}: {
  dataChange: DataChangeSchema,
  onSelect: (side: Sides, region: Regions) => void
}) {

  const modifiedRegions = useMemo(() => Object.entries(dataChange).flatMap(([side, regions]) => 
    Object.entries(regions)
      .filter(([, value]) => value.percentage !== 0) // Filter regions with percentage !== 0
      .map(([region]) => ({ side: side as Sides, region: region as Regions }))
  ), [dataChange]);

  // if no modified regions, return null
  if(modifiedRegions.length === 0) return null;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className='border-0'>
        <AccordionTrigger className='p-0'>
          <div className='flex items-center gap-2'>
            <TriangleAlert className="h-4 w-4" />
            <span>{modifiedRegions.length} modified regions</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className='space-y-2 p-0 pt-2'>
          <p className='text-muted-foreground'>These regions have already been modified. To use the original values select the &quot;Base&quot; prediction.</p>
          <ul className='space-y-1 list-inside list-disc'>
            {modifiedRegions.map(r => (
              <li 
                key={`${r.side}_${r.region}`} 
                className="text-sm hover:underline cursor-pointer" 
                onClick={() => onSelect(r.side, r.region)}
              >
                {formatGlassBrainRegion(`${r.side}.${r.region}`)}
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default EditedRegionsAlert;