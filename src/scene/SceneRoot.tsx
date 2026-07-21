import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { SolarSystem } from './SolarSystem';
import { Effects } from './Effects';

/**
 * WebGL host. Nothing above this component knows about three.js; nothing below
 * it touches the DOM.
 */
export function SceneRoot() {
  return (
    <Canvas
      camera={{ position: [0, 340, 720], fov: 45, near: 0.01, far: 80000 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      frameloop="always"
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.85;
      }}
    >
      <Suspense fallback={null}>
        <SolarSystem />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
