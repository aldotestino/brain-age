'use client';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import Spinner from './ui/spinner';
import * as THREE from 'three';
import { featuresItems, featuresValues } from '@/lib/data';
import EasySelect from './EasySelect';
import { BrainSVItem, FeaturesKeys, FullRegionsKeys, PredictionWithExplanation } from '@/lib/types';
import { valueToColor } from '@/lib/utils';
import { Card, CardContent, CardHeader } from './ui/card';
import GlassBrainLegend from './GlassBrainLegend';


function Brain({ values }: {values: BrainSVItem}) {
  const obj = useLoader(OBJLoader, '/brain.obj');

  // useEffect(() => {
  //   obj.rotateX(-Math.PI / 2);
  //   obj.rotateZ(Math.PI / 2);
  // }, [obj]);

  useEffect(() => {
    obj.children.forEach(child => {
      const childName = child.name.replace('pial.DK.', '');
      const shapValue = values.regions[childName as FullRegionsKeys];
      if(child instanceof THREE.Mesh && shapValue !== undefined) {
        child.material = new THREE.MeshStandardMaterial({ color: valueToColor(shapValue, values.min, values.max) });
      }
    });
  }, [values, obj]);
  
  return <primitive object={obj} scale={0.03} />;
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

  const [feature, setFeature] = useState(featuresValues[0]);
  
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
            <Brain values={values[feature as FeaturesKeys]}  />
            <OrbitControls  />
          </Canvas>
        </Suspense>
      </CardContent>
    </Card>
  );
}

export default GlassBrain;
