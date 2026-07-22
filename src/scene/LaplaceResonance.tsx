import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { BodyId } from '../lib/ephemeris/bodies';
import { useFlight } from '../flight/useFlight';
import type { PositionRegistry } from './bodyPositions';

/**
 * Draws the Laplace resonance while the camera is at Jupiter or one of the
 * Galileans: a coloured line from Jupiter to each of Io, Europa and Ganymede,
 * so their instantaneous configuration — the one locked into a 1 : 2 : 4 chain —
 * is visible at a glance. The live libration argument is read out alongside in
 * the panel (see ui/LaplacePanel). Endpoints are rewritten each frame from the
 * shared position registry; nothing here allocates per frame.
 */

const INNER: readonly BodyId[] = ['io', 'europa', 'ganymede'];
const COLOR: Record<string, string> = { io: '#e8d16a', europa: '#d8cbb0', ganymede: '#a89f92' };
const ACTIVE_TARGETS: readonly (BodyId | null)[] = ['jupiter', 'io', 'europa', 'ganymede', 'callisto'];

export function LaplaceResonance({ registry }: { registry: PositionRegistry }) {
  const target = useFlight((s) => s.target);
  const phase = useFlight((s) => s.phase);
  const active = phase !== 'overview' && ACTIVE_TARGETS.includes(target);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(18), 3));
    const colours = new Float32Array(18);
    INNER.forEach((m, i) => {
      const c = new THREE.Color(COLOR[m]);
      for (const v of [0, 1]) {
        colours[i * 6 + v * 3] = c.r;
        colours[i * 6 + v * 3 + 1] = c.g;
        colours[i * 6 + v * 3 + 2] = c.b;
      }
    });
    g.setAttribute('color', new THREE.BufferAttribute(colours, 3));
    return g;
  }, []);

  const lines = useRef<THREE.LineSegments>(null);

  useFrame(() => {
    if (lines.current) lines.current.visible = active;
    if (!active) return;
    const jupiter = registry.get('jupiter')!;
    const position = geometry.attributes.position as THREE.BufferAttribute;
    INNER.forEach((m, i) => {
      const p = registry.get(m)!;
      position.setXYZ(i * 2, jupiter.x, jupiter.y, jupiter.z);
      position.setXYZ(i * 2 + 1, p.x, p.y, p.z);
    });
    position.needsUpdate = true;
    geometry.computeBoundingSphere();
  });

  return (
    <lineSegments ref={lines} geometry={geometry} visible={false}>
      <lineBasicMaterial vertexColors transparent opacity={0.55} depthWrite={false} />
    </lineSegments>
  );
}
