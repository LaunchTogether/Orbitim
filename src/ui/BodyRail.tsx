import { ALL_BODIES, getBodyRecord } from '../lib/ephemeris/bodies';
import { useFlight } from '../flight/useFlight';

const ORDER = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as const;

/**
 * The only always-visible control. A vertical rail of the primary bodies; moons
 * are reached from their planet's info panel rather than crowding the rail.
 */
export function BodyRail() {
  const target = useFlight((s) => s.target);
  const flyTo = useFlight((s) => s.flyTo);
  const returnToOverview = useFlight((s) => s.returnToOverview);

  return (
    <nav
      aria-label="Solar system bodies"
      className="pointer-events-auto fixed left-6 top-1/2 z-20 -translate-y-1/2"
    >
      <ul className="flex flex-col gap-1">
        <li>
          <button
            type="button"
            onClick={returnToOverview}
            className={`group flex w-full items-center gap-3 rounded-full px-3 py-2 text-left transition-colors ${
              target === null ? 'text-sky-200' : 'text-white/45 hover:text-white/85'
            }`}
          >
            <span className="h-px w-6 bg-current opacity-60" aria-hidden />
            <span className="text-[11px] font-medium uppercase tracking-[0.22em]">System</span>
          </button>
        </li>

        {ORDER.map((id) => {
          const record = getBodyRecord(id);
          const active = target === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => flyTo(id)}
                aria-current={active ? 'true' : undefined}
                className={`group flex w-full items-center gap-3 rounded-full px-3 py-2 text-left transition-colors ${
                  active ? 'text-sky-200' : 'text-white/45 hover:text-white/85'
                }`}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full transition-transform group-hover:scale-150"
                  style={{ backgroundColor: record.color }}
                  aria-hidden
                />
                <span className="text-[11px] font-medium uppercase tracking-[0.22em]">{record.name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 px-3 text-[10px] uppercase tracking-[0.18em] text-white/25">
        {ALL_BODIES.length} bodies · live ephemeris
      </p>
    </nav>
  );
}
