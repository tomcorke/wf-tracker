import { JSX, Suspense } from "react";
import STYLES from "./itemDetails.module.css";
import { PriceDisplay } from "../priceDisplay";
import { InlinePrice } from "../inlinePrice";
import classNames from "classnames";
import relicStates from "../../processed-data/relic-states.json";
import { getItemSources } from "../../processed-data/itemSources";
import { getItemRecipeParts } from "../../processed-data/itemRecipes";
import { PersistentSimpleCheckbox } from "../multiStateCheckbox";
import { OracleData, useOracle } from "../storage/oracle";

const transformSourceSections = (section: string): string | JSX.Element => {
  if (/^\w+ \([0-9]{1,2}\.[0-9]{2}%\)$/.test(section)) {
    return section.match(/(\w+) \(([0-9]{1,2}\.[0-9]{2}%)\)/)![1];
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
    index < arr.length - 1 ? [item, separator] : [item],
  );
};

const getRotationFromSources = (sourceParts: unknown[]): string | null => {
  const rotationStringMap = {
    "Rotation A": "A",
    "Rotation B": "B",
    "Rotation C": "C",
  } as const;

  for (const part of sourceParts) {
    if (typeof part === "string" && part in rotationStringMap) {
      return rotationStringMap[part as keyof typeof rotationStringMap];
    }
  }

  return null;
};

