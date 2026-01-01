import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

export type ItemState = {
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

export const useItemData = (itemName: string) => {
  const itemState = useDataStore(
    useShallow((store) => store.itemStates[itemName] || {})
  );

  // Find some details to show for this item
  const itemDetails = {}; // Replace with actual logic to find item details

  return { itemState, itemDetails };
};
