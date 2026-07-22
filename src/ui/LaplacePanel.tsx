import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { moonDirection } from '../lib/ephemeris/positions';
import type { BodyId } from '../lib/ephemeris/bodies';
import { useFlight } from '../flight/useFlight';
import { useSimTime } from '../scene/useSimTime';
import { useViewSettings } from '../scene/viewSettings';

/**
 * Reads out the Laplace resonance while the camera is at Jupiter or a Galilean.
 * The libration argument λ(Io) − 3·λ(Europa) + 2·λ(Ganymede) is computed live
 * from the moons' real bearings and hovers around 180°, the signature of the
 * lock; the scene draws the matching lines (see scene/LaplaceResonance).
 */

const DEG = Math.PI / 180;
// Jupiter's IAU north pole (EQJ), defining the plane the longitudes are read in.
const POLE_RA = 268.057 * DEG;
const POLE_DEC = 64.495 * DEG;
const POLE = new THREE.Vector3(Math.cos(POLE_DEC) * Math.cos(POLE_RA), Math.cos(POLE_DEC) * Math.sin(POLE_RA), Math.sin(POLE_DEC));
const NODE_AXIS = new THREE.Vector3(-POLE.y, POLE.x, 0).normalize();
const Y_AXIS = new THREE.Vector3().crossVectors(POLE, NODE_AXIS);
const ACTIVE_TARGETS: readonly (BodyId | null)[] = ['jupiter', 'io', 'europa', 'ganymede', 'callisto'];

function longitude(id: BodyId, date: Date): number {
  const d = moonDirection(id, date);
  if (!d) return 0;
  return Math.atan2(
    d.x * Y_AXIS.x + d.y * Y_AXIS.y + d.z * Y_AXIS.z,
    d.x * NODE_AXIS.x + d.y * NODE_AXIS.y + d.z * NODE_AXIS.z
  );
}

export function LaplacePanel() {
  const target = useFlight((s) => s.target);
  const phase = useFlight((s) => s.phase);
  const light = useViewSettings((s) => s.theme === 'light');
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((t) => t + 1), 250);
    return () => window.clearInterval(timer);
  }, []);

  if (phase === 'overview' || !ACTIVE_TARGETS.includes(target)) return null;

  const date = useSimTime.getState().date;
  let phi = (longitude('io', date) - 3 * longitude('europa', date) + 2 * longitude('ganymede', date)) / DEG;
  phi = ((phi % 360) + 360) % 360;

  return (
    <div
      className={`pointer-events-none fixed left-1/2 top-[4.5rem] z-20 -translate-x-1/2 rounded-xl border px-4 py-2.5 text-center backdrop-blur-md md:top-8 ${
        light ? 'border-slate-300/60 bg-white/70 text-slate-700' : 'border-amber-300/25 bg-black/55 text-white'
      }`}
    >
      <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-amber-300/90">Laplace resonance</div>
      <div className="mt-0.5 text-[13px] tracking-wide">Io : Europa : Ganymede = 1 : 2 : 4</div>
      <div className={`mt-1 text-[11px] ${light ? 'text-slate-500' : 'text-white/55'}`}>
        λ<sub>Io</sub> − 3λ<sub>Eu</sub> + 2λ<sub>Ga</sub> ={' '}
        <span className="tabular-nums text-amber-300">{phi.toFixed(1)}°</span>{' '}
        <span className="text-white/35">≈ 180° · locked</span>
      </div>
    </div>
  );
}
