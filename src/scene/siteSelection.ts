import { create } from 'zustand';
import type { SurfaceSite } from '../data/missions';
import { useSatelliteSelection } from './satelliteSelection';

interface SiteSelectionState {
  /** Id of the site whose dossier the info panel is showing, if any. */
  selected: string | null;
  select: (site: SurfaceSite) => void;
  clear: () => void;
}

/**
 * Which landing site is being read about. Only the id is kept: the record it
 * names lives in the exploration data and is looked up where it is shown, so a
 * panel can never be caught displaying one mission's date beside another's name.
 */
export const useSiteSelection = create<SiteSelectionState>((set) => ({
  selected: null,
  select: (site) => {
    // A satellite and a landing site are read in the same panel, so picking one
    // has to let go of the other.
    useSatelliteSelection.getState().clear();
    set({ selected: site.id });
  },
  clear: () => set({ selected: null })
}));
