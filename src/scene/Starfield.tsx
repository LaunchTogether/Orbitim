import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { STARFIELD_TEXTURE } from '../lib/textures/registry';

/** Radius of the sky shell, just inside the camera's far plane. */
const SKY_RADIUS = 40000;
/** Stars drawn in front of the sky map. */
const STAR_COUNT = 9000;

/**
 * Colour temperatures across the main sequence, from cool red dwarfs to hot
 * blue giants. Sampling these instead of painting every star white is most of
 * what separates a night sky from a noise texture.
 */
const STAR_COLORS = ['#9bb0ff', '#aabfff', '#cad7ff', '#f8f7ff', '#fff4ea', '#ffd2a1', '#ffcc6f'];

/**
 * Soft round point sprite. Without it every star is a hard square, which is the
 * single most artificial-looking thing about an untextured point cloud.
 */
function createStarSprite(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas context unavailable for the star sprite');

  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.75)');
  gradient.addColorStop(0.55, 'rgba(255,255,255,0.16)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

interface StarBuffers {
  positions: Float32Array;
  colors: Float32Array;
}

/**
 * Deterministic star field: the same sky on every load, so the background is a
 * fixed backdrop rather than a different scene each visit.
 */
function createStars(): StarBuffers {
  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const color = new THREE.Color();
  // Cheap reproducible hash in place of Math.random.
  const rand = (i: number, salt: number) => {
    const value = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
    return value - Math.floor(value);
  };

  for (let i = 0; i < STAR_COUNT; i++) {
    // Uniform on the sphere: cosine-distributed polar angle avoids the pole
    // clustering a naive angle pair produces.
    const theta = rand(i, 1) * Math.PI * 2;
    const cosPhi = rand(i, 2) * 2 - 1;
    const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
    const radius = SKY_RADIUS * 0.92;
    positions[i * 3] = radius * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = radius * cosPhi;
    positions[i * 3 + 2] = radius * sinPhi * Math.sin(theta);

    color.set(STAR_COLORS[Math.floor(rand(i, 3) * STAR_COLORS.length)]);
    // A steep brightness curve: a handful of bright stars, a great many faint.
    const brightness = 0.35 + Math.pow(rand(i, 4), 3) * 0.65;
    colors[i * 3] = color.r * brightness;
    colors[i * 3 + 1] = color.g * brightness;
    colors[i * 3 + 2] = color.b * brightness;

  }

  return { positions, colors };
}

/**
 * Deep sky. A dimmed Milky Way plate carries the galactic band and dust, and a
 * separate point layer adds resolved, colour-varied, softly scintillating stars
 * in front of it — the plate alone reads as flat wallpaper at this scale.
 */
export function Starfield() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const stars = useMemo(createStars, []);
  const sprite = useMemo(createStarSprite, []);
  const material = useRef<THREE.PointsMaterial>(null);

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

  // Atmospheric scintillation is not visible from space, but a very slight
  // collective breathing keeps the sky from looking frozen.
  useFrame((state) => {
    if (material.current) material.current.opacity = 0.88 + Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
  });

  return (
    <group>
      {texture && (
        <mesh>
          <sphereGeometry args={[SKY_RADIUS, 64, 32]} />
          {/* Tinted well below white: the plate is context, the point stars and
              the planets are the subject. */}
          <meshBasicMaterial map={texture} color="#39456b" side={THREE.BackSide} toneMapped={false} depthWrite={false} />
        </mesh>
      )}

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[stars.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={material}
          map={sprite}
          alphaMap={sprite}
          vertexColors
          size={220}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
