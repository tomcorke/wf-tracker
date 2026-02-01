import { JSX, useMemo } from "react";
import { getItemRecipeParts } from "../../processed-data/itemRecipes";
import { ItemState, useDataStore, useItemData } from "../storage/data-store";
import STYLES from "./item.module.css";
import classNames from "classnames";
import { PropsWithChildren, useCallback, useState } from "react";
import { getItemSources } from "../../processed-data/itemSources";
import relicStates from "../../processed-data/relic-states.json";
import { useFavourites } from "../storage/favourites";
import { MultiStateCheckbox } from "../multiStateCheckbox";
import { ItemDetails } from "../itemDetails";

const formatName = (name: string) => {
  return name.replace("<ARCHWING>", "");
};

const openWikiForItem = (itemName: string) => {
  const url = new URL(`https://wiki.warframe.com/?search=${itemName}`);
  window.open(url.toString(), "_blank");
};

const BaseItem = ({ children }: PropsWithChildren<{}>) => (
  <div className={STYLES.ItemWrapper}>{children}</div>
);

type RichItemState = { mastered?: boolean };

const ItemComponent = ({
  itemName,
  display,
  itemState,
  setItemState,
  className,
  onClick,
  onMouseEnter,
}: {
  itemName: string;
  display: string | JSX.Element;
  itemState: RichItemState;
  setItemState: (itemName: string, newState: Partial<ItemState>) => void;
  className: string;
  onClick: (event: React.MouseEvent<unknown, MouseEvent>) => void;
  onMouseEnter?: (event: React.MouseEvent<unknown, MouseEvent>) => void;
}) => {
  const { isFavourite, toggleFavourite } = useFavourites();

  return (
    <div
      className={classNames(STYLES.ItemComponent, className, {
        [STYLES.mastered]: itemState.mastered,
      })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div
        className={classNames(STYLES.name, {
          [STYLES.favourite]: isFavourite(itemName),
        })}
        onClick={(e) => {
          if (e.shiftKey) {
            toggleFavourite(itemName);
            e.preventDefault();
            e.stopPropagation();
            window.getSelection()?.empty();
            return false;
          }
        }}
      >
        {typeof display == "string" ? formatName(display) : display}
      </div>
      <div className={STYLES.controls}>
        {/* <input
          type="checkbox"
          className={STYLES.checkbox}
          checked={!!itemState.mastered}
          readOnly
          onClick={(e) => {
            setItemState(itemName, { mastered: !itemState.mastered });
            e.stopPropagation();
            return false;
          }}
        /> */}
        <MultiStateCheckbox
          states={["empty", "checked"]}
          value={itemState.mastered ? "checked" : "empty"}
          onChange={(newValue) => {
            setItemState(
              itemName,
              newValue === "checked" ? "mastered" : undefined,
            );
          }}
        />
      </div>
    </div>
  );
};

type ItemProps = {
  uniqueName: string;
  displayName: string;
};

const getPrimeStatus = (uniqueName: string, displayName: string) => {
  if (!displayName.includes("Prime")) {
    return { isPrimeVaulted: false, isInPrimeResurgence: false };
  }
  const itemSources = getItemRecipeParts(uniqueName)
    .map((part) => getItemSources(part.uniqueName, part.name))
    .flat();
  const isPrimeVaulted = itemSources.every(
    (source) =>
      source.type === "relicRewards" &&
      relicStates[source.source[0] as keyof typeof relicStates] === "vaulted",
  );
  const isInPrimeResurgence = itemSources.some(
    (source) =>
      source.type === "relicRewards" &&
      relicStates[source.source[0] as keyof typeof relicStates] ===
        "resurgence",
  );

  return { isPrimeVaulted, isInPrimeResurgence };
};

export const Item = ({ uniqueName, displayName }: ItemProps) => {
  const itemState = useItemData(uniqueName);

  const { isPrimeVaulted, isInPrimeResurgence } = useMemo(
    () => getPrimeStatus(uniqueName, displayName),
    [uniqueName, displayName],
  );

  const setItemState = useDataStore((store) => store.setItemState);

  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = useCallback(
    () => setShowDetails((prev) => !prev),
    [],
  );

  const { toggleFavourite } = useFavourites();

  const detailsContent = (
    <ItemDetails
      uniqueName={uniqueName}
      displayName={displayName}
      isVaulted={isPrimeVaulted}
      isInPrimeResurgence={isInPrimeResurgence}
      onToggleFavourite={() => toggleFavourite(uniqueName)}
    />
  );

  return (
    <BaseItem>
      <ItemComponent
        itemName={uniqueName}
        display={displayName}
        itemState={itemState}
        setItemState={setItemState}
        className={classNames(STYLES.Item, {
          [STYLES.vaulted]: isPrimeVaulted,
          [STYLES.primeResurgence]: isInPrimeResurgence,
        })}
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
  const baseItemState = useItemData(baseUniqueName);
  const primeItemState = useItemData(primeUniqueName);

  // const isPrimeVaulted = vaultedPrimeItems.has(primeDisplayName);
  // const isInPrimeResurgence = primeResurgenceItems.has(primeDisplayName);

  const { isPrimeVaulted, isInPrimeResurgence } = useMemo(
    () => getPrimeStatus(primeUniqueName, primeDisplayName),
    [primeUniqueName, primeDisplayName],
  );

  const setItemState = useDataStore((store) => store.setItemState);

  const [detailsState, setDetailsState] = useState<"none" | "base" | "prime">(
    "none",
  );

  const toggleBaseDetails = useCallback(() => {
    setDetailsState((prev) => (prev === "base" ? "none" : "base"));
  }, []);

  const togglePrimeDetails = useCallback(() => {
    setDetailsState((prev) => (prev === "prime" ? "none" : "prime"));
  }, []);

  const { toggleFavourite } = useFavourites();

  const baseDetailsContent = (
    <ItemDetails
      uniqueName={baseUniqueName}
      displayName={baseDisplayName}
      onToggleFavourite={() => toggleFavourite(baseUniqueName)}
    />
  );
  const primeDetailsContent = (
    <ItemDetails
      uniqueName={primeUniqueName}
      displayName={primeDisplayName}
      isVaulted={isPrimeVaulted}
      isInPrimeResurgence={isInPrimeResurgence}
      onToggleFavourite={() => toggleFavourite(primeUniqueName)}
    />
  );

  const detailsContent =
    detailsState === "base"
      ? baseDetailsContent
      : detailsState === "prime"
        ? primeDetailsContent
        : null;

  const showDetails = detailsContent !== null;

  return (
    <BaseItem>
      <div className={classNames(STYLES.Item, STYLES.split)}>
        <ItemComponent
          itemName={baseUniqueName}
          display={baseDisplayName}
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
          display={"Prime"}
          itemState={primeItemState}
          setItemState={setItemState}
          className={classNames(STYLES.splitItemSection, {
            [STYLES.vaulted]: isPrimeVaulted,
            [STYLES.primeResurgence]: isInPrimeResurgence,
          })}
          onClick={(e) => {
            if (e.ctrlKey || e.metaKey || e.shiftKey) {
              return openWikiForItem(primeDisplayName);
            }
            togglePrimeDetails();
          }}
        />
      </div>
      {showDetails ? detailsContent : null}
    </BaseItem>
  );
};
