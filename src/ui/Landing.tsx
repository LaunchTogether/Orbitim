import { useEffect, useState } from 'react';
import { ALL_BODIES } from '../lib/ephemeris/bodies';
import { auToKm, getBodyState } from '../lib/ephemeris/positions';

interface LandingProps {
  onEnter: () => void;
}

const CAPABILITIES = [
  {
    label: 'Ephemeris',
    title: 'Positions, not animations',
    body: 'Every body sits where VSOP87 says it is for the instant on the clock. Scrub the clock to 2031 and the alignment is the one the sky will actually hold.'
  },
  {
    label: 'Propagation',
    title: 'Satellites from live elements',
    body: 'CelesTrak orbital elements, SGP4 propagated in your browser at frame rate. No polling, no API key, no invented telemetry.'
  },
  {
    label: 'Surfaces',
    title: 'Eight thousand pixels wide',
    body: 'NASA-derived imagery streams in as you approach, and is released as you leave. Clouds, city lights and ring systems included.'
  }
];

/**
 * Opening screen. It sits over the live scene rather than in front of a still
 * image, so the first thing the visitor sees is the thing itself — and entering
 * is a fade, not a page load.
 */
export function Landing({ onEnter }: LandingProps) {
  const [leaving, setLeaving] = useState(false);
  const [distance, setDistance] = useState<string>('');

  useEffect(() => {
    const render = () => {
      const km = auToKm(getBodyState('mars', new Date()).distanceFromEarthAU);
      setDistance(Math.round(km).toLocaleString('en-US'));
    };
    render();
    const timer = window.setInterval(render, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const leave = () => {
    setLeaving(true);
    window.setTimeout(onEnter, 700);
  };

  return (
    <div
      className={`pointer-events-auto fixed inset-0 z-30 flex flex-col justify-between bg-gradient-to-b from-black via-black/85 to-black/95 px-8 py-10 transition-opacity duration-700 md:px-16 md:py-14 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <header className="flex items-baseline justify-between">
        <span className="text-[13px] font-medium uppercase tracking-[0.42em] text-white">Orbitim</span>
        <span className="hidden text-[10px] uppercase tracking-[0.24em] text-white/35 sm:block">
          {ALL_BODIES.length} bodies · real time
        </span>
      </header>

      <main className="max-w-3xl">
        <h1 className="text-[clamp(2.6rem,7vw,5.5rem)] font-extralight leading-[0.95] tracking-[-0.03em] text-white">
          The solar system,
          <br />
          <span className="text-sky-200/90">as it stands right now.</span>
        </h1>

        <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/55">
          Every planet, its major moons, the rings and thousands of live satellites — placed by real
          orbital mechanics rather than by hand. Fly to any world and read what we know about it today.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={leave}
            className="group relative overflow-hidden rounded-full border border-sky-200/30 px-8 py-3 text-[11px] uppercase tracking-[0.28em] text-sky-100 transition-colors hover:border-sky-200/70 hover:text-white"
          >
            Enter the system
          </button>

          <p className="text-[11px] uppercase tracking-[0.16em] text-white/30">
            Mars is {distance} km away as you read this
          </p>
        </div>
      </main>

      <footer className="grid gap-8 border-t border-white/8 pt-8 md:grid-cols-3 md:gap-12">
        {CAPABILITIES.map((capability) => (
          <section key={capability.label}>
            <span className="text-[10px] uppercase tracking-[0.24em] text-sky-300/60">{capability.label}</span>
            <h2 className="mt-2 text-[15px] font-normal text-white/90">{capability.title}</h2>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/40">{capability.body}</p>
          </section>
        ))}
      </footer>
    </div>
  );
}
