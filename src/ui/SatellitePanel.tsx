import { useState } from 'react';
import { useFlight } from '../flight/useFlight';
import { SATELLITE_GROUPS, useSatelliteGroups } from '../scene/satelliteGroups';

/**
 * Constellation switchboard. Only meaningful while the camera is at Earth, so
 * it appears with the satellite layer itself and never competes with the system
 * view for space.
 */
export function SatellitePanel() {
  const target = useFlight((s) => s.target);
  const phase = useFlight((s) => s.phase);
  const enabled = useSatelliteGroups((s) => s.enabled);
  const counts = useSatelliteGroups((s) => s.counts);
  const toggle = useSatelliteGroups((s) => s.toggle);
  const [open, setOpen] = useState(true);

  if (target !== 'earth' || phase === 'overview') return null;

  const total = enabled.reduce((sum, id) => sum + (counts[id] ?? 0), 0);

  return (
    <section
      aria-label="Satellite constellations"
      /* Bottom left on desktop: the info panel owns the right column and the
         body rail ends above this, so the three never overlap. */
      className="pointer-events-auto fixed bottom-20 left-4 z-20 w-56 rounded-2xl border border-white/10 bg-black/55 backdrop-blur-xl md:bottom-24 md:left-6"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-sky-200"
      >
        <span>Satellites</span>
        <span className="tabular-nums text-white/35">{total.toLocaleString('en-US')}</span>
      </button>

      {open && (
        <ul className="max-h-[46vh] overflow-y-auto px-2 pb-2">
          {SATELLITE_GROUPS.map((group) => {
            const active = enabled.includes(group.id);
            return (
              <li key={group.id}>
                <button
                  type="button"
                  onClick={() => toggle(group.id)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[11px] tracking-wide transition-colors ${
                    active ? 'text-white/90' : 'text-white/35 hover:text-white/70'
                  }`}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full transition-opacity"
                    style={{ backgroundColor: group.color, opacity: active ? 1 : 0.25 }}
                    aria-hidden
                  />
                  <span className="flex-1 truncate">{group.name}</span>
                  {active && counts[group.id] !== undefined && (
                    <span className="tabular-nums text-[10px] text-white/30">{counts[group.id]}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
