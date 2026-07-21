import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { STARFIELD_TEXTURE } from '../lib/textures/registry';

/**
 * Milky Way sky sphere, rendered from the inside and unlit so it reads as a
 * background rather than as geometry. The texture is loaded imperatively rather
 * than through a suspending loader: a sky that arrives late is better than a
 * scene that withholds every body until it does.
 */
export function Starfield() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    new THREE.TextureLoader().load(STARFIELD_TEXTURE, (loaded) => {
      if (cancelled) return;
      loaded.colorSpace = THREE.SRGBColorSpace;
      setTexture(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!texture) return null;

  return (
    <mesh>
      <sphereGeometry args={[40000, 64, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false} />
    </mesh>
  );
}
