import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

export type ItemState = string | undefined;

type TrackerDataStore = {
  itemStates: Record<string, ItemState>;
  setItemState: (itemName: string, newState: Partial<ItemState>) => void;
  lastUpdated?: number;
};

export const useDataStore = create<TrackerDataStore>()(
  persist(
    (set, get) => ({
      itemStates: {},
      setItemState: (itemName: string, newState: Partial<ItemState>) => {
        const state = get();

        console.log("Setting item state", itemName, newState);

        const newStateUpdateTime = Date.now();

        set({
          itemStates: {
            ...state.itemStates,
            [itemName]: newState,
          },
          lastUpdated: newStateUpdateTime,
        });
      },
    }),
    { name: "wf-tracker-data-store" },
  ),
);

export const useItemData = (itemName: string) => {
  const itemState = useDataStore(
    useShallow((store) => store.itemStates[itemName]),
  );

  const mastered =
    itemState === "mastered" ||
    (typeof itemState === "object" && (itemState as any)?.mastered);

  return { mastered };
};
