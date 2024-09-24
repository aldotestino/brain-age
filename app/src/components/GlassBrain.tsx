'use client';

import { features, featuresItems, sidesItems } from '@/lib/data';
import { BrainSVItem, Features, GlassBrainRegions, PredictionWithExplanation, Sides } from '@/lib/types';
import { cn, formatGlassBrainRegion, getGlassBrainRegion, valueToColor } from '@/lib/utils';
import { CameraControls, Html } from '@react-three/drei';
import { HtmlProps } from '@react-three/drei/web/Html';
import { Canvas, useLoader } from '@react-three/fiber';
import { EffectComposer, Outline, Select, Selection } from '@react-three/postprocessing';
import { Suspense, useCallback, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import CameraButtons from './CameraButtons';
import EasySelect from './EasySelect';
import GlassBrainLegend from './GlassBrainLegend';
import { Card, CardContent, CardHeader } from './ui/card';
import { Label } from './ui/label';
import Spinner from './ui/spinner';

function ShapValueIndicator({ regionName, shapValue, ...props }: HtmlProps & {
  regionName: GlassBrainRegions;
  shapValue: number
}) {

  return (
    <Html 
      {...props}
      className='p-2 bg-black/90 space-y-1 text-white rounded-md pointer-events-none w-auto'
    >
      <p className='font-semibold capitalize whitespace-nowrap'>{formatGlassBrainRegion(regionName)}</p>
      <p className={cn('text-sm', shapValue > 0 ? 'text-red-300' : shapValue < 0 ? 'text-blue-300' : '')}>
        {shapValue > 0 ? '+' : shapValue < 0 ? '-' : ''}
        {Math.abs(shapValue).toFixed(2)}
      </p>
    </Html>
  );
}


function Brain({ values, side }: {values: BrainSVItem, side: Sides | 'all'}) {
  const { children } = useLoader(OBJLoader, '/brain.obj');
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const getMaterial = useCallback((childName: string) => {
    const shapValue = values.regions[getGlassBrainRegion(childName)];
    if(shapValue !== undefined) {
      return new THREE.MeshStandardMaterial({ color: valueToColor(shapValue, values.min, values.max) });
    }

    return new THREE.MeshStandardMaterial({ color: '#fff' });
  }, [values]);


  return (
    <group 
      scale={0.03}
    >
      {children.filter((child) => side === 'all' ? true : child.name.startsWith(side)).map((child) => (
        child instanceof THREE.Mesh ? 
          <Select 
            key={child.name}
            enabled={
              child.name === hoveredPart 
            }>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredPart(child.name);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredPart(null);
              }}
              geometry={child.geometry}
              material={getMaterial(child.name)}
            >
              {(!child.name.includes('unknown') && (
                child.name === hoveredPart
              )) && 
                <ShapValueIndicator
                  position={new THREE.Vector3().fromBufferAttribute(child.geometry.getAttribute('position'), 0)}
                  regionName={getGlassBrainRegion(child.name)}
                  shapValue={values.regions[getGlassBrainRegion(child.name)]}
                />
              }
            </mesh>            
          </Select>
          : null
      ))}
    </group>
  );
};

function GlassBrainFallback() {
  return (
    <main className='h-full grid place-items-center'>
      <div className="flex items-center justify-center flex-col text-muted-foreground gap-2">
        <Spinner className='w-6 h-6'/>
        <p className='font-semibold text-center'>Loading Glass Brain...</p>
      </div>
    </main>
  );
}

function GlassBrain({
  values
}: {
  values: PredictionWithExplanation['brain_sv'];
}) {

  const [feature, setFeature] = useState<string>(features[0]);
  const [side, setSide] = useState<string>('all');

  const camera = useRef<CameraControls | null>(null);

  return (
    <Card className='h-full grid grid-rows-[auto,1fr]'>
      <CardHeader>
        <div className='flex gap-4 items-end justify-between'>
          <div className='flex gap-4'>
            <div className='space-y-2 w-32'>
              <Label>Side</Label>
              <EasySelect
                items={[{
                  label: 'All',
                  value: 'all'
                }, 
                ...sidesItems
                ]}
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
          <CameraButtons 
            reset={() => camera.current?.reset()}
            x={() => camera.current?.rotate(Math.PI / 2, 0, true)}
            up={() => camera.current?.rotate(0, Math.PI / 2, true)}
            down={() => camera.current?.rotate(0, -Math.PI / 2, true)}
          />
        </div>
      </CardHeader>
      <CardContent className='grid grid-cols-[1fr,auto] gap-2'>
        <Suspense fallback={<GlassBrainFallback />}>
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
        <GlassBrainLegend max={values[feature as Features].max} min={values[feature as Features].min} />
      </CardContent>
    </Card>
  );
}

export default GlassBrain;
