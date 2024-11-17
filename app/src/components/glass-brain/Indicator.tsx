import { GlassBrainRegions } from '@/lib/types';
import { cn, formatGlassBrainRegion } from '@/lib/utils';
import { Html, HtmlProps } from '@react-three/drei/web/Html';

function Indicator({ regionName, shapValue, ...props }: HtmlProps & {
  regionName: GlassBrainRegions;
  shapValue: number
}) {

  return (
    <Html 
      {...props}
      className='p-2 bg-black/90 space-y-1 text-white rounded-md pointer-events-none w-auto'
    >
      <p className='font-semibold capitalize whitespace-nowrap'>{formatGlassBrainRegion(regionName)}</p>
      <p className={cn('text-sm', shapValue > 0 ? 'text-red-300' : shapValue < 0 ? 'text-green-300' : '')}>
        {shapValue > 0 ? '+' : shapValue < 0 ? '-' : ''}
        {Math.abs(shapValue).toFixed(2)}
      </p>
    </Html>
  );
}

export default Indicator;