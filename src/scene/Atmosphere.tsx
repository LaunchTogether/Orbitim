import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { BodyId } from '../lib/ephemeris/bodies';

export interface AtmosphereProfile {
  /** Scattering colour at the limb. */
  color: string;
  /** Shell height as a fraction of the body radius. */
  height: number;
  /** Peak opacity at the limb. */
  strength: number;
  /** How tightly the glow hugs the limb. Higher is thinner and sharper. */
  falloff: number;
}

/**
 * Atmospheres, or the lack of them, are a real property of each world: Venus
 * carries an opaque sulphuric haze, Mars a thin dusty one, the gas giants a
 * deep hydrogen envelope, and Mercury and the moons essentially nothing — so
 * they get no shell at all rather than a decorative one.
 */
export const ATMOSPHERES: Partial<Record<BodyId, AtmosphereProfile>> = {
  venus: { color: '#f6dfa6', height: 0.045, strength: 0.68, falloff: 3.0 },
  earth: { color: '#5fa8ff', height: 0.03, strength: 0.75, falloff: 3.6 },
  mars: { color: '#e2a273', height: 0.028, strength: 0.42, falloff: 3.8 },
  jupiter: { color: '#ffcf9b', height: 0.05, strength: 0.55, falloff: 3.0 },
  saturn: { color: '#f6e5b4', height: 0.05, strength: 0.5, falloff: 3.0 },
  uranus: { color: '#9ff0f5', height: 0.055, strength: 0.7, falloff: 2.8 },
  neptune: { color: '#7aa6ff', height: 0.055, strength: 0.75, falloff: 2.8 },
  titan: { color: '#f0b45f', height: 0.07, strength: 0.8, falloff: 2.6 }
};

const VERTEX = /* glsl */ `
  varying vec3 vNormalView;
  varying vec3 vPositionView;

  void main() {
    vNormalView = normalize(normalMatrix * normal);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vPositionView = viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

/**
 * Limb glow. Opacity follows a Fresnel term so the shell is invisible face on
 * and brightest edge on, and is multiplied by the local sun angle so the night
 * side stays dark instead of ringing the planet in even light.
 */
const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  uniform float uFalloff;
  uniform vec3 uSunDirectionView;

  varying vec3 vNormalView;
  varying vec3 vPositionView;

  void main() {
    vec3 normal = normalize(vNormalView);
    vec3 viewDirection = normalize(-vPositionView);
    float fresnel = pow(1.0 - abs(dot(normal, viewDirection)), uFalloff);

    // Forward scattering: the limb in front of the terminator glows hardest.
    float sunAngle = dot(normal, normalize(uSunDirectionView));
    float daylight = smoothstep(-0.45, 0.35, sunAngle);

    float alpha = fresnel * uStrength * mix(0.06, 1.0, daylight);
    if (alpha <= 0.001) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface AtmosphereProps {
  profile: AtmosphereProfile;
  radius: number;
  /** World position of the body, used to derive the sun direction. */
  worldPosition: THREE.Vector3;
}

export function Atmosphere({ profile, radius, worldPosition }: AtmosphereProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const sunDirection = useMemo(() => new THREE.Vector3(), []);

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(profile.color) },
      uStrength: { value: profile.strength },
      uFalloff: { value: profile.falloff },
      uSunDirectionView: { value: new THREE.Vector3(0, 0, 1) }
    }),
    [profile]
  );

  useFrame(({ camera }) => {
    if (!material.current) return;
    // The Sun sits at the world origin, so the direction to it is simply the
    // body's own position negated, carried into view space for the shader.
    sunDirection.copy(worldPosition).negate().normalize().transformDirection(camera.matrixWorldInverse);
    material.current.uniforms.uSunDirectionView.value.copy(sunDirection);
  });

  return (
    <mesh>
      <sphereGeometry args={[radius * (1 + profile.height), 64, 32]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
