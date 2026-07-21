import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { propagate } from 'satellite.js';
import { fetchSatellitesByGroup, type SatelliteData } from '../services/tle';
import { getAxialTilt } from '../lib/ephemeris/rotation';
import { kmToSceneRadius } from '../lib/scale';
import { getBodyRecord } from '../lib/ephemeris/bodies';
import { useFlight } from '../flight/useFlight';
import { useSimTime } from './useSimTime';
import type { PositionRegistry } from './bodyPositions';

/** Groups loaded on approach to Earth, with the colour each is drawn in. */
const GROUPS = [
  { id: 'starlink', color: new THREE.Color('#7dd3fc') },
  { id: 'stations', color: new THREE.Color('#fbbf24') },
  { id: 'gps', color: new THREE.Color('#4ade80') }
];

/** Scene units per kilometre at Earth's surface. */
const KM_TO_SCENE = kmToSceneRadius(getBodyRecord('earth').radiusKm) / getBodyRecord('earth').radiusKm;

interface SatelliteLayerProps {
  registry: PositionRegistry;
}

/**
 * Real satellites around Earth. Positions come from SGP4 propagation of
 * CelesTrak TLEs in the Earth-centred inertial frame, which is the same frame
 * Earth's own spin is rendered in, so a satellite over Istanbul is drawn over
 * Istanbul. The layer only exists while Earth is the flight target.
 */
export function SatelliteLayer({ registry }: SatelliteLayerProps) {
  const target = useFlight((s) => s.target);
  const phase = useFlight((s) => s.phase);
  const engaged = target === 'earth' && phase !== 'overview';

  const [satellites, setSatellites] = useState<SatelliteData[]>([]);
  const [colors, setColors] = useState<Float32Array | null>(null);
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!engaged || satellites.length > 0) return;
    let cancelled = false;

    Promise.all(GROUPS.map((g) => fetchSatellitesByGroup(g.id))).then((results) => {
      if (cancelled) return;
      const loaded: SatelliteData[] = [];
      const tint: number[] = [];
      results.forEach((result, index) => {
        for (const sat of result.satellites) {
          loaded.push(sat);
          tint.push(GROUPS[index].color.r, GROUPS[index].color.g, GROUPS[index].color.b);
        }
      });
      setSatellites(loaded);
      setColors(new Float32Array(tint));
    });

    return () => {
      cancelled = true;
    };
  }, [engaged, satellites.length]);

  const positions = useMemo(() => new Float32Array(satellites.length * 3), [satellites.length]);

  useFrame(() => {
    if (!engaged || satellites.length === 0 || !points.current || !group.current) return;

    const earth = registry.get('earth')!;
    group.current.position.copy(earth);

    const date = useSimTime.getState().date;
    const attribute = points.current.geometry.getAttribute('position') as THREE.BufferAttribute;

    for (let i = 0; i < satellites.length; i++) {
      const state = propagate(satellites[i].satrec, date);
      const eci = state?.position;
      if (!eci || typeof eci === 'boolean') {
        // A decayed or unpropagatable element set is parked at the origin of the
        // layer, which sits inside the planet and is therefore never drawn.
        attribute.setXYZ(i, 0, 0, 0);
        continue;
      }
      // Equatorial frame (z along the spin axis) into scene axes (y up).
      attribute.setXYZ(i, eci.x * KM_TO_SCENE, eci.z * KM_TO_SCENE, -eci.y * KM_TO_SCENE);
    }
    attribute.needsUpdate = true;
  });

  if (!engaged || satellites.length === 0 || !colors) return null;

  return (
    <group ref={group} rotation={[getAxialTilt('earth'), 0, 0]}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.012} vertexColors sizeAttenuation transparent opacity={0.95} depthWrite={false} />
      </points>
    </group>
  );
}
