import { useEffect, useState } from 'react';
import { useSimTime } from '../scene/useSimTime';

const SPEEDS = [
  { label: '1×', value: 1 },
  { label: '1 h/s', value: 3600 },
  { label: '1 d/s', value: 86400 },
  { label: '1 mo/s', value: 2592000 }
];

/**
 * Simulated clock. The scene is time-driven end to end, so scrubbing the
 * multiplier moves every body along its real orbit rather than animating a
 * decorative loop.
 */
export function TimeControls() {
  const playing = useSimTime((s) => s.playing);
  const multiplier = useSimTime((s) => s.multiplier);
  const togglePlaying = useSimTime((s) => s.togglePlaying);
  const setMultiplier = useSimTime((s) => s.setMultiplier);
  const resetToNow = useSimTime((s) => s.resetToNow);
  const [stamp, setStamp] = useState('');

  useEffect(() => {
    const render = () => setStamp(useSimTime.getState().date.toISOString().replace('T', ' ').slice(0, 19));
    render();
    const timer = window.setInterval(render, 200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="pointer-events-auto fixed bottom-4 left-1/2 z-20 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-3 overflow-x-auto whitespace-nowrap rounded-full border border-white/10 bg-black/55 px-4 py-2 backdrop-blur-xl md:bottom-6 md:gap-4 md:px-5 md:py-2.5">
      <button
        type="button"
        onClick={togglePlaying}
        aria-label={playing ? 'Pause simulated time' : 'Resume simulated time'}
        className="text-[11px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-sky-200"
      >
        {playing ? 'Pause' : 'Play'}
      </button>

      <span className="whitespace-nowrap text-[12px] tabular-nums tracking-wide text-white/80">{stamp} UTC</span>

      <div className="flex shrink-0 items-center gap-1">
        {SPEEDS.map((speed) => (
          <button
            key={speed.value}
            type="button"
            onClick={() => setMultiplier(speed.value)}
            aria-pressed={multiplier === speed.value}
            className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.16em] transition-colors ${
              multiplier === speed.value ? 'bg-sky-300/15 text-sky-200' : 'text-white/40 hover:text-white/80'
            }`}
          >
            {speed.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={resetToNow}
        className="text-[10px] uppercase tracking-[0.16em] text-white/40 transition-colors hover:text-sky-200"
      >
        Now
      </button>
    </div>
  );
}
