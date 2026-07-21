import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ALL_BODIES, PLANETS, type BodyId } from '../lib/ephemeris/bodies';
import { useFlight } from '../flight/useFlight';
import { Body } from './Body';
import { BodyMarker } from './BodyMarker';
import { OrbitPath } from './OrbitPath';
import { Starfield } from './Starfield';
import { CameraRig } from './CameraRig';
import { SatelliteLayer } from './SatelliteLayer';
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

  useFrame((state, delta) => {
    // Development probe: lets the browser session inspect live scene state.
    (window as unknown as Record<string, unknown>).__orbitim = state;
    useSimTime.getState().advance(delta);
    updatePositions(registry, useSimTime.getState().date);
  });

  return (
    <>
      <Starfield />

      {/* The Sun is the only meaningful light source, with physical inverse
          square falloff: Mercury is scorched, Neptune is a sliver. A trace of
          ambient keeps the outer planets from going fully black. */}
      <pointLight position={[0, 0, 0]} intensity={5000} decay={2} color="#fff4e0" />
      <ambientLight intensity={0.06} />

      {PLANETS.map((planet) => (
        <OrbitPath key={planet.id} id={planet.id} date={epoch.current} highlighted={target === planet.id} />
      ))}

      {ALL_BODIES.map((body) => (
        <Body key={body.id} id={body.id} registry={registry} onSelect={(id: BodyId) => flyTo(id)} />
      ))}

      {PLANETS.map((planet) => (
        <BodyMarker key={`marker-${planet.id}`} id={planet.id} registry={registry} onSelect={(id: BodyId) => flyTo(id)} />
      ))}

      <SatelliteLayer registry={registry} />

      <CameraRig registry={registry} />
    </>
  );
}
