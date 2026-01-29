import { useMemo, useState } from "react";

import STYLES from "./App.module.css";

import { ItemCollection } from "./components/itemCollection";
import { WARFRAMES } from "./processed-data/warframes";
import { PRIMARYWEAPONS } from "./processed-data/primaryWeapons";
import { SECONDARYWEAPONS } from "./processed-data/secondaryWeapons";
import { MELEEWEAPONS } from "./processed-data/meleeWeapons";
import { ARCHWINGS } from "./processed-data/archwings";
import { ARCHWINGGUNS } from "./processed-data/archwingGuns";
import { ARCHWINGMELEE } from "./processed-data/archwingMelee";
import { SENTINELS } from "./processed-data/sentinels";
import { NECRAMECHS } from "./processed-data/necramechs";
import { SENTINELWEAPONS } from "./processed-data/sentinelWeapons";
import { OTHERWEAPONS } from "./processed-data/otherWeapons";
import { COMPANIONS } from "./processed-data/companions";

import { Metadata } from "./components/Metadata";
import { DataSet } from "./data-types";
import { useDataStore } from "./components/storage/data-store";

import metadata from "./data/build-metadata.json";
import { ZAWS } from "./processed-data/zaws";
import { KITGUNS } from "./processed-data/kitguns";
import { AMPS } from "./processed-data/amps";
import { MODULARCOMPANIONS } from "./processed-data/modularCompanions";
import { KDRIVES } from "./processed-data/kdrives";
import { Section } from "./components/section";
import { PersistentTrackedItem } from "./components/persistentTrackedItem";
import { MultiStateCheckbox } from "./components/multiStateCheckbox";
import { ItemCollectionProps } from "./components/itemCollection/itemCollection";

const ShareLink = ({ datasets }: { datasets: DataSet<any, any>[] }) => {
  const lastUpdated = useDataStore((store) => store.lastUpdated);

  const itemStates = useMemo(() => {
    const store = useDataStore.getState();
    return datasets.flatMap((ds) =>
      ds.items.map((item) => {
        const value = store.itemStates[item.uniqueName];
        const isMastered =
          value === "mastered" ||
          (typeof value === "object" && (value as any)?.mastered);
        return isMastered;
      }),
    );
  }, [lastUpdated]);

  const asBinaryString = itemStates
    .map((state) => (state ? "1" : "0"))
    .join("");
  const asNumber = BigInt("0b" + asBinaryString);
  const asText = asNumber.toString(36);
  const commitSha = metadata.commitSha;
  const commitShaAsNumber = BigInt("0x" + commitSha);
  const commitShaAsText = commitShaAsNumber.toString(36);
  return (
    <div className={STYLES.shareLink}>
      {commitShaAsText}:{asText}
    </div>
  );
};

