import Indicator from '@/components/glass-brain/Indicator';
import { BrainSVItem, Sides } from '@/lib/types';
import { getGlassBrainRegion, valueToColor } from '@/lib/utils';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { useLoader } from '@react-three/fiber';
import { useCallback, useState } from 'react';
import { Select } from '@react-three/postprocessing';

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
                <Indicator
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

export default Brain;