import { GLASS_BRAIN_SHADES } from '@/lib/data';
import colormap from 'colormap';

const bgGradient = `linear-gradient(to top, ${colormap({
  colormap: 'RdBu',
  nshades: GLASS_BRAIN_SHADES,
  format: 'hex'
}).join(', ')})`;

function GlassBrainLegend({
  max,
  min,
}: {
  max: number;
  min: number;
}) {
  return (
    <div className='grid place-items-center grid-rows-[auto,1fr,auto] gap-2 text-muted-foreground font-semibold text-center'>
      <p>Increase age</p>
      <div className='h-full flex gap-2'>
        <div className='h-full w-10 rounded-md bg-gradient-to-b' 
          style={{ background: bgGradient }}>
        </div>
        <div className='h-full flex flex-col justify-between'>
          <span>+{max.toFixed(2)}</span>
          <span>{min.toFixed(2)}</span>
        </div>
      </div>
      <p>Decrease age</p>
    </div>
  );
}

export default GlassBrainLegend;