type Source<T> = { source: T[]; type: string };
const formatSources = (
  sources: Source<string>[],
  oracleData: OracleData | null,
) => {
  if (sources.length === 0) {
    return <div className={STYLES.sourceList}>No sources in known data</div>;
  }

  const mappedSources: Source<string | JSX.Element>[] = [];

  const sourcesByRelic = new Map<
    string,
    { source: Source<string>; rate: number }
  >();

  for (const source of sources) {
    if (source.source.some((s) => / Relic$/.test(s))) {
      const relicName = source.source.find((s) => / Relic$/.test(s));
      const dropRateVerbose = source.source.find((s) =>
        /^.+ \([0-9]{1,2}\.[0-9]{2}%\)$/.test(s),
      );
      if (relicName && dropRateVerbose) {
        const dropRateNumeric = dropRateVerbose.match(
          /([0-9]{1,2}\.[0-9]{2})%/,
        )![1];
        const dropRate = parseFloat(dropRateNumeric);
        // keep lowest drop rate source for each relic
        const existing = sourcesByRelic.get(relicName);
        if (!existing || dropRate < existing.rate) {
          sourcesByRelic.set(relicName, { source, rate: dropRate });
        }
        continue;
      }
    }

    const transformed = source.source.map(transformSourceSections);
    mappedSources.push({ source: transformed, type: source.type });
  }

  for (const { source } of sourcesByRelic.values()) {
    const transformed = source.source.map(transformSourceSections);
    mappedSources.push({ source: transformed, type: source.type });
  }

  return (
    <div className={STYLES.sourceList}>
      {/* <div className={STYLES.sourceListTitle}>Sources:</div> */}
      <ul>
        {mappedSources.map((source, index) => {
          let isCurrentRotation = false;
          if (oracleData) {
            // Isolation Vaults
            if (
              source.source.some(
                (s) => typeof s === "string" && s.includes("Isolation Vault"),
              )
            ) {
              const rotation = getRotationFromSources(source.source);
              if (rotation && oracleData.vaultRot === rotation) {
                isCurrentRotation = true;
              }
            } else if (
              ["Bounty", "Rotation"].every((term) =>
                source.source.some(
                  (s) => typeof s === "string" && s.includes(term),
                ),
              )
            ) {
              const rotation = getRotationFromSources(source.source);
              if (rotation && oracleData.rot === rotation) {
                isCurrentRotation = true;
              }
            }
          }

          return (
            <li
              key={index}
              className={classNames(STYLES.source, {
                [STYLES.sourceCurrentRotation]: isCurrentRotation,
              })}
            >
              {interleave(
                source.source,
                <span className={STYLES.sourceSeparator}> &gt; </span>,
              )}
              {/* ({source.type}) */}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

type ItemDetailsProps = {
  uniqueName: string;
  displayName: string;
  isVaulted?: boolean;
  isInPrimeResurgence?: boolean;
  onToggleFavourite: () => void;
};

export const itemDetailsAsText = ({
  uniqueName,
  displayName,
  isVaulted = false,
  isInPrimeResurgence = false,
}: Omit<ItemDetailsProps, "onToggleFavourite">): string => {
  const itemSources = getItemSources(uniqueName, displayName);
  const itemParts = getItemRecipeParts(uniqueName);
  const itemPartSources = itemParts.map((part) => ({
    part,
    sources: getItemSources(part.uniqueName, part.name),
  }));

  let result = `Item: ${displayName} (${uniqueName})\n\n`;

  if (isVaulted) {
    result += `This item is in the Prime Vault.\n\n`;
  }

  if (isInPrimeResurgence) {
    result += `This item is currently available in Prime Resurgence.\n\n`;
  }

  if (itemSources.length > 0) {
    result += `Sources:\n`;
    for (const source of itemSources) {
      result += `- ${source.source.join(" > ")}\n`;
    }
    result += `\n`;
  }

  if (itemPartSources.length > 0) {
    result += `Blueprints/Parts:\n`;
    for (const { part, sources } of itemPartSources) {
      result += `- ${part.name}:\n`;
      for (const source of sources) {
        result += `  - ${source.source.join(" > ")}\n`;
      }
    }
    result += `\n`;
  }

  return result;
};

export const ItemDetails = ({
  uniqueName,
  displayName,
  isVaulted = false,
  isInPrimeResurgence = false,
  onToggleFavourite,
}: ItemDetailsProps) => {
  const itemSources = getItemSources(uniqueName, displayName);

  const oracleData = useOracle((store) => store.oracleData);

  const formattedItemSources = formatSources(itemSources, oracleData);
  const itemParts = getItemRecipeParts(uniqueName);
  const itemPartSources = itemParts.map((part) => ({
    part,
    sources: getItemSources(part.uniqueName, part.name),
  }));

  // const setItemState = useDataStore((store) => store.setItemState);

  const ingredientElements = itemPartSources.map(
    ({ part, sources: partSources }, i) => {
      const formattedPartSources = formatSources(partSources, oracleData);

      // const partKey = `${uniqueName}__part_${i}`;
      // const partState = useItemData(partKey);
      return (
        <li
          key={`${part.uniqueName}_section_${i}`}
          className={STYLES.ingredientSection}
        >
          <div className={STYLES.ingredientName}>
            <div className={STYLES.checkbox}>
              <PersistentSimpleCheckbox
                storageKey={`${part.uniqueName}__part_${i}__owned`}
              />
            </div>
            <span>
              {/* <MultiStateCheckbox
                states={[undefined, "owned"]}
                value={partState.mastered}
                onChange={(value) => setItemState(partKey, value)}
              />{" "} */}
              {part.name}
            </span>
            <div className={STYLES.price}>
              <Suspense fallback={<span>...</span>}>
                <InlinePrice uniqueName={part.uniqueName} useSet={false} />
              </Suspense>
            </div>
          </div>
          {formattedPartSources}
        </li>
      );
    },
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
    <div className={STYLES.ItemDetails}>
      <div className={STYLES.wikiLink}>
        <a
          href={`https://wiki.warframe.com/?search=${encodeURIComponent(
            displayName,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Wiki
        </a>
      </div>
      <div
        className={STYLES.favouriteToggle}
        onClick={() => onToggleFavourite()}
      >
        {"★ Toggle Favourite"}
      </div>
      {vaultedDisplay}
      {primeResurgenceDisplay}
      <div className={STYLES.priceContainer}>
        <Suspense fallback={null}>
          <PriceDisplay uniqueName={uniqueName} />
        </Suspense>
      </div>
      {itemSources.length > 0 || ingredientElements.length === 0
        ? formattedItemSources
        : null}
      {ingredientElements.length > 0 ? (
        <div className={STYLES.ingredientList}>
          <div className={STYLES.ingredientListTitle}>Blueprints/Parts:</div>
          <ul className={STYLES.ingredientListItems}>{ingredientElements}</ul>
        </div>
      ) : null}
      <div className={STYLES.meta}>{uniqueName}</div>
    </div>
  );
};
