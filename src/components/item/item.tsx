import { ItemState, useDataStore, useItemData } from "../storage/data-store";
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
  onClick,
}: {
  itemName: string;
  displayName?: string;
  itemState: ItemState;
  setItemState: (itemName: string, newState: Partial<ItemState>) => void;
  className: string;
  onClick: (event: React.MouseEvent<unknown, MouseEvent>) => void;
}) => (
  <div
    className={classNames(className, {
      [STYLES.mastered]: itemState.mastered,
    })}
    onClick={onClick}
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
  const { itemState } = useItemData(name);

  const setItemState = useDataStore((store) => store.setItemState);

  return (
    <BaseItem>
      <ItemComponent
        itemName={name}
        itemState={itemState}
        setItemState={setItemState}
        className={STYLES.Item}
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey || e.shiftKey) {
            return openWikiForItem(name);
          }
        }}
      />
      {/* <div className={STYLES.ItemDetails}>Item details</div> */}
    </BaseItem>
  );
};

type ItemWithPrimeProps = {
  baseName: string;
  primeName: string;
};

export const ItemWithPrime = ({ baseName, primeName }: ItemWithPrimeProps) => {
  const { itemState: baseItemState } = useItemData(baseName);
  const { itemState: primeItemState } = useItemData(primeName);

  const setItemState = useDataStore((store) => store.setItemState);

  return (
    <BaseItem>
      <div className={classNames(STYLES.Item, STYLES.split)}>
        <ItemComponent
          itemName={baseName}
          itemState={baseItemState}
          setItemState={setItemState}
          className={STYLES.splitItemSection}
          onClick={(e) => {
            if (e.ctrlKey || e.metaKey || e.shiftKey) {
              return openWikiForItem(baseName);
            }
          }}
        />
        <ItemComponent
          itemName={primeName}
          displayName={"Prime"}
          itemState={primeItemState}
          setItemState={setItemState}
          className={STYLES.splitItemSection}
          onClick={(e) => {
            if (e.ctrlKey || e.metaKey || e.shiftKey) {
              return openWikiForItem(primeName);
            }
          }}
        />
      </div>
      {/* <div className={STYLES.ItemDetails}>Prime Item Details</div> */}
    </BaseItem>
  );
};
