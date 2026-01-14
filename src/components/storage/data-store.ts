import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

import { WARFRAMES } from "../../processed-data/warframes";
import { PRIMARYWEAPONS } from "../../processed-data/primaryWeapons";
import { SECONDARYWEAPONS } from "../../processed-data/secondaryWeapons";
import { MELEEWEAPONS } from "../../processed-data/meleeWeapons";
import { ARCHWINGS } from "../../processed-data/archwings";
import { ARCHWINGGUNS } from "../../processed-data/archwingGuns";
import { ARCHWINGMELEE } from "../../processed-data/archwingMelee";
import { SENTINELS } from "../../processed-data/sentinels";
import { NECRAMECHS } from "../../processed-data/necramechs";
import { SENTINELWEAPONS } from "../../processed-data/sentinelWeapons";
import { ZAWS } from "../../processed-data/zaws";

const datasets = [
  WARFRAMES,
  PRIMARYWEAPONS,
  SECONDARYWEAPONS,
  MELEEWEAPONS,
  ARCHWINGS,
  ARCHWINGGUNS,
  ARCHWINGMELEE,
  SENTINELS,
  NECRAMECHS,
  SENTINELWEAPONS,
  ZAWS,
] as any[];

export type ItemState = {
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

        // Temporary migrate from old names to new
        // assume argument name is uniqueName.
        // if any keys exist in state.itemStates that don't start with a '/', do migration
        // by matching those names with their new unique names, and copying their data

        if (Object.keys(state.itemStates).some((key) => !key.startsWith("/"))) {
          console.log("Migrating old item state to new uniqueNames");
          const migratedItemStates = {} as any;

          for (const [key, value] of Object.entries(state.itemStates)) {
            if (key && !key.startsWith("/") && key !== "undefined") {
              // find matching new uniqueName

              const _key = key.replace("<ARCHWING> ", "").trim();

              const matchingItem: any = datasets
                .map((dataset) => Object.values(dataset.itemsByName))
                .flat()
                .find((item: any) => item.name === _key);
              if (matchingItem && matchingItem.uniqueName) {
                migratedItemStates[matchingItem.uniqueName] = value;
              } else {
                console.log(datasets);

                throw Error(
                  `Could not find matching uniqueName for item name ${key}`
                );
              }
            }
          }

          set({
            itemStates: {
              ...migratedItemStates,
              [itemName]: { ...migratedItemStates[itemName], ...newState },
            },
          });
          return;
        }

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
