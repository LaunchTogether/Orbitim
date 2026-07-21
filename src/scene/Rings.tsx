import { useMemo } from 'react';
import * as THREE from 'three';
import type { BodyRecord } from '../lib/ephemeris/bodies';

interface RingsProps {
  record: BodyRecord;
  radius: number;
  map: THREE.Texture | null;
}

/**
 * Ring plane for Saturn and Uranus. The published ring texture is a radial
 * strip, so UVs are rewritten to map the strip along the radius instead of
 * around the circumference.
 */
export function Rings({ record, radius, map }: RingsProps) {
  const geometry = useMemo(() => {
    const inner = radius * record.rings!.innerRadii;
    const outer = radius * record.rings!.outerRadii;
    const geo = new THREE.RingGeometry(inner, outer, 256, 1);
    const position = geo.attributes.position;
    const uv = geo.attributes.uv;
    const v = new THREE.Vector3();
    for (let i = 0; i < position.count; i++) {
      v.fromBufferAttribute(position, i);
      const t = (v.length() - inner) / (outer - inner);
      uv.setXY(i, t, 0.5);
    }
    return geo;
  }, [radius, record]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshBasicMaterial
        map={map ?? undefined}
        color={map ? '#ffffff' : record.color}
        side={THREE.DoubleSide}
        transparent
        opacity={map ? 1 : 0.4}
        depthWrite={false}
      />
    </mesh>
  );
}
