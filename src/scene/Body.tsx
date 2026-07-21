import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getBodyRecord, type BodyId } from '../lib/ephemeris/bodies';
import { getAxialTilt, getSpinAngle } from '../lib/ephemeris/rotation';
import { useBodyTexture } from '../lib/textures/useBodyTexture';
import { lodFor, useFlight } from '../flight/useFlight';
import { useSimTime } from './useSimTime';
import { sceneRadiusOf, type PositionRegistry } from './bodyPositions';
import { Rings } from './Rings';
import { SunGlow } from './SunGlow';
import { SunSurface } from './SunSurface';
import { Atmosphere, ATMOSPHERES } from './Atmosphere';

interface BodyProps {
  id: BodyId;
  registry: PositionRegistry;
  onSelect: (id: BodyId) => void;
}

/** Segment count scales with level of detail so far bodies stay cheap. */
const SEGMENTS = { far: 48, near: 192 } as const;

/**
 * Equatorial jet speed relative to the body's bulk rotation, expressed as the
 * fraction of a full turn the jet gains per simulated hour. The gas giants have
 * no solid surface to rotate with, so their cloud bands genuinely slide past
 * one another; the drift is small at real time and obvious at a day a second.
 */
const ZONAL_DRIFT: Partial<Record<BodyId, number>> = {
  jupiter: 0.0008,
  saturn: 0.0032,
  neptune: 0.0042
};

const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0);

export function Body({ id, registry, onSelect }: BodyProps) {
  const record = getBodyRecord(id);
  const group = useRef<THREE.Group>(null);
  const surface = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Mesh>(null);

  const phase = useFlight((s) => s.phase);
  const target = useFlight((s) => s.target);
  const lod = lodFor(id, phase, target);
  const textures = useBodyTexture(id, lod);

  const radius = sceneRadiusOf(id);
  const isStar = record.kind === 'star';
  const atmosphere = ATMOSPHERES[id];
  const worldPosition = registry.get(id)!;

  // Simulated hours since J2000, shared with the zonal drift shader patch.
  const driftHours = useMemo(() => ({ value: 0 }), []);
  const zonalRate = useMemo(() => ({ value: ZONAL_DRIFT[id] ?? 0 }), [id]);

  const patchZonalDrift = useMemo(() => {
    if (!ZONAL_DRIFT[id]) return undefined;
    return (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.uniforms.uDriftHours = driftHours;
      shader.uniforms.uZonalRate = zonalRate;
      shader.fragmentShader = shader.fragmentShader
        .replace(
          'void main() {',
          `uniform float uDriftHours;
           uniform float uZonalRate;
           void main() {`
        )
        .replace(
          '#include <map_fragment>',
          `#ifdef USE_MAP
             // The jet is fastest at the equator and dies away at the poles.
             float latitude = vMapUv.y * 2.0 - 1.0;
             float zonal = (1.0 - latitude * latitude) * uZonalRate * uDriftHours;
             vec4 sampledDiffuseColor = texture2D( map, vec2( fract( vMapUv.x + zonal ), vMapUv.y ) );
             diffuseColor *= sampledDiffuseColor;
           #endif`
        );
    };
  }, [id, driftHours, zonalRate]);

  useFrame(() => {
    const position = registry.get(id);
    if (position && group.current) group.current.position.copy(position);

    const date = useSimTime.getState().date;
    const spin = getSpinAngle(id, date);
    if (surface.current) surface.current.rotation.y = spin;
    // Clouds drift slightly faster than the surface, as they do in reality.
    if (clouds.current) clouds.current.rotation.y = spin * 1.08;
    driftHours.value = (date.getTime() - J2000_MS) / 3600000;
  });

  return (
    <group ref={group} rotation={[getAxialTilt(id), 0, 0]}>
      <mesh
        ref={surface}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(id);
        }}
      >
        <sphereGeometry args={[radius, SEGMENTS[lod], SEGMENTS[lod] / 2]} />
        {isStar ? (
          <SunSurface map={textures.map} />
        ) : (
          <meshStandardMaterial
            key={`${textures.map?.uuid ?? 'flat'}-${textures.emissiveMap?.uuid ?? 'none'}`}
            map={textures.map ?? undefined}
            color={textures.map ? '#ffffff' : record.color}
            emissiveMap={textures.emissiveMap ?? undefined}
            emissive={textures.emissiveMap ? new THREE.Color('#ffcf87') : new THREE.Color('#000000')}
            emissiveIntensity={textures.emissiveMap ? 0.4 : 0}
            roughness={0.92}
            metalness={0}
            onBeforeCompile={patchZonalDrift}
            /* three caches compiled programs by material parameters alone, so
               a patched and an unpatched standard material with otherwise
               identical settings would share one program. The key keeps the
               two apart. */
            customProgramCacheKey={() => (ZONAL_DRIFT[id] ? 'orbitim-zonal-drift' : 'orbitim-plain')}
          />
        )}
      </mesh>

      {textures.cloudMap && (
        <mesh ref={clouds}>
          <sphereGeometry args={[radius * 1.006, SEGMENTS[lod], SEGMENTS[lod] / 2]} />
          {/* The published cloud map is white cloud on a black sky. Added on
              top of the surface, black contributes nothing and the clouds sit
              over the terrain without an alpha channel to rely on. */}
          <meshBasicMaterial
            key={textures.cloudMap.uuid}
            map={textures.cloudMap}
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.5}
            depthWrite={false}
          />
        </mesh>
      )}

      {atmosphere && <Atmosphere profile={atmosphere} radius={radius} worldPosition={worldPosition} />}

      {record.rings && (
        <Rings record={record} radius={radius} map={textures.ringMap} worldPosition={worldPosition} />
      )}

      {isStar && <SunGlow radius={radius} />}
    </group>
  );
}
