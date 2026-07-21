import { BackSide } from 'three';
import { useTexture } from '@react-three/drei';
import { STARFIELD_TEXTURE } from '../lib/textures/registry';

/**
 * Milky Way sky sphere. Rendered from the inside at a radius beyond the far
 * plane of every flight leg, and unaffected by scene lighting so it reads as a
 * background rather than as geometry.
 */
export function Starfield() {
  const texture = useTexture(STARFIELD_TEXTURE);
  return (
    <mesh>
      <sphereGeometry args={[40000, 64, 32]} />
      <meshBasicMaterial map={texture} side={BackSide} toneMapped={false} />
    </mesh>
  );
}
