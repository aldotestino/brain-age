'use client';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { Canvas, useLoader } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Suspense, useCallback, useState } from 'react';
import Spinner from './ui/spinner';
import * as THREE from 'three';
import { features, featuresItems, glassBrainRegions } from '@/lib/data';
import EasySelect from './EasySelect';
import { BrainSVItem, Features, GlassBrainRegions, PredictionWithExplanation } from '@/lib/types';
import { cn, getGlassBrainRegion, valueToColor } from '@/lib/utils';
import { Card, CardContent, CardHeader } from './ui/card';
import GlassBrainLegend from './GlassBrainLegend';
import { Selection, Select, EffectComposer, Outline } from '@react-three/postprocessing';
import { folder, useControls } from 'leva';
import { HtmlProps } from '@react-three/drei/web/Html';

function ShapValueIndicator({ regionName, shapValue, ...props }: HtmlProps & {
  regionName: GlassBrainRegions;
  shapValue: number
}) {

  return (
    <Html 
      {...props}
      className='p-2 bg-black/90 text-white rounded-md pointer-events-none'>
      <p className='font-semibold'>{regionName}</p>
      <p className={cn('text-sm', shapValue > 0 ? 'text-red-300' : shapValue < 0 ? 'text-blue-300' : '')}>
        {shapValue > 0 ? '+' : shapValue < 0 ? '-' : ''}
        {Math.abs(shapValue).toFixed(2)}
      </p>
    </Html>
  );
}


function Brain({ values }: {values: BrainSVItem}) {
  
  const { children } = useLoader(OBJLoader, '/brain.obj');

  // const config = useControls({
  //   regions: folder(
  //     glassBrainRegions.reduce((acc, region) => {
  //       acc[region as GlassBrainRegions] = { value: false };
  //       return acc;
  //     }, {} as Record<GlassBrainRegions, { value: boolean }>), 
  //     { collapsed: true })
  // });

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
      // onPointerOver={(e) => setHoveredPart(e.object.parent?.name || null)} 
      // onPointerOut={(e) => setHoveredPart(null)}
    >
      {children.map((child) => (
        child instanceof THREE.Mesh ? 
          <Select 
            key={child.name}
            enabled={
              child.name === hoveredPart 
              // || config[getGlassBrainRegion(child.name)]
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
                // config[getGlassBrainRegion(child.name)] || 
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
  
  return (
    <Card className='h-full grid grid-rows-[auto,1fr]'>
      <CardHeader>
        <div className='grid grid-rows-2 gap-4 xl:grid-rows-1 xl:grid-cols-[auto,1fr] xl:gap-8'>
          <div className='w-52'>
            <EasySelect
              items={featuresItems}
              value={feature}
              onValueChange={setFeature} 
            />
          </div>
          <GlassBrainLegend />
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<GlassBrainFallback />}>
          <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <Selection>
              <EffectComposer multisampling={0} autoClear={false}>
                <Outline visibleEdgeColor={0xffffff} hiddenEdgeColor={0xffffff} blur width={1000} edgeStrength={100} />
              </EffectComposer>
              <Brain values={values[feature as Features]}  />
            </Selection>
            <OrbitControls  />
          </Canvas>
        </Suspense>
      </CardContent>
    </Card>
  );
}

export default GlassBrain;
