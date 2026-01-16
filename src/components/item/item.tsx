import { JSX, Suspense, use } from "react";
import { getItemRecipeParts } from "../../processed-data/itemRecipes";
// import { Button } from "../button";
import { ItemState, useDataStore, useItemData } from "../storage/data-store";
import STYLES from "./item.module.css";
import classNames from "classnames";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { getItemSources } from "../../processed-data/itemSources";
import { useWarframeMarket } from "../storage/warframe-market";
import relicStates from "../../processed-data/relic-states.json";
import { InlinePrice } from "../inlinePrice";
import { useFavourites } from "../storage/favourites";
import { MultiStateCheckbox } from "../multiStateCheckbox";

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
  itemState: ItemState;
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
            setItemState(itemName, { mastered: newValue === "checked" });
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

const transformSourceSections = (section: string): string | JSX.Element => {
  if (/^.+ \([0-9]{1,2}\.[0-9]{2}%\)$/.test(section)) {
    return section.match(/([0-9]{1,2}\.[0-9]{2}%)/)![1];
  }
  if (/ Relic$/.test(section)) {
    const relicState = relicStates[section as keyof typeof relicStates];
    if (relicState) {
      if (relicState === "vaulted") {
        return (
          <span className={classNames(STYLES.sourceRelic, STYLES.vaulted)}>
            {section}
          </span>
        );
      } else if (relicState === "resurgence") {
        return (
          <span
            className={classNames(STYLES.sourceRelic, STYLES.primeResurgence)}
          >
            {section}
          </span>
        );
      }
    }
  }
  return section;
};

const interleave = <T,>(arr: T[], separator: T): T[] => {
  return arr.flatMap((item, index) =>
    index < arr.length - 1 ? [item, separator] : [item]
  );
};

type Source<T> = { source: T[]; type: string };
const formatSources = (sources: Source<string>[]) => {
  if (sources.length === 0) {
    return <div className={STYLES.sourceList}>No sources in known data</div>;
  }

  const mappedSources: Source<string | JSX.Element>[] = [];
  const uniqueMainSources = new Set<string>();
  for (const source of sources) {
    let mainSourceKey = source.source[0];
    if (/^Rotation [A-Z]$/.test(source.source[1])) {
      mainSourceKey += `|${source.source[1]}`;
    }
    const transformed = source.source.map(transformSourceSections);
    if (!uniqueMainSources.has(mainSourceKey)) {
      mappedSources.push({ source: transformed, type: source.type });
      uniqueMainSources.add(mainSourceKey);
    }
  }

  return (
    <div className={STYLES.sourceList}>
      {/* <div className={STYLES.sourceListTitle}>Sources:</div> */}
      <ul>
        {mappedSources.map((source, index) => (
          <li key={index}>
            {interleave(
              source.source,
              <span className={STYLES.sourceSeparator}> &gt; </span>
            )}
            {/* ({source.type}) */}
          </li>
        ))}
      </ul>
    </div>
  );
};

const PriceDisplay = ({ uniqueName }: { uniqueName: string }) => {
  const { getItemSetPrice } = useWarframeMarket();
  const priceResult = use(getItemSetPrice(uniqueName));
  return (
    <div className={STYLES.priceDisplay}>
      {priceResult === "item-not-found" || !priceResult ? null : priceResult ===
        "no-sell-orders" ? (
        "No sell orders found"
      ) : (
        <>
          Lowest set price:{" "}
          <span className={STYLES.priceValue}>{priceResult.price}p</span>
          <div className={STYLES.warframeMarketLink}>
            <a href={priceResult.url} target="_blank" rel="noopener noreferrer">
              View on Warframe Market
            </a>
          </div>
        </>
      )}
    </div>
  );
};

