import { getItemRecipeParts } from "../../processed-data/itemRecipes";
import { Button } from "../button";
import { ItemState, useDataStore, useItemData } from "../storage/data-store";
import STYLES from "./item.module.css";
import classNames from "classnames";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { getItemSources } from "../../processed-data/itemSources";

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
  displayName: string;
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
    <div className={STYLES.name}>{formatName(displayName)}</div>
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

type ItemProps = {
  uniqueName: string;
  displayName: string;
};

const formatIngredients = (
  ingredients: { uniqueName: string; name: string }[]
) => {
  if (ingredients.length === 0) {
    return <div className={STYLES.ingredientList}>No recipe for item</div>;
  }
  return (
    <div className={STYLES.ingredientList}>
      <div className={STYLES.ingredientListTitle}>
        <span>Blueprints/Parts:</span>
        <Button>track</Button>
      </div>
      <ul>
        {ingredients.map((ingredient, i) => (
          <>
            <li key={`${ingredient.uniqueName}_${i}`}>{ingredient.name}</li>
            {/* <li
              style={{
                font: "9px monospace",
                wordBreak: "break-word",
                opacity: 0.7,
              }}
            >
              {ingredient.uniqueName}
            </li> */}
          </>
        ))}
      </ul>
    </div>
  );
};

const formatSources = (sources: { source: string[]; type: string }[]) => {
  if (sources.length === 0) {
    return (
      <div className={STYLES.sourceList}>
        No known drop sources for item, possibly available from vendor
      </div>
    );
  }
  return (
    <div className={STYLES.sourceList}>
      <div className={STYLES.sourceListTitle}>Sources:</div>
      <ul>
        {sources.map((source, index) => (
          <li key={index}>
            {source.source.join(" > ")}
            {/* ({source.type}) */}
          </li>
        ))}
      </ul>
    </div>
  );
};

const formatDetails = (uniqueName: string) => {
  const ingredients = formatIngredients(getItemRecipeParts(uniqueName));
  const sources = formatSources(
    getItemRecipeParts(uniqueName).flatMap((part) =>
      getItemSources(part.uniqueName)
    )
  );
  return (
    <>
      {ingredients}
      {sources}
      <div
        style={{ font: "9px monospace", wordBreak: "break-word", opacity: 0.7 }}
      >
        {uniqueName}
      </div>
    </>
  );
};

export const Item = ({ uniqueName, displayName }: ItemProps) => {
  const { itemState } = useItemData(uniqueName);

  const setItemState = useDataStore((store) => store.setItemState);

  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = useCallback(
    () => setShowDetails((prev) => !prev),
    []
  );

  const detailsContent = useMemo(() => formatDetails(uniqueName), [uniqueName]);

  return (
    <BaseItem>
      <ItemComponent
        itemName={uniqueName}
        displayName={displayName}
        itemState={itemState}
        setItemState={setItemState}
        className={STYLES.Item}
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey || e.shiftKey) {
            return openWikiForItem(displayName);
          }
          toggleShowDetails();
        }}
      />
      {showDetails ? (
        <div className={STYLES.ItemDetails}>{detailsContent}</div>
      ) : null}
    </BaseItem>
  );
};

type ItemWithPrimeProps = {
  baseUniqueName: string;
  baseDisplayName: string;
  primeUniqueName: string;
  primeDisplayName: string;
};

export const ItemWithPrime = ({
  baseUniqueName,
  baseDisplayName,
  primeUniqueName,
  primeDisplayName,
}: ItemWithPrimeProps) => {
  const { itemState: baseItemState } = useItemData(baseUniqueName);
  const { itemState: primeItemState } = useItemData(primeUniqueName);

  const setItemState = useDataStore((store) => store.setItemState);

  const [detailsState, setDetailsState] = useState<"none" | "base" | "prime">(
    "none"
  );

  const toggleBaseDetails = useCallback(() => {
    setDetailsState((prev) => (prev === "base" ? "none" : "base"));
  }, []);

  const togglePrimeDetails = useCallback(() => {
    setDetailsState((prev) => (prev === "prime" ? "none" : "prime"));
  }, []);

  const detailsContent = useMemo(
    () =>
      detailsState === "base"
        ? formatDetails(baseUniqueName)
        : detailsState === "prime"
        ? formatDetails(primeUniqueName)
        : null,
    [detailsState, baseUniqueName, primeUniqueName]
  );

  const showDetails = detailsContent !== null;

  return (
    <BaseItem>
      <div className={classNames(STYLES.Item, STYLES.split)}>
        <ItemComponent
          itemName={baseUniqueName}
          displayName={baseDisplayName}
          itemState={baseItemState}
          setItemState={setItemState}
          className={STYLES.splitItemSection}
          onClick={(e) => {
            if (e.ctrlKey || e.metaKey || e.shiftKey) {
              return openWikiForItem(baseDisplayName);
            }
            toggleBaseDetails();
          }}
        />
        <ItemComponent
          itemName={primeUniqueName}
          displayName={"Prime"}
          itemState={primeItemState}
          setItemState={setItemState}
          className={STYLES.splitItemSection}
          onClick={(e) => {
            if (e.ctrlKey || e.metaKey || e.shiftKey) {
              return openWikiForItem(primeDisplayName);
            }
            togglePrimeDetails();
          }}
        />
      </div>
      {showDetails ? (
        <div className={STYLES.ItemDetails}>{detailsContent}</div>
      ) : null}
    </BaseItem>
  );
};
