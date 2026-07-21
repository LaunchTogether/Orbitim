import { useEffect, useState } from 'react';

/**
 * Subscribes to a media query. Used where a layout difference cannot be
 * expressed in CSS alone — a bottom sheet that only collapses on a phone, a
 * panel that becomes a modal rather than a sidebar.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Below the `md` breakpoint: one column, touch-sized targets, sheets not panels. */
export function useIsCompact(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
