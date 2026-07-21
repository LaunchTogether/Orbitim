import { EffectComposer, Bloom, SMAA, Vignette } from '@react-three/postprocessing';

/**
 * Cinematic grade. Bloom carries the Sun and the city lights, SMAA cleans the
 * limbs and the orbit lines that hardware antialiasing is turned off for, and
 * the vignette pulls focus to the centre. Deliberately restrained — the scene
 * is the subject, the grade is not.
 */
export function Effects() {
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom intensity={0.55} luminanceThreshold={0.82} luminanceSmoothing={0.3} mipmapBlur />
      <Vignette eskil={false} offset={0.26} darkness={0.7} />
      <SMAA />
    </EffectComposer>
  );
}
