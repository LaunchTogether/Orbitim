import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { getBodyRecord, type BodyId } from '../lib/ephemeris/bodies';
import { useFlight } from '../flight/useFlight';
import { sceneRadiusOf, type PositionRegistry } from './bodyPositions';

interface BodyMarkerProps {
  id: BodyId;
  registry: PositionRegistry;
  onSelect: (id: BodyId) => void;
}

/** Below this apparent radius in pixels a body needs a marker to be findable. */
const MIN_PIXEL_RADIUS = 9;

/**
 * Click target and label for a body that is too small on screen to hit. It
 * fades in exactly as the body itself becomes sub-pixel, so the two never
 * compete for attention.
 */
export function BodyMarker({ id, registry, onSelect }: BodyMarkerProps) {
  const record = getBodyRecord(id);
  const group = useRef<THREE.Group>(null);
  const wrapper = useRef<HTMLButtonElement>(null);
  const { camera, size } = useThree();

  useFrame(() => {
    const position = registry.get(id);
    if (!position || !group.current) return;
    group.current.position.copy(position);

    const distance = camera.position.distanceTo(position);
    const perspective = camera as THREE.PerspectiveCamera;
    const worldPerPixel = (2 * Math.tan((perspective.fov * Math.PI) / 360) * distance) / size.height;
    const pixelRadius = sceneRadiusOf(id) / worldPerPixel;

    if (wrapper.current) {
      const flight = useFlight.getState();
      const engaged = flight.target === id && flight.phase !== 'overview';
      const visible = pixelRadius < MIN_PIXEL_RADIUS && flight.phase !== 'flying' && !engaged;
      wrapper.current.style.opacity = visible ? '1' : '0';
      wrapper.current.style.pointerEvents = visible ? 'auto' : 'none';
    }
  });

  return (
    <group ref={group}>
      <Html center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <button
          ref={wrapper}
          type="button"
          onClick={() => onSelect(id)}
          className="flex -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/55 transition-[opacity,color] duration-300 hover:text-sky-200"
        >
          <span
            className="h-1.5 w-1.5 rounded-full ring-2 ring-white/10"
            style={{ backgroundColor: record.color }}
            aria-hidden
          />
          {record.name}
        </button>
      </Html>
    </group>
  );
}
