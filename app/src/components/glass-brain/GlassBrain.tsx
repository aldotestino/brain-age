'use client';

import Brain from '@/components/glass-brain/Brain';
import Fallback from '@/components/glass-brain/Fallback';
import Options from '@/components/glass-brain/Options';
import { features } from '@/lib/data';
import { Features, PredictionWithExplanation, Sides } from '@/lib/types';
import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Outline, Selection } from '@react-three/postprocessing';
import { Suspense, useRef, useState } from 'react';
import Legend from './Legend';

function GlassBrain({
  values
}: {
  values: PredictionWithExplanation['brain_sv'];
}) {

  const [feature, setFeature] = useState<string>(features[0]);
  const [side, setSide] = useState<string>('all');

  const camera = useRef<CameraControls | null>(null);

  return (
    <div className='h-full grid grid-rows-[auto,1fr] gap-4'>
      <Options 
        side={side} 
        setSide={setSide} 
        feature={feature} 
        setFeature={setFeature} 
        cameraControls={{
          reset: () => camera.current?.reset(),
          x: () => camera.current?.rotate(Math.PI / 2, 0, true),
          up: () => camera.current?.rotate(0, Math.PI / 2, true),
          down: () => camera.current?.rotate(0, -Math.PI / 2, true)
        }} 
      />
      <div className='grid grid-cols-[1fr,auto] gap-4'>
        <div className='rounded-md overflow-hidden'>
          <Suspense fallback={<Fallback />}>
            <Canvas>
              <ambientLight intensity={Math.PI / 2} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
              <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
              <Selection>
                <EffectComposer multisampling={0} autoClear={false}>
                  <Outline visibleEdgeColor={0xffffff} hiddenEdgeColor={0xffffff} blur width={1000} edgeStrength={100} />
                </EffectComposer>
                <Brain values={values[feature as Features]} side={side as Sides | 'all'} />
              </Selection>
              <CameraControls ref={camera} />
            </Canvas>
          </Suspense>
        </div>
        <Legend max={values[feature as Features].max} min={values[feature as Features].min} />
      </div>
    </div>
  );
}

export default GlassBrain;
