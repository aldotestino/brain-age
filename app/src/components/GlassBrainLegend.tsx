import { GLASS_BRAIN_SHADES } from '@/lib/data';
import colormap from 'colormap';

function GlassBrainLegend() {
  return (
    <div className='flex items-center gap-2 text-muted-foreground font-semibold text-center'>
      <p>Decrease age</p>
      <div className='h-10 w-40 lg:w-80 flex rounded-md overflow-x-hidden'>
        {colormap({
          colormap: 'RdBu',
          nshades: GLASS_BRAIN_SHADES,
          format: 'hex'
        }).map((color) =>(
          <div key={color} className='h-full w-2 lg:w-4' style={{ backgroundColor: color }} />
        ))}
      </div>
      <p>Increase age</p>
    </div>
  );
}

export default GlassBrainLegend;