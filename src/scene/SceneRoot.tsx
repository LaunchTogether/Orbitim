import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { SolarSystem } from './SolarSystem';
import { Effects } from './Effects';
import { maxPixelRatio } from '../lib/device';
import { useViewSettings } from './viewSettings';

/**
 * Scene clear colour per theme. The light value is kept off pure white on
 * purpose: after the ACES tone map it lands as a clean, bright field the bodies
 * read against, and stays below the bloom threshold so the whole frame does not
 * flare.
 */
const BACKGROUND: Record<'dark' | 'light', string> = {
  dark: '#000000',
  light: '#e7ebf1'
};

/**
 * WebGL host. Nothing above this component knows about three.js; nothing below
 * it touches the DOM.
 */
export function SceneRoot() {
  const theme = useViewSettings((s) => s.theme);
  return (
    <Canvas
      camera={{ position: [0, 340, 720], fov: 45, near: 0.01, far: 80000 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      dpr={[1, maxPixelRatio]}
      frameloop="always"
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.85;
      }}
    >
      <color attach="background" args={[BACKGROUND[theme]]} />
      <Suspense fallback={null}>
        <SolarSystem />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
