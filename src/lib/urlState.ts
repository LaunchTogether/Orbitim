/**
 * The shareable part of the scene's state, carried in the URL hash so a link is
 * a specific moment: this instant, at this rate, with these constellations.
 * Positions are never stored — they are always recomputed from the instant — so
 * a link stays true however the ephemeris behind it is refined.
 */
export interface ShareState {
  date: Date;
  multiplier: number;
  playing: boolean;
  groups: string[] | null;
}

/**
 * Reads the hash into a partial state. Every field is optional and validated:
 * a hand-edited or stale link falls back to the live defaults rather than
 * throwing.
 */
export function readShareState(): Partial<ShareState> & { present: boolean } {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return { present: false };
  const params = new URLSearchParams(hash);

  const result: Partial<ShareState> & { present: boolean } = { present: true };

  const t = params.get('t');
  if (t) {
    const parsed = new Date(t);
    if (!Number.isNaN(parsed.getTime())) result.date = parsed;
  }

  const r = params.get('r');
  if (r) {
    const value = Number(r);
    if (Number.isFinite(value) && value > 0) result.multiplier = value;
  }

  const p = params.get('p');
  if (p === '0' || p === '1') result.playing = p === '1';

  const g = params.get('g');
  if (g) result.groups = g.split(',').filter(Boolean);

  return result;
}

/** Serialises the state into a hash string (without the leading #). */
export function serializeShareState(state: ShareState): string {
  const params = new URLSearchParams();
  // Whole-second precision: a shared instant does not need milliseconds, and the
  // shorter string is friendlier to paste.
  params.set('t', state.date.toISOString().replace(/\.\d+Z$/, 'Z'));
  if (state.multiplier !== 1) params.set('r', String(state.multiplier));
  if (!state.playing) params.set('p', '0');
  if (state.groups) params.set('g', state.groups.join(','));
  return params.toString();
}

/** The full URL for the current state, for copying to the clipboard. */
export function shareUrl(state: ShareState): string {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#${serializeShareState(state)}`;
}

/** Writes the hash without adding a history entry, so Back is not polluted. */
export function replaceShareState(state: ShareState): void {
  const hash = serializeShareState(state);
  window.history.replaceState(null, '', `${window.location.pathname}#${hash}`);
}
