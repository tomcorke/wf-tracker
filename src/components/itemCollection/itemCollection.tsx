import { useShallow } from "zustand/shallow";
import { Item } from "../item";
import { ItemWithPrime } from "../item/item";
import STYLES from "./itemCollection.module.css";
import { useDataStore } from "../storage/data-store";
import { DataSet } from "../../data-types";
import { Section } from "../section";
import { useFavourites } from "../storage/favourites";

type ItemCollectionProps<K extends string, T> = {
  itemDataSet: DataSet<K, T>;
  title: string;
  filter?: string;
  showOnlyFavourites?: boolean;
  groupBy?: (item: T) => string;
};

const isPrime = <T extends { name: string }>(item: T): boolean =>
  item.name.endsWith(" Prime");

const CollectionCounter = <T extends { uniqueName: string }>({
  items,
}: {
  items: T[];
}) => {
  const totalItems = items.length;

  const masteredCount = useDataStore(
    useShallow((state) =>
      items.reduce((count, item) => {
        const value = state.itemStates[item.uniqueName];
        const isMastered =
          value === "mastered" ||
          (typeof value === "object" && (value as any)?.mastered);
        return count + (isMastered ? 1 : 0);
      }, 0)
    )
  );

  return (
    <span className={STYLES.CollectionCounter}>
      {masteredCount}/{totalItems}
    </span>
  );
};

export const ItemCollection = <
  K extends string,
  T extends { uniqueName: string; name: string }
>({
  itemDataSet,
  title,
  filter,
  groupBy,
  showOnlyFavourites,
}: ItemCollectionProps<K, T>) => {
  const useFilter = filter && filter.trim().length > 0;

  const { items, primes } = itemDataSet;

  let filteredItems = useFilter
    ? items.filter((item) =>
        item.name.toLowerCase().includes((filter || "").toLowerCase())
      )
    : items;

  const { favourites } = useFavourites();

  if (showOnlyFavourites) {
    filteredItems = filteredItems.filter((item) =>
      favourites.includes(item.uniqueName)
    );
  }

  if (groupBy) {
    filteredItems = filteredItems.sort((a, b) =>
      groupBy(a).localeCompare(groupBy(b))
    );
  }

  const baseItems = items
    .filter(
      (item) =>
        !isPrime(item) ||
        !Array.from(primes?.values() || []).some((p) => p === item)
    )
    .filter((item) => {
      if (primes) {
        const primeItem = primes.get(item);
        if (primeItem && filteredItems.includes(primeItem)) {
          return true;
        }
      }
      return filteredItems.includes(item);
    });

  return (
    <Section
      title={
        <>
          <span>{title}</span>
          <CollectionCounter items={filteredItems} />
        </>
      }
      removePadding
    >
      {baseItems.map((baseItem) => {
        const primeItem = primes?.get(baseItem);
        if (primeItem) {
          return (
            <ItemWithPrime
              key={baseItem.name}
              baseUniqueName={baseItem.uniqueName}
              baseDisplayName={baseItem.name}
              primeUniqueName={primeItem.uniqueName}
              primeDisplayName={primeItem.name}
            />
          );
        } else {
          return (
            <Item
              key={baseItem.name}
              uniqueName={baseItem.uniqueName}
              displayName={baseItem.name}
            />
          );
        }
      })}
    </Section>
  );
};
