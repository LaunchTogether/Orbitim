import { create } from 'zustand';

interface SimTimeState {
  /** Simulated instant, advanced every frame while playing. */
  date: Date;
  playing: boolean;
  /** Simulated seconds per real second. */
  multiplier: number;
  advance: (realSeconds: number) => void;
  setDate: (date: Date) => void;
  setMultiplier: (multiplier: number) => void;
  togglePlaying: () => void;
  resetToNow: () => void;
}

export const useSimTime = create<SimTimeState>((set, get) => ({
  date: new Date(),
  playing: true,
  multiplier: 1,
  advance: (realSeconds) => {
    const { playing, multiplier, date } = get();
    if (!playing) return;
    set({ date: new Date(date.getTime() + realSeconds * multiplier * 1000) });
  },
  setDate: (date) => set({ date }),
  setMultiplier: (multiplier) => set({ multiplier }),
  togglePlaying: () => set((s) => ({ playing: !s.playing })),
  resetToNow: () => set({ date: new Date() })
}));
