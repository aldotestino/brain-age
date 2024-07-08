import colormap from 'colormap';

function GlassBrainLegend() {
  return (
    <div className='flex items-center gap-2 text-muted-foreground font-semibold text-center'>
      <p>Decrease age</p>
      <div className='h-10 w-40 lg:w-80 flex'>
        {colormap({
          colormap: 'RdBu',
          nshades: 20,
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