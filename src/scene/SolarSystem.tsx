import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ALL_BODIES, PLANETS, type BodyId } from '../lib/ephemeris/bodies';
import { useFlight } from '../flight/useFlight';
import { Body } from './Body';
import { BodyMarker } from './BodyMarker';
import { OrbitPath } from './OrbitPath';
import { Starfield } from './Starfield';
import { CameraRig } from './CameraRig';
import { createPositionRegistry, updatePositions } from './bodyPositions';
import { useSimTime } from './useSimTime';

/**
 * Scene root. Owns the per-frame clock and the position registry; every other
 * scene component reads from them instead of touching the ephemeris directly.
 */
export function SolarSystem() {
  const registry = useMemo(() => createPositionRegistry(), []);
  const epoch = useRef(new Date());
  const target = useFlight((s) => s.target);
  const flyTo = useFlight((s) => s.flyTo);

  useFrame((_, delta) => {
    useSimTime.getState().advance(delta);
    updatePositions(registry, useSimTime.getState().date);
  });

  return (
    <>
      <Starfield />

      {/* The Sun is the only light source; ambient stays near zero so night
          sides are genuinely dark. */}
      <pointLight position={[0, 0, 0]} intensity={4.2} decay={0} color="#fff4e0" />
      <ambientLight intensity={0.035} />

      {PLANETS.map((planet) => (
        <OrbitPath key={planet.id} id={planet.id} date={epoch.current} highlighted={target === planet.id} />
      ))}

      {ALL_BODIES.map((body) => (
        <Body key={body.id} id={body.id} registry={registry} onSelect={(id: BodyId) => flyTo(id)} />
      ))}

      {PLANETS.map((planet) => (
        <BodyMarker key={`marker-${planet.id}`} id={planet.id} registry={registry} onSelect={(id: BodyId) => flyTo(id)} />
      ))}

      <CameraRig registry={registry} />
    </>
  );
}
