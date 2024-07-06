'use client';

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

const Brain = ({ feature }: {feature: FeaturesKeys}) => {
  const obj = useLoader(OBJLoader, '/brain.obj');

  useEffect(() => {
    obj.rotateX(-Math.PI / 2);
    obj.rotateZ(Math.PI / 2);
  }, [obj]);

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

function BrainFallBack() {
  return (
    <div className='grid place-items-center h-full w-full'>
      <Spinner />
    </div>
  );
}

function BrainScene() {

  const [feature, setFeature] = useState(featuresValues[0]);

  return (
    <div className='h-full w-full grid grid-rows-[auto,1fr] gap-4 p-4'>
      <div>
        <div className='space-y-2 w-72'>
          <Label>Select Feature</Label>
          <EasySelect
            items={featuresValues.map(f => ({
              value: f,
              label: f
            }))}
            value={feature}
            onValueChange={setFeature} 
          />
        </div>
      </div>
      <div>
        <Suspense fallback={<BrainFallBack />}>
          <Canvas>
            <ambientLight />
            <Brain feature={feature as FeaturesKeys} />
            <OrbitControls  />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
}

export default BrainScene;
