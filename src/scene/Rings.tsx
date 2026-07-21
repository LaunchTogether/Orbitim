import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { BodyRecord } from '../lib/ephemeris/bodies';

interface RingsProps {
  record: BodyRecord;
  radius: number;
  map: THREE.Texture | null;
  /** World position of the parent body, used to find the sun direction. */
  worldPosition: THREE.Vector3;
}

const VERTEX = /* glsl */ `
  varying vec3 vLocalPosition;

  void main() {
    vLocalPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Ring material. Three things the published strip alone cannot do: the planet's
 * shadow falling across the ring plane, the ringlet structure finer than the
 * texture resolves, and the forward scattering that makes the far side of the
 * rings brighten when the Sun is behind them.
 */
const FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform bool uHasMap;
  uniform vec3 uColor;
  uniform float uInner;
  uniform float uOuter;
  uniform float uPlanetRadius;
  uniform vec3 uSunDirection;
  uniform float uTime;

  varying vec3 vLocalPosition;

  float hash(float x) {
    return fract(sin(x * 127.1) * 43758.5453123);
  }

  void main() {
    float r = length(vLocalPosition.xy);
    float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);

    vec4 sampled = uHasMap ? texture2D(uMap, vec2(t, 0.5)) : vec4(uColor, 0.55);
    vec3 color = uHasMap ? sampled.rgb : uColor;
    float alpha = uHasMap ? sampled.a : 0.45;

    // Ringlets: fine radial structure below the texture's resolution, plus a
    // very slow density wave so the plane is never perfectly static.
    float ringlets = hash(floor(r * 900.0)) * 0.35 + 0.65;
    float wave = 0.94 + 0.06 * sin(r * 260.0 - uTime * 0.35);
    alpha *= ringlets * wave;

    // Saturn's own shadow. The ray from this point towards the Sun is blocked
    // when it passes within the planet's radius of the centre.
    vec3 point = vec3(vLocalPosition.xy, 0.0);
    float along = -dot(point, uSunDirection);
    float shadow = 1.0;
    if (along > 0.0) {
      float miss = length(point + uSunDirection * along);
      shadow = smoothstep(uPlanetRadius * 0.96, uPlanetRadius * 1.06, miss);
    }
    color *= mix(0.18, 1.0, shadow);

    // Forward scattering: ice grains glow when lit from behind.
    float grazing = 1.0 - abs(dot(normalize(vec3(0.0, 0.0, 1.0)), uSunDirection));
    color += vec3(0.22, 0.19, 0.14) * grazing * shadow * alpha;

    if (alpha <= 0.004) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * Ring plane for Saturn and Uranus. The published ring texture is a radial
 * strip, so it is sampled by radius in the shader rather than by the mesh UVs.
 */
export function Rings({ record, radius, map, worldPosition }: RingsProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const inner = radius * record.rings!.innerRadii;
  const outer = radius * record.rings!.outerRadii;

  const geometry = useMemo(() => new THREE.RingGeometry(inner, outer, 256, 1), [inner, outer]);
  // The geometry is created here rather than declaratively, so releasing it is
  // this component's job too.
  useEffect(() => () => geometry.dispose(), [geometry]);
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const rotation = useMemo(() => new THREE.Quaternion(), []);

  const uniforms = useMemo(
    () => ({
      uMap: { value: map },
      uHasMap: { value: map !== null },
      uColor: { value: new THREE.Color(record.color) },
      uInner: { value: inner },
      uOuter: { value: outer },
      uPlanetRadius: { value: radius },
      uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
      uTime: { value: 0 }
    }),
    [map, record.color, inner, outer, radius]
  );

  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!material.current || !mesh.current) return;
    material.current.uniforms.uTime.value += delta;
    // The Sun is at the world origin; carry the direction to it into the ring's
    // own frame, which is tilted with the planet.
    mesh.current.getWorldQuaternion(rotation).invert();
    scratch.copy(worldPosition).negate().normalize().applyQuaternion(rotation);
    material.current.uniforms.uSunDirection.value.copy(scratch);
  });

  return (
    <mesh ref={mesh} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <shaderMaterial
        ref={material}
        key={map?.uuid ?? 'flat'}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
