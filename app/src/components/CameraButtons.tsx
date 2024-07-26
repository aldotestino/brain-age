import { ArrowDown, ArrowUp, Home, MoveHorizontal } from 'lucide-react';
import ButtonTooltip from './ButtonTooltip';

function CameraButtons({
  reset,
  up,
  down,
  x
}: {
  reset: any;
  up: any;
  down: any;
  x: any;
}) {
  return (
    <div className='flex gap-2'>
      <ButtonTooltip tooltip='Move up' variant="outline" size="icon" onClick={up}>
        <ArrowUp className='w-4 h-4' />
      </ButtonTooltip>
      <ButtonTooltip tooltip='Move down' variant="outline" size="icon" onClick={down}>
        <ArrowDown className='w-4 h-4' />
      </ButtonTooltip>
      <ButtonTooltip tooltip='Move horizontally' variant="outline" size="icon" onClick={x}>
        <MoveHorizontal className='w-4 h-4' />
      </ButtonTooltip>
      <ButtonTooltip tooltip='Reset' variant="outline" size="icon" onClick={reset}>
        <Home className='w-4 h-4' />
      </ButtonTooltip>
    </div>
  );
}

export default CameraButtons;