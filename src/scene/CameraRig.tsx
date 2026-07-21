import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useFlight } from '../flight/useFlight';
import { sceneRadiusOf, type PositionRegistry } from './bodyPositions';

/** Seconds a flight leg takes, regardless of distance travelled. */
const FLIGHT_SECONDS = 2.5;
/** Camera distance when parked at a body, in body radii. */
const ORBIT_RADII = 3.2;
/** Camera position and look-at point of the whole-system view. */
const OVERVIEW_POSITION = new THREE.Vector3(0, 340, 720);

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface CameraRigProps {
  registry: PositionRegistry;
}

/**
 * Single-scene camera. A flight interpolates both the eye point and the look-at
 * point along an arc that lifts out of the ecliptic, so the system sweeps past
 * underneath instead of the camera sliding on a straight line.
 */
export function CameraRig({ registry }: CameraRigProps) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const elapsed = useRef(0);
  const startEye = useRef(new THREE.Vector3());
  const startLook = useRef(new THREE.Vector3());
  const lastTargetPosition = useRef(new THREE.Vector3());
  const arcLift = useRef(new THREE.Vector3());
  const previousPhase = useRef<string>('overview');
  const posed = useRef(false);

  const scratchEye = new THREE.Vector3();
  const scratchLook = new THREE.Vector3();

  useFrame((_, delta) => {
    const { phase, target, setProgress, arrive } = useFlight.getState();
    const orbitControls = controls.current;
    if (!orbitControls) return;

    if (!posed.current) {
      // Claim the overview pose once the controls exist, so the scene always
      // opens on the whole system regardless of the camera the canvas started
      // with.
      camera.position.copy(OVERVIEW_POSITION);
      orbitControls.target.set(0, 0, 0);
      posed.current = true;
    }

    const destinationLook = target ? registry.get(target)!.clone() : new THREE.Vector3(0, 0, 0);
    const destinationDistance = target ? sceneRadiusOf(target) * ORBIT_RADII : OVERVIEW_POSITION.length();

    if (phase === 'flying') {
      if (previousPhase.current !== 'flying') {
        elapsed.current = 0;
        startEye.current.copy(camera.position);
        startLook.current.copy(orbitControls.target);
        // Lift out of the ecliptic proportionally to the distance travelled, so
        // the system sweeps past underneath instead of the camera sliding
        // straight through the orbital planes.
        arcLift.current.set(0, startEye.current.distanceTo(destinationLook) * 0.18, 0);
      }

      elapsed.current += delta;
      const t = Math.min(1, elapsed.current / FLIGHT_SECONDS);
      const eased = easeInOutCubic(t);
      setProgress(eased);

      // Arrive on the sunlit side: the approach vector points from the body back
      // towards the Sun, lifted slightly so the terminator stays in frame.
      const approach = destinationLook.lengthSq() > 0 ? destinationLook : new THREE.Vector3(-1, 0, -1);
      const destinationEye = target
        ? scratchEye
            .copy(approach)
            .negate()
            .normalize()
            .setY(0.35)
            .normalize()
            .multiplyScalar(destinationDistance)
            .add(destinationLook)
        : scratchEye.copy(OVERVIEW_POSITION);

      camera.position.lerpVectors(startEye.current, destinationEye, eased);
      // Quadratic bezier lift, zero at both ends.
      camera.position.addScaledVector(arcLift.current, 4 * eased * (1 - eased));

      scratchLook.lerpVectors(startLook.current, destinationLook, eased);
      orbitControls.target.copy(scratchLook);

      if (t >= 1) arrive();
    } else if (phase === 'orbiting' && target) {
      // Follow the body without fighting the user's orbit input: translate the
      // camera by exactly the body's own motion this frame.
      const current = registry.get(target)!;
      const shift = scratchEye.copy(current).sub(lastTargetPosition.current);
      camera.position.add(shift);
      orbitControls.target.copy(current);
    }

    if (target) lastTargetPosition.current.copy(registry.get(target)!);

    // Keep depth precision usable across eight orders of magnitude of distance.
    const perspective = camera as THREE.PerspectiveCamera;
    const distance = camera.position.distanceTo(orbitControls.target);
    perspective.near = Math.max(0.001, distance * 0.002);
    perspective.far = 80000;
    perspective.updateProjectionMatrix();

    previousPhase.current = phase;
    orbitControls.update();
  });

  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={0.02}
      maxDistance={4000}
      makeDefault
    />
  );
}
