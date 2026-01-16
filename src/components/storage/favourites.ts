import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavouritesDataStore = {
  favourites: string[];
  isFavourite(itemUniqueName: string): boolean;
  toggleFavourite(itemUniqueName: string): void;
};

export const useFavourites = create<FavouritesDataStore>()(
  persist(
    (set, get) => ({
      favourites: [],
      isFavourite: (itemUniqueName: string) => {
        const { favourites } = get();
        return !!favourites?.includes(itemUniqueName);
      },
      toggleFavourite: (itemUniqueName: string) => {
        const { favourites } = get();
        const isFav = favourites.includes(itemUniqueName);
        let newFavourites: string[] = [];
        if (isFav) {
          newFavourites = favourites.filter((name) => name !== itemUniqueName);
        } else {
          newFavourites = [...favourites, itemUniqueName];
        }
        set({ favourites: newFavourites });
      },
    }),
    { name: "wf-tracker-favourites" }
  )
);
