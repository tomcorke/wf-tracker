import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

export type ItemState = string | undefined;

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

        // Migrate old states to new
        // if they are currently stored in the format

        console.log("Setting item state", itemName, newState);
        set({
          itemStates: {
            ...state.itemStates,
            [itemName]: newState,
          },
        });
      },
    }),
    { name: "wf-tracker-data-store" }
  )
);

export const useItemData = (itemName: string) => {
  const itemState = useDataStore(
    useShallow((store) => store.itemStates[itemName])
  );

  const mastered =
    itemState === "mastered" ||
    (typeof itemState === "object" && (itemState as any)?.mastered);

  return { mastered };
};
