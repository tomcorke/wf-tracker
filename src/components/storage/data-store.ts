import { create } from "zustand";
import { persist } from "zustand/middleware";

type ItemState = {
  owned: boolean;
  wanted: boolean;
  mastered: boolean;
};

type TrackerDataStore = {
  itemStates: Record<string, ItemState>;
  setItemState: (itemName: string, newState: Partial<ItemState>) => void;
};

export const useDataStore = create<TrackerDataStore>()(
  persist(
    (set, get) => ({
      itemStates: {},
      setItemState: (itemName: string, newState: Partial<ItemState>) => {
        const state = get();
        console.log("Setting item state", itemName, newState);
        set({
          itemStates: {
            ...state.itemStates,
            [itemName]: { ...state.itemStates[itemName], ...newState },
          },
        });
      },
    }),
    { name: "wf-tracker-data-store" }
  )
);
