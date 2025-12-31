import { useShallow } from "zustand/shallow";
import { ItemState, useDataStore } from "../storage/data-store";
import STYLES from "./item.module.css";
import classNames from "classnames";
import { PropsWithChildren } from "react";

type ItemProps = {
  name: string;
};

const formatName = (name: string) => {
  return name.replace("<ARCHWING>", "");
};

const openWikiForItem = (itemName: string) => {
  const url = new URL(`https://wiki.warframe.com/?search=${itemName}`);
  window.open(url.toString(), "_blank");
};

const BaseItem = ({ children }: PropsWithChildren<{}>) => {
  return <div className={STYLES.ItemWrapper}>{children}</div>;
};

const ItemComponent = ({
  itemName,
  displayName,
  itemState,
  setItemState,
  className,
}: {
  itemName: string;
  displayName?: string;
  itemState: ItemState;
  setItemState: (itemName: string, newState: Partial<ItemState>) => void;
  className: string;
}) => (
  <div
    className={classNames(className, {
      [STYLES.mastered]: itemState.mastered,
    })}
    onClick={(e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        return openWikiForItem(itemName);
      }
    }}
  >
    <div className={STYLES.name}>{formatName(displayName ?? itemName)}</div>
    <div className={STYLES.controls}>
      <input
        type="checkbox"
        className={STYLES.checkbox}
        checked={!!itemState.mastered}
        readOnly
        onClick={(e) => {
          setItemState(itemName, { mastered: !itemState.mastered });
          e.stopPropagation();
          return false;
        }}
      />
    </div>
  </div>
);

export const Item = ({ name }: ItemProps) => {
  const state = useDataStore(
    useShallow((store) => store.itemStates[name] || {})
  );

  const setItemState = useDataStore((store) => store.setItemState);

  return (
    <BaseItem>
      <ItemComponent
        itemName={name}
        itemState={state}
        setItemState={setItemState}
        className={STYLES.Item}
      />
      <div className={STYLES.ItemDetails}>Item details</div>
    </BaseItem>
  );
};

type ItemWithPrimeProps = {
  baseName: string;
  primeName: string;
};

export const ItemWithPrime = ({ baseName, primeName }: ItemWithPrimeProps) => {
  const baseItemState = useDataStore(
    useShallow((store) => store.itemStates[baseName] || {})
  );
  const primeItemState = useDataStore(
    useShallow((store) => store.itemStates[primeName] || {})
  );

  const setItemState = useDataStore((store) => store.setItemState);

  return (
    <BaseItem>
      <div className={classNames(STYLES.Item, STYLES.split)}>
        <ItemComponent
          itemName={baseName}
          itemState={baseItemState}
          setItemState={setItemState}
          className={STYLES.splitItemSection}
        />
        <ItemComponent
          itemName={primeName}
          displayName={"Prime"}
          itemState={primeItemState}
          setItemState={setItemState}
          className={STYLES.splitItemSection}
        />
      </div>
      <div className={STYLES.ItemDetails}>Prime Item Details</div>
    </BaseItem>
  );
};
