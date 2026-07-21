import { getBodyRecord, type BodyId } from './bodies';

/** J2000.0 epoch, the reference instant for all spin angles. */
const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0);

/**
 * Spin angle of a body about its own axis at the given instant, radians.
 * Retrograde rotators carry a negative rotation period and therefore a
 * decreasing angle.
 */
export function getSpinAngle(id: BodyId, date: Date): number {
  const { rotationHours } = getBodyRecord(id);
  const elapsedHours = (date.getTime() - J2000_MS) / 3600000;
  const turns = elapsedHours / rotationHours;
  return turns * 2 * Math.PI;
}

/** Obliquity of the body's rotation axis, radians. */
export function getAxialTilt(id: BodyId): number {
  return (getBodyRecord(id).axialTiltDeg * Math.PI) / 180;
}
