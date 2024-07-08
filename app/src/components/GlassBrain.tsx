'use client';

import colormap from 'colormap';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import Spinner from './ui/spinner';
import * as THREE from 'three';
import { featuresValues, regionsValues, sidesValues } from '@/lib/data';
import EasySelect from './EasySelect';
import { Label } from '@/components/ui/label';
import { FeaturesKeys } from '@/lib/types';
import { valueToColor } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

function createShapValues() {
  return Object.assign({}, ...sidesValues.flatMap((s) =>
    regionsValues.map((r) => {
      const key = `${s}.${r}`;
      const value = Math.random() * (Math.random() < 0.5 ? -1 : 1);
      return { [key]: value };
    })
  ));
};

const shapValuesByFeature = {
  GM_vol: createShapValues(),
  average_thickness: createShapValues(),
  surface_area: createShapValues(),
  mean_curv: createShapValues(),
  intrinsic_cur_index: createShapValues(),
  gaussian_curv: createShapValues(),
  thickness_stddev: createShapValues(),
};

function Brain({ feature }: {feature: FeaturesKeys}) {
  const obj = useLoader(OBJLoader, '/brain.obj');

  // useEffect(() => {
  //   obj.rotateX(-Math.PI / 2);
  //   obj.rotateZ(Math.PI / 2);
  // }, [obj]);

  useEffect(() => {
    obj.children.forEach(child => {
      const childName = child.name.replace('pial.DK.', '');
      const shapValue = shapValuesByFeature[feature][childName];
      if(child instanceof THREE.Mesh && shapValue) {
        child.material = new THREE.MeshBasicMaterial({ color: valueToColor(shapValue, -1, 1) });
      }
    });
  }, [feature, obj]);
  
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

function GlassBrain() {

  const [feature, setFeature] = useState(featuresValues[0]);

  return (
    <Card className='h-full grid grid-rows-[auto,1fr]'>
      <CardHeader>
        <div className='grid grid-rows-2 gap-4 xl:grid-rows-1 xl:grid-cols-[auto,1fr] xl:gap-8'>
          <div className='w-52'>
            <EasySelect
              items={featuresValues.map(f => ({
                value: f,
                label: f
              }))}
              value={feature}
              onValueChange={setFeature} 
            />
          </div>
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
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<GlassBrainFallback />}>
          <Canvas>
            <ambientLight />
            <Brain feature={feature as FeaturesKeys} />
            <OrbitControls  />
          </Canvas>
        </Suspense>
      </CardContent>
    </Card>
  );
}

export default GlassBrain;
