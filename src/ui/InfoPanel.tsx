import { useEffect, useState } from 'react';
import { getBodyRecord, getMoonsOf } from '../lib/ephemeris/bodies';
import { auToKm, auToLightMinutes, getBodyState } from '../lib/ephemeris/positions';
import { BODY_FACTS } from '../data/bodyFacts';
import { useFlight } from '../flight/useFlight';
import { useSimTime } from '../scene/useSimTime';

function formatKm(km: number): string {
  return `${Math.round(km).toLocaleString('en-US')} km`;
}

interface RowProps {
  label: string;
  value: string;
}

function Row({ label, value }: RowProps) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-white/5 py-2 last:border-b-0">
      <dt className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</dt>
      <dd className="text-right text-[13px] tabular-nums text-white/85">{value}</dd>
    </div>
  );
}

/**
 * Body dossier. Static constants come from the fact sheet; the live block is
 * recomputed from the ephemeris once a second, and states plainly when a value
 * is undefined for the body rather than substituting a placeholder.
 */
export function InfoPanel() {
  const target = useFlight((s) => s.target);
  const phase = useFlight((s) => s.phase);
  const flyTo = useFlight((s) => s.flyTo);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!target || phase !== 'orbiting') return null;

  const record = getBodyRecord(target);
  const facts = BODY_FACTS[target];
  const state = getBodyState(target, useSimTime.getState().date);
  const moons = getMoonsOf(target);

  return (
    <aside className="pointer-events-auto fixed right-6 top-1/2 z-20 w-[22rem] max-w-[calc(100vw-3rem)] -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-black/45 p-6 backdrop-blur-xl max-h-[80vh]">
      <header className="mb-5">
        <span className="text-[10px] uppercase tracking-[0.28em] text-sky-300/70">{record.kind}</span>
        <h2 className="mt-1 text-2xl font-light tracking-tight text-white">{record.name}</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-white/50">{facts.tagline}</p>
      </header>

      <section className="mb-5">
        <h3 className="mb-1 text-[10px] uppercase tracking-[0.22em] text-white/30">Right now</h3>
        <dl>
          {target !== 'earth' && (
            <>
              <Row label="Distance from Earth" value={formatKm(auToKm(state.distanceFromEarthAU))} />
              <Row label="Light travel time" value={`${auToLightMinutes(state.distanceFromEarthAU).toFixed(1)} min`} />
            </>
          )}
          <Row label="Distance from Sun" value={formatKm(auToKm(state.distanceFromSunAU))} />
          <Row
            label="Apparent magnitude"
            value={state.magnitude === null ? 'not defined' : state.magnitude.toFixed(2)}
          />
          <Row
            label="Illuminated"
            value={state.phaseFraction === null ? 'not defined' : `${(state.phaseFraction * 100).toFixed(1)} %`}
          />
        </dl>
      </section>

      <section className="mb-5">
        <h3 className="mb-1 text-[10px] uppercase tracking-[0.22em] text-white/30">Fact sheet</h3>
        <dl>
          <Row label="Mean radius" value={formatKm(record.radiusKm)} />
          <Row label="Mass" value={facts.massKg} />
          <Row label="Surface gravity" value={facts.gravity} />
          <Row label="Mean temperature" value={facts.meanTemp} />
          <Row label="Axial tilt" value={`${record.axialTiltDeg}°`} />
          <Row label="Day length" value={facts.dayLength} />
          {facts.yearLength && <Row label="Orbital period" value={facts.yearLength} />}
          {facts.moons !== null && <Row label="Known moons" value={String(facts.moons)} />}
          <Row label="Atmosphere" value={facts.atmosphere} />
        </dl>
      </section>

      <section className="mb-5">
        <h3 className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/30">Active missions</h3>
        <ul className="flex flex-wrap gap-1.5">
          {facts.activeMissions.map((mission) => (
            <li
              key={mission}
              className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/60"
            >
              {mission}
            </li>
          ))}
        </ul>
      </section>

      {moons.length > 0 && (
        <section>
          <h3 className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/30">Moons in view</h3>
          <ul className="flex flex-wrap gap-1.5">
            {moons.map((moon) => (
              <li key={moon.id}>
                <button
                  type="button"
                  onClick={() => flyTo(moon.id)}
                  className="rounded-full border border-sky-300/20 px-2.5 py-1 text-[11px] text-sky-200/80 transition-colors hover:border-sky-300/50 hover:text-sky-100"
                >
                  {moon.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-6 text-[10px] leading-relaxed text-white/25">
        Positions from VSOP87 via astronomy-engine. Constants from the NASA Planetary Fact Sheet.
      </p>
    </aside>
  );
}
