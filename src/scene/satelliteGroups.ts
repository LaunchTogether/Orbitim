import { create } from 'zustand';

export interface SatelliteGroup {
  /** CelesTrak group id, passed straight to the TLE service. */
  id: string;
  name: string;
  color: string;
  /** Loaded on the first approach to Earth without being asked for. */
  defaultOn: boolean;
}

/**
 * Constellations and object classes that can be drawn around Earth. Each entry
 * maps to one CelesTrak element set; nothing here is synthetic.
 */
export const SATELLITE_GROUPS: readonly SatelliteGroup[] = [
  { id: 'stations', name: 'Space stations', color: '#fbbf24', defaultOn: true },
  { id: 'starlink', name: 'Starlink', color: '#7dd3fc', defaultOn: true },
  { id: 'oneweb', name: 'OneWeb', color: '#c4b5fd', defaultOn: false },
  { id: 'gps', name: 'GPS', color: '#4ade80', defaultOn: true },
  { id: 'glonass', name: 'GLONASS', color: '#f87171', defaultOn: false },
  { id: 'galileo', name: 'Galileo', color: '#60a5fa', defaultOn: false },
  { id: 'beidou', name: 'BeiDou', color: '#fb923c', defaultOn: false },
  { id: 'iridium-NEXT', name: 'Iridium NEXT', color: '#a3e635', defaultOn: false },
  { id: 'geo', name: 'Geostationary', color: '#f0abfc', defaultOn: false },
  { id: 'weather', name: 'Weather', color: '#5eead4', defaultOn: false },
  { id: 'science', name: 'Science', color: '#e879f9', defaultOn: false },
  { id: 'resource', name: 'Earth observation', color: '#facc15', defaultOn: false },
  { id: 'brightest', name: 'Brightest', color: '#ffffff', defaultOn: false },
  { id: 'debris_iridium', name: 'Iridium 33 debris', color: '#94a3b8', defaultOn: false }
];

interface SatelliteState {
  /** Group ids currently drawn. */
  enabled: string[];
  /** Loaded object count per group, for the panel readout. */
  counts: Record<string, number>;
  toggle: (id: string) => void;
  setCount: (id: string, count: number) => void;
}

export const useSatelliteGroups = create<SatelliteState>((set) => ({
  enabled: SATELLITE_GROUPS.filter((g) => g.defaultOn).map((g) => g.id),
  counts: {},
  toggle: (id) =>
    set((s) => ({
      enabled: s.enabled.includes(id) ? s.enabled.filter((g) => g !== id) : [...s.enabled, id]
    })),
  setCount: (id, count) => set((s) => ({ counts: { ...s.counts, [id]: count } }))
}));

export function getSatelliteGroup(id: string): SatelliteGroup {
  const group = SATELLITE_GROUPS.find((g) => g.id === id);
  if (!group) throw new Error(`Unknown satellite group: ${id}`);
  return group;
}
