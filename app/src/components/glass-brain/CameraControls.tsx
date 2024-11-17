import { ArrowDown, ArrowUp, Home, MoveHorizontal } from 'lucide-react';
import ButtonTooltip from '../WithTooltip';
import WithTooltip from '../WithTooltip';
import { Button } from '@/components/ui/button';

export type CameraControlsProps = {
  reset: any;
  up: any;
  down: any;
  x: any;
}

function CameraControls({
  reset,
  up,
  down,
  x
}: CameraControlsProps) {
  return (
    <div className='flex gap-2'>
      <WithTooltip tooltip='Move up'>
        <Button variant="outline" size="icon" onClick={up}>
          <ArrowUp className='size-4' />
        </Button>
      </WithTooltip>
      <WithTooltip tooltip='Move down'>
        <Button variant="outline" size="icon" onClick={down}>
          <ArrowDown className='size-4' />
        </Button>
      </WithTooltip>
      <WithTooltip tooltip='Move horizontally'>
        <Button variant="outline" size="icon" onClick={x}>
          <MoveHorizontal className='size-4' />
        </Button>
      </WithTooltip>
      <WithTooltip tooltip='Reset'>
        <Button variant="outline" size="icon" onClick={reset}>
          <Home className='size-4' />
        </Button>
      </WithTooltip>
    </div>
  );
}

export default CameraControls;