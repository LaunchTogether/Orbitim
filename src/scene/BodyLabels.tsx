import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PLANETS, type BodyId } from '../lib/ephemeris/bodies';
import { useFlight } from '../flight/useFlight';
import { sceneRadiusOf, type PositionRegistry } from './bodyPositions';

interface BodyLabelsProps {
  registry: PositionRegistry;
  onSelect: (id: BodyId) => void;
}

/** Below this apparent radius in pixels a body needs a label to be findable. */
const MIN_PIXEL_RADIUS = 9;
/** Footprint a label occupies on screen, used by the collision resolver. */
const LABEL_WIDTH = 96;
const LABEL_HEIGHT = 20;
/** Steps a label may be pushed down before it is left where it lands. */
const MAX_DISPLACEMENTS = 8;

/**
 * Screen-space labels for the planets, laid out in a single pass so they never
 * overlap. The inner planets project into a few dozen pixels in the system
 * view, which is exactly where independent per-body labels used to stack; here
 * the nearest body keeps its anchor and the ones behind it are pushed down.
 */
export function BodyLabels({ registry, onSelect }: BodyLabelsProps) {
  const { camera, size } = useThree();
  const nodes = useRef(new Map<BodyId, HTMLButtonElement | null>());
  const projected = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const flight = useFlight.getState();
    const perspective = camera as THREE.PerspectiveCamera;
    const tangent = 2 * Math.tan((perspective.fov * Math.PI) / 360);

    const candidates = PLANETS.map((planet) => {
      const position = registry.get(planet.id)!;
      const distance = camera.position.distanceTo(position);
      const worldPerPixel = (tangent * distance) / size.height;
      projected.copy(position).project(camera);
      return {
        id: planet.id,
        x: (projected.x * 0.5 + 0.5) * size.width,
        y: (-projected.y * 0.5 + 0.5) * size.height,
        behindCamera: projected.z > 1,
        pixelRadius: sceneRadiusOf(planet.id) / worldPerPixel,
        distance
      };
    }).sort((a, b) => a.distance - b.distance);

    const placed: { x: number; y: number }[] = [];

    for (const candidate of candidates) {
      const node = nodes.current.get(candidate.id);
      if (!node) continue;

      const engaged = flight.target === candidate.id && flight.phase !== 'overview';
      const visible =
        !candidate.behindCamera &&
        candidate.pixelRadius < MIN_PIXEL_RADIUS &&
        flight.phase !== 'flying' &&
        !engaged;

      if (!visible) {
        node.style.opacity = '0';
        node.style.pointerEvents = 'none';
        continue;
      }

      // Nearest body wins its anchor; anything colliding with an already placed
      // label steps down until it clears every one of them.
      let y = candidate.y;
      for (let attempt = 0; attempt < MAX_DISPLACEMENTS; attempt++) {
        const collides = placed.some(
          (other) => Math.abs(other.x - candidate.x) < LABEL_WIDTH && Math.abs(other.y - y) < LABEL_HEIGHT
        );
        if (!collides) break;
        y += LABEL_HEIGHT;
      }
      placed.push({ x: candidate.x, y });

      node.style.opacity = '1';
      node.style.pointerEvents = 'auto';
      node.style.transform = `translate(${candidate.x}px, ${y - LABEL_HEIGHT / 2}px)`;
    }
  });

  return (
    <Html
      fullscreen
      zIndexRange={[10, 0]}
      // The overlay is screen space, not object space: pinning it to the
      // viewport origin stops drei from offsetting it by this group's
      // projected position, which every label coordinate already accounts for.
      calculatePosition={() => [0, 0]}
      style={{ pointerEvents: 'none' }}
    >
      {/* drei centres the fullscreen layer on its anchor; shifting it back by
          half its size puts the origin at the top-left of the viewport, which
          is the frame the label coordinates are computed in. */}
      <div className="pointer-events-none absolute inset-0" style={{ transform: 'translate(50%, 50%)' }}>
        {PLANETS.map((planet) => (
          <button
            key={planet.id}
            ref={(node) => {
              nodes.current.set(planet.id, node);
            }}
            type="button"
            onClick={() => onSelect(planet.id)}
            style={{ opacity: 0 }}
            className="absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/55 transition-[opacity,color] duration-300 hover:text-sky-200"
          >
            <span
              className="h-1.5 w-1.5 rounded-full ring-2 ring-white/10"
              style={{ backgroundColor: planet.color }}
              aria-hidden
            />
            {planet.name}
          </button>
        ))}
      </div>
    </Html>
  );
}
