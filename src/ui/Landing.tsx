import { useEffect, useMemo, useState } from 'react';
import { ALL_BODIES } from '../lib/ephemeris/bodies';
import { auToKm, auToLightMinutes, getBodyState, getHeliocentric } from '../lib/ephemeris/positions';

interface LandingProps {
  onEnter: () => void;
}

interface Reading {
  label: string;
  value: string;
  unit: string;
}

const AU_KM = 149597870.7;

/**
 * Orbital speed of a body right now, km/s, from a central difference of its
 * own ephemeris. Nothing here is tabulated: change the clock and the number
 * changes with it.
 */
function orbitalSpeedKmS(date: Date): number {
  const step = 60000;
  const before = getHeliocentric('earth', new Date(date.getTime() - step));
  const after = getHeliocentric('earth', new Date(date.getTime() + step));
  const distance = Math.hypot(after.x - before.x, after.y - before.y, after.z - before.z) * AU_KM;
  return distance / ((2 * step) / 1000);
}

function readings(date: Date): Reading[] {
  const mars = getBodyState('mars', date);
  const moon = getBodyState('moon', date);
  const sunLagMinutes = auToLightMinutes(getBodyState('sun', date).distanceFromEarthAU);

  return [
    {
      label: 'Universal time',
      value: date.toISOString().slice(11, 19),
      unit: 'UTC'
    },
    {
      label: 'Earth orbital speed',
      value: orbitalSpeedKmS(date).toFixed(2),
      unit: 'km/s'
    },
    {
      label: 'Range to Mars',
      value: Math.round(auToKm(mars.distanceFromEarthAU) / 1e6).toLocaleString('en-US'),
      unit: 'million km'
    },
    {
      label: 'Range to the Moon',
      value: Math.round(auToKm(moon.distanceFromEarthAU)).toLocaleString('en-US'),
      unit: 'km'
    },
    {
      label: 'Sunlight in transit',
      value: sunLagMinutes.toFixed(1),
      unit: 'minutes old'
    }
  ];
}

const CAPABILITIES = [
  {
    label: 'Ephemeris',
    title: 'Positions, not animations',
    body: 'Every body sits where VSOP87 says it is for the instant on the clock. Scrub to 2031 and the alignment is the one the sky will hold.'
  },
  {
    label: 'Propagation',
    title: 'Satellites from live elements',
    body: 'CelesTrak orbital elements, SGP4 propagated in your browser. Fourteen constellations, switched on and off as you like.'
  },
  {
    label: 'Surfaces',
    title: 'Eight thousand pixels wide',
    body: 'NASA-derived imagery streams in as you approach and is released as you leave. Clouds, city lights, ring shadows and all.'
  }
];

/**
 * Opening screen. It sits over the live scene rather than in front of a still
 * image, so the first thing a visitor sees is the thing itself. The scrim is
 * anchored to the left edge and thins out to the right: the readout stays
 * legible while the system keeps turning in plain view beside it.
 */
export function Landing({ onEnter }: LandingProps) {
  const [leaving, setLeaving] = useState(false);
  const [instant, setInstant] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setInstant(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const telemetry = useMemo(() => readings(instant), [instant]);

  const leave = () => {
    setLeaving(true);
    window.setTimeout(onEnter, 700);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.target === document.body) leave();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`pointer-events-auto fixed inset-0 z-30 overflow-y-auto transition-opacity duration-700 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Scrim: heavy at the left edge where the type sits, gone by two thirds
          across, so the scene is never fully covered. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black via-black/80 to-transparent" aria-hidden />

      <div className="relative flex min-h-full flex-col gap-12 px-6 py-8 md:px-14 md:py-12">
        <header className="rise flex items-center justify-between gap-6">
          <span className="font-mono text-[12px] uppercase tracking-[0.5em] text-white">Orbitim</span>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" aria-hidden />
            Live · {ALL_BODIES.length} bodies
          </span>
        </header>

        <main className="flex max-w-3xl flex-1 flex-col justify-center py-10">
          <p className="rise font-mono text-[10px] uppercase tracking-[0.34em] text-sky-300/70" style={{ animationDelay: '80ms' }}>
            Solar system, observed
          </p>

          <h1
            className="rise mt-5 text-balance text-[clamp(2.4rem,5.6vw,4.8rem)] font-extralight leading-[0.98] tracking-[-0.035em] text-white"
            style={{ animationDelay: '160ms' }}
          >
            Everything up there,
            <br />
            <span className="text-sky-200/90">where it is right now.</span>
          </h1>

          <p
            className="rise mt-7 max-w-lg text-[15px] leading-relaxed text-white/55"
            style={{ animationDelay: '240ms' }}
          >
            Eighteen worlds, their rings and moons, and eleven thousand tracked satellites — placed by
            orbital mechanics rather than by hand. Fly to any of them and read what we know today.
          </p>

          <div className="rise mt-10 flex flex-wrap items-center gap-x-7 gap-y-4" style={{ animationDelay: '320ms' }}>
            <button
              type="button"
              onClick={leave}
              className="sweep relative overflow-hidden rounded-full border border-sky-200/30 px-9 py-3.5 font-mono text-[11px] uppercase tracking-[0.3em] text-sky-100 transition-colors hover:border-sky-200/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
            >
              Enter the system
            </button>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
              or press Enter
            </span>
          </div>
        </main>

        {/* Signature: a live instrument strip. Every figure is computed from the
            ephemeris on the second it is shown, including the ones that never
            appear in a fact sheet — the Earth's own speed around the Sun, and
            how old the sunlight reaching you is. */}
        <section aria-label="Live readings" className="rise" style={{ animationDelay: '400ms' }}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-6 sm:grid-cols-3 lg:grid-cols-5">
            {telemetry.map((reading) => (
              <div key={reading.label}>
                <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/30">{reading.label}</div>
                <div className="mt-1.5 font-mono text-[18px] font-light tabular-nums text-white/90">{reading.value}</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-sky-300/50">{reading.unit}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-7 border-t border-white/8 pt-7 md:grid-cols-3 md:gap-12">
            {CAPABILITIES.map((capability) => (
              <article key={capability.label}>
                <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-white/30">{capability.label}</span>
                <h2 className="mt-2 text-[15px] font-normal text-white/90">{capability.title}</h2>
                <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-white/40">{capability.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
