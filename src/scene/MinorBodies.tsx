import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { MINOR_BODIES, type MinorBody, type MinorBodyClass } from '../data/minorBodies';
import { orbitSample, propagateElements } from '../lib/ephemeris/cometOrbit';
import { heliocentricToScene } from '../lib/scale';
import { useSimTime } from './useSimTime';
import { useViewSettings } from './viewSettings';

/**
 * The named minor planets — the dwarf planets and the largest asteroids —
 * placed by their real orbital elements. Each is a symbolic marker with its
 * orbit traced behind it, not drawn to true size: at true scale Ceres is far
 * below a pixel from anywhere a camera can sit, the same reason the belt and the
 * satellites are drawn as points.
 */

const CLASS_COLOR: Record<MinorBodyClass, string> = {
  'dwarf-planet': '#d8b4fe',
  asteroid: '#c9b18c',
  'near-earth': '#fb7a4a'
};

/** Marker size in scene units. Dwarf planets read a touch larger than rocks. */
const CLASS_SIZE: Record<MinorBodyClass, number> = {
  'dwarf-planet': 1.5,
  asteroid: 1.0,
  'near-earth': 0.9
};

/** A soft round dot, drawn once and shared by every marker. */
let dotTexture: THREE.Texture | null = null;
function getDotTexture(): THREE.Texture {
  if (dotTexture) return dotTexture;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.45, 'rgba(255,255,255,0.85)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  dotTexture = new THREE.CanvasTexture(canvas);
  dotTexture.colorSpace = THREE.SRGBColorSpace;
  return dotTexture;
}

export function MinorBodies() {
  const dot = useMemo(getDotTexture, []);
  return (
    <group>
      {MINOR_BODIES.map((body) => (
        <MinorBodyMarker key={body.id} body={body} dot={dot} />
      ))}
    </group>
  );
}

function MinorBodyMarker({ body, dot }: { body: MinorBody; dot: THREE.Texture }) {
  const group = useRef<THREE.Group>(null);
  const color = CLASS_COLOR[body.klass];
  const size = CLASS_SIZE[body.klass];
  const orbitsVisible = useViewSettings((s) => s.orbitsVisible);
  const light = useViewSettings((s) => s.theme === 'light');

  const orbitPoints = useMemo(
    () =>
      orbitSample(body.elements, 400).map((v) => {
        const [x, y, z] = heliocentricToScene(v);
        return new THREE.Vector3(x, y, z);
      }),
    [body]
  );

  useFrame(() => {
    if (!group.current) return;
    const [x, y, z] = heliocentricToScene(propagateElements(body.elements, useSimTime.getState().date));
    group.current.position.set(x, y, z);
  });

  return (
    <group>
      {/* The orbit is in absolute scene coordinates and must stay put; only the
          marker rides the body's moving position. */}
      {orbitsVisible && (
        <Line points={orbitPoints} color={color} transparent opacity={0.06} lineWidth={0.7} depthWrite={false} />
      )}

      <group ref={group}>
        <sprite scale={[size, size, size]}>
          <spriteMaterial map={dot} color={color} transparent depthWrite={false} />
        </sprite>

        <Html position={[0, 1.4, 0]} center distanceFactor={26} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
          <span
            className="whitespace-nowrap text-[9px] uppercase tracking-[0.18em]"
            style={{ color: light ? '#475569' : color }}
          >
            {body.name}
          </span>
        </Html>
      </group>
    </group>
  );
}