const formatDetails = (
  uniqueName: string,
  displayName: string,
  isVaulted: boolean,
  isInPrimeResurgence: boolean,
  isFavourite: boolean,
  toggleFavourite: () => void
) => {
  const itemSources = getItemSources(uniqueName, displayName);
  const formattedItemSources = formatSources(itemSources);
  const itemParts = getItemRecipeParts(uniqueName);
  const itemPartSources = itemParts.map((part) => ({
    part,
    sources: getItemSources(part.uniqueName, part.name),
  }));

  const ingredientElements = itemPartSources.map(
    ({ part, sources: partSources }, i) => {
      const formattedPartSources = formatSources(partSources);
      return (
        <li
          key={`${part.uniqueName}_section_${i}`}
          className={STYLES.ingredientSection}
        >
          <div className={STYLES.ingredientName}>
            <span>{part.name}</span>
            <Suspense fallback={<span>...</span>}>
              <InlinePrice uniqueName={part.uniqueName} useSet={false} />
            </Suspense>
          </div>
          {formattedPartSources}
        </li>
      );
    }
  );

  const vaultedDisplay = isVaulted ? (
    <div className={STYLES.vaultedIndicator}>
      In{" "}
      <a
        href="https://wiki.warframe.com/w/Prime_Vault"
        target="_blank"
        rel="noopener noreferrer"
      >
        Prime Vault
      </a>
    </div>
  ) : null;

  const primeResurgenceDisplay = isInPrimeResurgence ? (
    <div className={STYLES.primeResurgenceIndicator}>
      Currently available in{" "}
      <a
        href="https://wiki.warframe.com/w/Prime_Resurgence"
        target="_blank"
        rel="noopener noreferrer"
      >
        Prime Resurgence
      </a>
    </div>
  ) : null;

  return (
    <>
      <div className={STYLES.favouriteToggle} onClick={() => toggleFavourite()}>
        {isFavourite ? "★ Marked as Favourite" : "☆ Mark as Favourite"}
      </div>
      {vaultedDisplay}
      {primeResurgenceDisplay}
      <div className={STYLES.priceContainer}>
        <Suspense fallback={<span>Fetching price...</span>}>
          <PriceDisplay uniqueName={uniqueName} />
        </Suspense>
      </div>
      {itemSources.length > 0 || ingredientElements.length === 0
        ? formattedItemSources
        : null}
      {ingredientElements.length > 0 ? (
        <div className={STYLES.ingredientList}>
          <div className={STYLES.ingredientListTitle}>Blueprints/Parts:</div>
          <ul>{ingredientElements}</ul>
        </div>
      ) : null}
      <div className={STYLES.meta}>{uniqueName}</div>
    </>
  );
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
      relicStates[source.source[0] as keyof typeof relicStates] === "vaulted"
  );
  const isInPrimeResurgence = itemSources.some(
    (source) =>
      source.type === "relicRewards" &&
      relicStates[source.source[0] as keyof typeof relicStates] === "resurgence"
  );

  return { isPrimeVaulted, isInPrimeResurgence };
};

export const Item = ({ uniqueName, displayName }: ItemProps) => {
  const { itemState } = useItemData(uniqueName);

  const { isPrimeVaulted, isInPrimeResurgence } = getPrimeStatus(
    uniqueName,
    displayName
  );

  const setItemState = useDataStore((store) => store.setItemState);

  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = useCallback(
    () => setShowDetails((prev) => !prev),
    []
  );

  const { isFavourite, toggleFavourite } = useFavourites();

  const detailsContent = useMemo(
    () =>
      formatDetails(
        uniqueName,
        displayName,
        isPrimeVaulted,
        isInPrimeResurgence,
        isFavourite(uniqueName),
        () => toggleFavourite(uniqueName)
      ),
    [uniqueName, displayName]
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
  const { itemState: baseItemState } = useItemData(baseUniqueName);
  const { itemState: primeItemState } = useItemData(primeUniqueName);

  // const isPrimeVaulted = vaultedPrimeItems.has(primeDisplayName);
  // const isInPrimeResurgence = primeResurgenceItems.has(primeDisplayName);

  const { isPrimeVaulted, isInPrimeResurgence } = getPrimeStatus(
    primeUniqueName,
    primeDisplayName
  );

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

  const { isFavourite, toggleFavourite } = useFavourites();

  const detailsContent = useMemo(
    () =>
      detailsState === "base"
        ? formatDetails(
            baseUniqueName,
            baseDisplayName,
            false,
            false,
            isFavourite(baseUniqueName),
            () => toggleFavourite(baseUniqueName)
          )
        : detailsState === "prime"
        ? formatDetails(
            primeUniqueName,
            primeDisplayName,
            isPrimeVaulted,
            isInPrimeResurgence,
            isFavourite(primeUniqueName),
            () => toggleFavourite(primeUniqueName)
          )
        : null,
    [detailsState, baseUniqueName, primeUniqueName]
  );

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
      {showDetails ? (
        <div className={STYLES.ItemDetails}>{detailsContent}</div>
      ) : null}
    </BaseItem>
  );
};
