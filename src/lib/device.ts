/**
 * Device capabilities, read once at module load. None of these answers change
 * while the page is open, so nothing here is reactive: viewport size, which
 * does change, is handled by media queries in the UI instead.
 */

/** True when the primary input is a finger rather than a mouse. */
export const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches;

/** Rough memory ceiling in GB. Chromium only; undefined means unknown. */
const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

/**
 * Rendering budget.
 *
 * An 8K surface map decodes to roughly 268 MB of GPU memory, and a phone that
 * is handed two of them drops the WebGL context rather than swapping. The low
 * tier therefore keeps the 2K maps, drops the separate cloud and night-lights
 * shells, halves the pixel budget and skips the full-screen antialiasing pass.
 */
export const graphicsTier: 'low' | 'high' =
  isTouchPrimary || (deviceMemory !== undefined && deviceMemory <= 4) ? 'low' : 'high';

/** Upper bound on the device pixel ratio the canvas renders at. */
export const maxPixelRatio = graphicsTier === 'low' ? 1.5 : 2;
