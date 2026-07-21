import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

/**
 * Cinematic grade. Bloom carries the Sun and the city lights; the vignette
 * pulls focus to the centre. Deliberately restrained — the scene is the
 * subject, the grade is not.
 */
export function Effects() {
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom intensity={0.9} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur />
      <Vignette eskil={false} offset={0.26} darkness={0.7} />
    </EffectComposer>
  );
}
