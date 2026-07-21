import { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { getBodyRecord, type BodyId } from '../lib/ephemeris/bodies';
import { getBodyState } from '../lib/ephemeris/positions';
import { heliocentricToScene } from '../lib/scale';

/** Orbital periods in days, used only to sample one full revolution. */
const PERIOD_DAYS: Record<string, number> = {
  mercury: 87.97,
  venus: 224.7,
  earth: 365.256,
  mars: 686.98,
  jupiter: 4332.59,
  saturn: 10759.22,
  uranus: 30688.5,
  neptune: 60182
};

interface OrbitPathProps {
  id: BodyId;
  /** Instant the path is sampled around; the trace itself is time-independent. */
  date: Date;
  highlighted: boolean;
}

/**
 * The traced path is the body's real orbit, sampled from the ephemeris across
 * one full period and passed through the same scale transform as the body, so
 * the planet always sits exactly on its own line.
 */
export function OrbitPath({ id, date, highlighted }: OrbitPathProps) {
  const record = getBodyRecord(id);

  const points = useMemo(() => {
    const period = PERIOD_DAYS[id];
    if (!period) return null;
    const samples = 512;
    const traced: THREE.Vector3[] = [];
    for (let i = 0; i <= samples; i++) {
      const sampleDate = new Date(date.getTime() + (i / samples) * period * 86400000);
      const [x, y, z] = heliocentricToScene(getBodyState(id, sampleDate).heliocentric);
      traced.push(new THREE.Vector3(x, y, z));
    }
    return traced;
    // The trace is recomputed only when the body changes; a fixed epoch keeps
    // the line stable while simulated time runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!points) return null;

  return (
    <Line
      points={points}
      color={record.color}
      transparent
      opacity={highlighted ? 0.6 : 0.18}
      lineWidth={highlighted ? 1.4 : 1}
      depthWrite={false}
    />
  );
}
