import { JSX, Suspense, use } from "react";
import { getItemRecipeParts } from "../../processed-data/itemRecipes";
// import { Button } from "../button";
import { ItemState, useDataStore, useItemData } from "../storage/data-store";
import STYLES from "./item.module.css";
import classNames from "classnames";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { getItemSources } from "../../processed-data/itemSources";
import {
  primeResurgenceItems,
  vaultedPrimeItems,
} from "../../processed-data/vaulted-items";
import {
  useWarframeMarket,
  WarframeMarketDataStore,
} from "../storage/warframe-market";
import relicStates from "../../processed-data/relic-states.json";

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
}) => (
  <div
    className={classNames(className, {
      [STYLES.mastered]: itemState.mastered,
    })}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
  >
    <div className={STYLES.name}>
      {typeof display == "string" ? formatName(display) : display}
    </div>
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

const transformSourceSections = (section: string): string | JSX.Element => {
  if (/^\w+ \([0-9]{1,2}\.[0-9]{2}%\)$/.test(section)) {
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

const priceFetchPromises: Record<
  string,
  Promise<Awaited<ReturnType<WarframeMarketDataStore["getItemSetPrice"]>>>
> = {};

const PriceDisplay = ({ uniqueName }: { uniqueName: string }) => {
  const { getItemSetPrice } = useWarframeMarket();
  if (!priceFetchPromises[uniqueName]) {
    priceFetchPromises[uniqueName] = getItemSetPrice(uniqueName);
    setTimeout(() => delete priceFetchPromises[uniqueName], 5 * 60 * 1000); // cache for 5 minutes
  }
  const priceResult = use(priceFetchPromises[uniqueName]);
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

const SimplePriceDisplay = ({
  uniqueName,
  useSet = true,
}: {
  uniqueName: string;
  useSet?: boolean;
}) => {
  const { getItemSetPrice, getItemPrice } = useWarframeMarket();
  const priceCacheKey = useSet ? `<SET>${uniqueName}` : uniqueName;
  const getPriceFunction = useSet ? getItemSetPrice : getItemPrice;
  if (!priceFetchPromises[priceCacheKey]) {
    priceFetchPromises[priceCacheKey] = getPriceFunction(uniqueName);
    setTimeout(() => delete priceFetchPromises[priceCacheKey], 5 * 60 * 1000); // cache for 5 minutes
  }
  const priceResult = use(priceFetchPromises[priceCacheKey]);
  return (
    <span className={STYLES.priceDisplay}>
      {priceResult === "item-not-found" || !priceResult ? null : priceResult ===
        "no-sell-orders" ? (
        "No sell orders found"
      ) : (
        <span className={STYLES.priceValue}>{priceResult.price}p</span>
      )}
    </span>
  );
};

const formatDetails = (uniqueName: string, displayName: string) => {
  // old version to display all sources after all ingredients
  // const ingredients = formatIngredients(getItemRecipeParts(uniqueName));
  // const sources = formatSources([
  //   ...getItemSources(uniqueName, displayName),
  //   ...getItemRecipeParts(uniqueName).flatMap((part) =>
  //     getItemSources(part.uniqueName, part.name)
  //   ),
  // ]);
  // return (
  //   <>
  //     {ingredients}
  //     {sources}
  //     <div
  //       style={{ font: "9px monospace", wordBreak: "break-word", opacity: 0.7 }}
  //     >
  //       {uniqueName}
  //     </div>
  //   </>
  // );

  // now we want to display sources for whole item
  // then per ingredient:
  //   list ingredient
  //   sources for ingredient

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
              <SimplePriceDisplay uniqueName={part.uniqueName} useSet={false} />
            </Suspense>
          </div>
          {formattedPartSources}
        </li>
      );
    }
  );

  const isVaulted = vaultedPrimeItems.has(displayName) ? (
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

  const isInPrimeResurgence = primeResurgenceItems.has(displayName) ? (
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
      {isVaulted}
      {isInPrimeResurgence}
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

export const Item = ({ uniqueName, displayName }: ItemProps) => {
  const { itemState } = useItemData(uniqueName);

  const isVaulted = vaultedPrimeItems.has(displayName);
  const isInPrimeResurgence = primeResurgenceItems.has(displayName);

  const setItemState = useDataStore((store) => store.setItemState);

  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = useCallback(
    () => setShowDetails((prev) => !prev),
    []
  );

  const detailsContent = useMemo(
    () => formatDetails(uniqueName, displayName),
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
          [STYLES.vaulted]: isVaulted,
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

  const isPrimeVaulted = vaultedPrimeItems.has(primeDisplayName);
  const isInPrimeResurgence = primeResurgenceItems.has(primeDisplayName);

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
        ? formatDetails(baseUniqueName, baseDisplayName)
        : detailsState === "prime"
        ? formatDetails(primeUniqueName, primeDisplayName)
        : null,
    [detailsState, baseUniqueName, primeUniqueName]
  );

  const showDetails = detailsContent !== null;

  const [showPriceInTitle, setShowPriceInTitle] = useState(false);

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
          display={
            showPriceInTitle ? (
              <>
                Prime: <SimplePriceDisplay uniqueName={primeUniqueName} />
              </>
            ) : (
              "Prime"
            )
          }
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
          onMouseEnter={(e) => {
            if (e.shiftKey) {
              setShowPriceInTitle(true);
            }
          }}
        />
      </div>
      {showDetails ? (
        <div className={STYLES.ItemDetails}>{detailsContent}</div>
      ) : null}
    </BaseItem>
  );
};