function App() {
  const [filterText, setFilterText] = useState("");

  const [showOnlyFavourites, setShowOnlyFavourites] = useState(false);
  const [showOnlyUnmastered, setShowOnlyUnmastered] = useState(false);

  const filters = { filterText, showOnlyFavourites, showOnlyUnmastered };

  const FilteredItemCollection = <
    K extends string,
    T extends { uniqueName: string; name: string },
  >(
    props: Omit<ItemCollectionProps<K, T>, "filters">,
  ) => <ItemCollection {...props} filters={filters} />;

  return (
    <div className={STYLES.App}>
      <div className={STYLES.outer}>
        <div className={STYLES.header}>
          <div className={STYLES.filterGroup}>
            <div className={STYLES.filterInputWrapper}>
              <input
                className={STYLES.filterInput}
                type="text"
                placeholder="Filter items..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              {filterText ? (
                <div
                  className={STYLES.clearInput}
                  onClick={() => setFilterText("")}
                >
                  ×
                </div>
              ) : null}
            </div>
            <div className={STYLES.toggleFilter}>
              <label>
                <MultiStateCheckbox
                  states={[undefined, "checked"]}
                  value={showOnlyFavourites ? "checked" : undefined}
                  onChange={(state) =>
                    setShowOnlyFavourites(state === "checked")
                  }
                  large
                />
                Favourites Only
              </label>
            </div>
            <div className={STYLES.toggleFilter}>
              <label>
                <MultiStateCheckbox
                  states={[undefined, "checked"]}
                  value={showOnlyUnmastered ? "checked" : undefined}
                  onChange={(state) =>
                    setShowOnlyUnmastered(state === "checked")
                  }
                  large
                />
                Unchecked Only
              </label>
            </div>
          </div>
          <div className={STYLES.share}>
            <ShareLink
              datasets={[
                WARFRAMES,
                PRIMARYWEAPONS,
                SECONDARYWEAPONS,
                MELEEWEAPONS,
                ARCHWINGS,
                ARCHWINGGUNS,
                ARCHWINGMELEE,
                SENTINELS,
                COMPANIONS,
                NECRAMECHS,
                SENTINELWEAPONS,
                OTHERWEAPONS,
              ]}
            />
          </div>
        </div>
        <div className={STYLES.container}>
          <FilteredItemCollection title="Warframes" itemDataSet={WARFRAMES} />
          <FilteredItemCollection
            title="Primary Weapons"
            itemDataSet={PRIMARYWEAPONS}
          />
          <FilteredItemCollection
            title="Secondary Weapons"
            itemDataSet={SECONDARYWEAPONS}
          />
          <FilteredItemCollection
            title="Melee Weapons"
            itemDataSet={MELEEWEAPONS}
          />
          <div className={STYLES.stacked}>
            <FilteredItemCollection title="Archwings" itemDataSet={ARCHWINGS} />
            <FilteredItemCollection
              title="Necramechs"
              itemDataSet={NECRAMECHS}
            />
            <FilteredItemCollection
              title="Archwing Guns"
              itemDataSet={ARCHWINGGUNS}
            />
            <FilteredItemCollection
              title="Archwing Melee"
              itemDataSet={ARCHWINGMELEE}
            />
          </div>
          <div className={STYLES.stacked}>
            <FilteredItemCollection title="Sentinels" itemDataSet={SENTINELS} />
            <FilteredItemCollection
              title="Sentinel Weapons"
              itemDataSet={SENTINELWEAPONS}
            />
          </div>
          <div className={STYLES.stacked}>
            <FilteredItemCollection
              title="Companions"
              itemDataSet={COMPANIONS}
              groupBy={(item) => item.name.split(" ")[1] || item.name}
            />
            <FilteredItemCollection
              title="Modular Companions"
              itemDataSet={MODULARCOMPANIONS}
            />
          </div>
          <div className={STYLES.stacked}>
            <FilteredItemCollection title="Zaws" itemDataSet={ZAWS} />
            <FilteredItemCollection title="Kitguns" itemDataSet={KITGUNS} />
            <FilteredItemCollection title="Amps" itemDataSet={AMPS} />
            <FilteredItemCollection title="K-Drives" itemDataSet={KDRIVES} />
          </div>
          <div className={STYLES.stacked}>
            <Section title="Syndicates">
              {[
                "Cetus - Ostron",
                "Cetus - Quills",
                "Fortuna - Solaris United",
                "Fortuna - Vox Solaris",
                "Fortuna - Ventkids",
                "Necralisk - Entrati",
                "Necralisk - Cavia",
                "Necralisk - Necraloid",
                "Crysalith - Holdfasts",
                "Hollvania - The Hex",
              ].flatMap((syndicate) => [
                <PersistentTrackedItem
                  key={`syndicate-${syndicate}-rank`}
                  label={`${syndicate} - Rank`}
                  itemKey={`syndicate-${syndicate}-rank`}
                  states={[
                    "rank-0",
                    "rank-1",
                    "rank-2",
                    "rank-3",
                    "rank-4",
                    "rank-5",
                  ]}
                  highlight={(state) => state === "rank-5"}
                  highlightClassName="syndicateHighlight"
                  initialValue={"rank-0"}
                />,
                <PersistentTrackedItem
                  key={`syndicate-${syndicate}-daily`}
                  label={`${syndicate} - Standing`}
                  itemKey={`syndicate-${syndicate}`}
                  states={["syndicate-full"]}
                  highlight={(state) => state === "syndicate-full"}
                  highlightClassName="syndicateHighlight"
                  initialValue={undefined}
                />,
              ])}
            </Section>
            {import.meta.env.MODE === "development" ? (
              <Section title="Dev mode">
                {[
                  <PersistentTrackedItem
                    label="Test Label"
                    itemKey="test-value"
                    states={["mastered"]}
                    initialValue={undefined}
                  />,
                ]}
              </Section>
            ) : null}
          </div>
        </div>
        <div className={STYLES.tasksContainer}></div>
        <Metadata />
      </div>
    </div>
  );
}

export default App;
