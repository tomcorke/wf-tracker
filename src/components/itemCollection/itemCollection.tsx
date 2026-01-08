import { useShallow } from "zustand/shallow";
import { Item } from "../item";
import { ItemWithPrime } from "../item/item";
import STYLES from "./itemCollection.module.css";
import { useDataStore } from "../storage/data-store";
import { DataSet } from "../../data-types";

type ItemCollectionProps<K extends string, T> = {
  itemDataSet: DataSet<K, T>;
  title: string;
  filter?: string;
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
      items.reduce(
        (count, item) =>
          count + (state.itemStates[item.uniqueName]?.mastered ? 1 : 0),
        0
      )
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
}: ItemCollectionProps<K, T>) => {
  const useFilter = filter && filter.trim().length > 0;

  const { items, primes } = itemDataSet;

  const filteredItems = useFilter
    ? items.filter((item) =>
        item.name.toLowerCase().includes((filter || "").toLowerCase())
      )
    : items;

  const collectionHasPrimes = filteredItems.some(isPrime);

  if (!collectionHasPrimes) {
    return (
      <div className={STYLES.ItemCollection}>
        <div className={STYLES.title}>
          <span>{title}</span>
          <CollectionCounter items={items} />
        </div>
        {filteredItems.map((item) => (
          <Item
            key={item.uniqueName}
            uniqueName={item.uniqueName}
            displayName={item.name}
          />
        ))}
      </div>
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
    <div className={STYLES.ItemCollection}>
      <div className={STYLES.title}>
        <span>{title}</span>
        <CollectionCounter items={filteredItems} />
      </div>
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
    </div>
  );
};
