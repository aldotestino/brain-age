import EasySelect from '@/components/EasySelect';
import CameraControls, { CameraControlsProps } from '@/components/glass-brain/CameraControls';
import { Label } from '@/components/ui/label';
import { featuresItems, sidesItems } from '@/lib/data';
import React from 'react';

function Options({
  side,
  setSide,
  feature,
  setFeature,
  cameraControls
}: {
  side: string;
  setSide: (value: string) => void;
  feature: string;
  setFeature: (value: string) => void;
  cameraControls: CameraControlsProps
}) {
  return (
    <div className='flex gap-4 items-end justify-between'>
      <div className='flex gap-4'>
        <div className='space-y-2 w-32'>
          <Label>Emisphere</Label>
          <EasySelect 
            items={[{ label: 'All', value: 'all' }, ...sidesItems]}
            value={side}
            onValueChange={setSide}
          />
        </div>
        <div className='space-y-2 w-64'>
          <Label>Feature</Label>
          <EasySelect
            items={featuresItems}
            value={feature}
            onValueChange={setFeature} 
          />
        </div>
        <a className='self-end text-muted-foreground hover:underline' href='https://www.freesurfer.net/pub/articles/desikan06-parcellation.pdf' target='_blank'>Desikan-Killiany Atlas</a>
      </div>
      <CameraControls {...cameraControls} />
    </div>
  );
}

export default Options;