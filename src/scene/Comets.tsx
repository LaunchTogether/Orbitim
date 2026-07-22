import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { COMETS, type Comet } from '../data/comets';
import { orbitSample, propagateElements, semiMajorAxisAU } from '../lib/ephemeris/cometOrbit';
import { heliocentricToScene } from '../lib/scale';
import { useSimTime } from './useSimTime';

/**
 * Comets carried on their real orbits. The nucleus rides the published two-body
 * ellipse; the coma and tail are the two effect sprites, grown from the object's
 * heliocentric distance so a comet is a faint far point most of the time and
 * only unfurls a tail as it nears the Sun — the way the real ones behave.
 *
 * The tail always streams anti-sunward. The Sun sits at the scene origin, so the
 * anti-solar direction is simply the comet's own position vector, and the tail
 * plane is billboarded about that axis to keep its face toward the camera.
 */

/** Semi-major axis, AU, beyond which the full orbit ellipse is not drawn: a
 *  two-thousand-year comet's aphelion is off the edge of the whole scene. */
const ORBIT_DRAW_LIMIT_AU = 40;

/** Loaded effect textures, shared across every comet. */
const effectCache = new Map<string, THREE.Texture>();

function useEffectTexture(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(() => effectCache.get(url) ?? null);
  useEffect(() => {
    const cached = effectCache.get(url);
    if (cached) {
      setTexture(cached);
      return;
    }
    let live = true;
    new THREE.TextureLoader().load(url, (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace;
      effectCache.set(url, loaded);
      if (live) setTexture(loaded);
    });
    return () => {
      live = false;
    };
  }, [url]);
  return texture;
}

export function Comets() {
  const coma = useEffectTexture('/effects/comet-coma.png');
  const tail = useEffectTexture('/effects/comet-tail.png');
  return (
    <group>
      {COMETS.map((comet) => (
        <CometBody key={comet.id} comet={comet} coma={coma} tail={tail} />
      ))}
    </group>
  );
}

interface CometBodyProps {
  comet: Comet;
  coma: THREE.Texture | null;
  tail: THREE.Texture | null;
}

function CometBody({ comet, coma, tail }: CometBodyProps) {
  const group = useRef<THREE.Group>(null);
  const comaRef = useRef<THREE.Sprite>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  // Plane translated so its near edge sits on the nucleus; the tail texture
  // streams to the right from that edge, so +x is the anti-sunward direction.
  const tailGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1).translate(0.5, 0, 0), []);
  useEffect(() => () => tailGeometry.dispose(), [tailGeometry]);

  const scratch = useMemo(
    () => ({
      antiSun: new THREE.Vector3(),
      toCam: new THREE.Vector3(),
      up: new THREE.Vector3(),
      side: new THREE.Vector3(),
      basis: new THREE.Matrix4()
    }),
    []
  );

  const orbitPoints = useMemo(() => {
    if (semiMajorAxisAU(comet.elements) >= ORBIT_DRAW_LIMIT_AU) return null;
    return orbitSample(comet.elements, 400).map((v) => {
      const [x, y, z] = heliocentricToScene(v);
      return new THREE.Vector3(x, y, z);
    });
  }, [comet]);

  useFrame(() => {
    if (!group.current) return;
    const date = useSimTime.getState().date;
    const helio = propagateElements(comet.elements, date);
    const rAU = Math.hypot(helio.x, helio.y, helio.z);
    const [x, y, z] = heliocentricToScene(helio);
    group.current.position.set(x, y, z);

    // A rough activity curve: outgassing roughly follows the inverse square of
    // heliocentric distance, clamped to one. Far out a comet is a bare nucleus.
    const near = THREE.MathUtils.clamp(2.2 / (rAU * rAU), 0, 1);

    if (comaRef.current) {
      const size = 1.2 + 2.6 * near;
      comaRef.current.scale.setScalar(size);
      (comaRef.current.material as THREE.SpriteMaterial).opacity = 0.5 + 0.5 * near;
    }

    if (tailRef.current) {
      const active = near > 0.03;
      tailRef.current.visible = active;
      if (active) {
        const length = 70 * near;
        tailRef.current.scale.set(length, length * 0.28, 1);

        // Group carries no rotation, so its local axes equal the world axes and
        // the anti-solar direction is the comet's own unit position vector.
        scratch.antiSun.set(x, y, z).normalize();
        scratch.toCam.copy(camera.position).sub(group.current.position);
        scratch.up.copy(scratch.toCam).addScaledVector(scratch.antiSun, -scratch.toCam.dot(scratch.antiSun));
        if (scratch.up.lengthSq() < 1e-6) scratch.up.set(0, 1, 0);
        scratch.up.normalize();
        scratch.side.crossVectors(scratch.antiSun, scratch.up).normalize();
        scratch.basis.makeBasis(scratch.antiSun, scratch.up, scratch.side);
        tailRef.current.quaternion.setFromRotationMatrix(scratch.basis);
        (tailRef.current.material as THREE.MeshBasicMaterial).opacity = 0.85 * near;
      }
    }
  });

  return (
    <group ref={group}>
      {orbitPoints && (
        <Line points={orbitPoints} color="#8fb3c7" transparent opacity={0.07} lineWidth={0.8} depthWrite={false} />
      )}

      {tail && (
        <mesh ref={tailRef} geometry={tailGeometry}>
          <meshBasicMaterial
            map={tail}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {coma && (
        <sprite ref={comaRef}>
          <spriteMaterial map={coma} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      )}

      <Html
        position={[0, 1.8, 0]}
        center
        distanceFactor={30}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-sky-100/70">
          {comet.name}
        </span>
      </Html>
    </group>
  );
}
