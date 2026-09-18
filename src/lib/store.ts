import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EventItem, SectorId } from "@/data/types";

interface CabinetState {
  sectors: SectorId[];
  query: string;
  selectedEventId: string | null;
  starred: string[];
  notes: Record<string, string>;
  forecasts: EventItem[];
  learnedNames: string[];
  /** Toggle a single desk. Does not drag neighbouring sectors. */
  toggleSector: (id: SectorId) => void;
  /** Jump to exactly one desk (dropdown). */
  setOnlySector: (id: SectorId | null) => void;
  clearSectors: () => void;
  setQuery: (q: string) => void;
  selectEvent: (id: string | null) => void;
  toggleStar: (id: string) => void;
  setNote: (id: string, note: string) => void;
  addForecast: (event: EventItem) => void;
}

export const useCabinet = create<CabinetState>()(
  persist(
    (set, get) => ({
      sectors: [],
      query: "",
      selectedEventId: null,
      starred: [],
      notes: {},
      forecasts: [],
      learnedNames: [],
      toggleSector: (id) => {
        const cur = get().sectors;
        set({ sectors: cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id] });
      },
      setOnlySector: (id) => set({ sectors: id ? [id] : [] }),
      clearSectors: () => set({ sectors: [] }),
      setQuery: (query) => set({ query }),
      selectEvent: (selectedEventId) => set({ selectedEventId }),
      toggleStar: (id) => {
        const cur = get().starred;
        set({ starred: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
      },
      setNote: (id, note) => set({ notes: { ...get().notes, [id]: note } }),
      addForecast: (event) => {
        const names = event.entities.filter(Boolean);
        set({
          forecasts: [event, ...get().forecasts].slice(0, 200),
          learnedNames: [...new Set([...names, ...get().learnedNames])].slice(0, 80),
        });
      },
    }),
    {
      name: "cabinet-editorial",
      skipHydration: true,
      partialize: (s) => ({
        starred: s.starred,
        notes: s.notes,
        forecasts: s.forecasts,
        learnedNames: s.learnedNames,
      }),
    },
  ),
);
