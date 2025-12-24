import { useShallow } from "zustand/shallow";
import { DataSet } from "../../data-types";
import { Item } from "../item";
import { ItemWithPrime } from "../item/item";
import STYLES from "./itemCollection.module.css";
import { useDataStore } from "../storage/data-store";

type ItemCollectionProps<K extends string, T> = {
  items: DataSet<K, T>;
  title: string;
};

const isPrime = <T extends { name: string }>(item: T): boolean =>
  item.name.endsWith(" Prime");

const CollectionCounter = <K extends string, T extends { name: string }>({
  items,
}: {
  items: DataSet<K, T>;
}) => {
  const totalItems = items.itemNames.length;

  const masteredCount = useDataStore(
    useShallow((state) =>
      items.itemNames.reduce(
        (count, name) => count + (state.itemStates[name]?.mastered ? 1 : 0),
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

export const ItemCollection = <K extends string, T extends { name: string }>({
  items,
  title,
}: ItemCollectionProps<K, T>) => {
  const collectionHasPrimes = items.itemNames.some((name) => isPrime({ name }));

  if (!collectionHasPrimes) {
    return (
      <div className={STYLES.ItemCollection}>
        <div className={STYLES.title}>
          <span>{title}</span>
          <CollectionCounter items={items} />
        </div>
        {items.itemNames.map((name) => (
          <Item key={name} name={name} />
        ))}
      </div>
    );
  }

  const baseItems = items.itemNames
    .map((name) => items.itemsByName[name] as T)
    .filter(
      (item) =>
        !isPrime(item) ||
        !Array.from(items.primes?.values() || []).some((p) => p === item)
    );

  return (
    <div className={STYLES.ItemCollection}>
      <div className={STYLES.title}>
        <span>{title}</span>
        <CollectionCounter items={items} />
      </div>
      {baseItems.map((baseItem) => {
        const primeItem = items.primes?.get(baseItem);
        if (primeItem) {
          return (
            <ItemWithPrime
              key={baseItem.name}
              baseName={baseItem.name}
              primeName={primeItem.name}
            />
          );
        } else {
          return <Item key={baseItem.name} name={baseItem.name} />;
        }
      })}
    </div>
  );
};
