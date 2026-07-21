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
import { getSatelliteGroup, useSatelliteGroups } from './satelliteGroups';
import { graphicsTier } from '../lib/device';
import type { PositionRegistry } from './bodyPositions';

/**
 * Frames a full pass over the loaded element sets is spread across. A phone CPU
 * gets twice the slack: at low orbital speed a satellite still moves well under
 * a pixel between its turns.
 */
const PROPAGATION_SLICES = graphicsTier === 'low' ? 8 : 4;

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
  const enabled = useSatelliteGroups((s) => s.enabled);
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!engaged || !group.current) return;
    group.current.position.copy(registry.get('earth')!);
  });

  if (!engaged) return null;

  return (
    <group ref={group} rotation={[getAxialTilt('earth'), 0, 0]}>
      {enabled.map((id) => (
        <SatelliteGroupPoints key={id} groupId={id} />
      ))}
    </group>
  );
}

/**
 * One constellation. Element sets are fetched once per group and propagated
 * every frame into a single points buffer, so adding a group costs one draw
 * call regardless of how many objects it carries.
 */
function SatelliteGroupPoints({ groupId }: { groupId: string }) {
  const definition = getSatelliteGroup(groupId);
  const [satellites, setSatellites] = useState<SatelliteData[]>([]);
  const points = useRef<THREE.Points>(null);
  const setCount = useSatelliteGroups((s) => s.setCount);

  useEffect(() => {
    let cancelled = false;
    fetchSatellitesByGroup(groupId).then((result) => {
      if (cancelled) return;
      setSatellites(result.satellites);
      setCount(groupId, result.satellites.length);
    });
    return () => {
      cancelled = true;
    };
  }, [groupId, setCount]);

  const positions = useMemo(() => new Float32Array(Math.max(satellites.length, 1) * 3), [satellites.length]);
  const cursor = useRef(0);

  useFrame(() => {
    if (satellites.length === 0 || !points.current) return;

    const date = useSimTime.getState().date;
    const attribute = points.current.geometry.getAttribute('position') as THREE.BufferAttribute;

    // SGP4 for eleven thousand objects every frame is the single most expensive
    // thing in the scene. The set is propagated in slices instead: a satellite
    // in low orbit moves under a kilometre in the few frames before its turn
    // comes round again, which is far below one pixel at this scale.
    const slice = Math.ceil(satellites.length / PROPAGATION_SLICES);
    const start = cursor.current;
    const end = Math.min(start + slice, satellites.length);
    cursor.current = end >= satellites.length ? 0 : end;

    for (let i = start; i < end; i++) {
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

  if (satellites.length === 0) return null;

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={definition.color}
        size={0.014}
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </points>
  );
}
