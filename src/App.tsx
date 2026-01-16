import { useShallow } from "zustand/shallow";
import { useState } from "react";

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
import { MultiStateCheckbox } from "./components/multiStateCheckbox";

const ShareLink = ({ datasets }: { datasets: DataSet<any, any>[] }) => {
  const itemStates = useDataStore(
    useShallow((store) =>
      datasets.flatMap((ds) =>
        ds.items.map((item) =>
          store.itemStates[item.uniqueName]?.mastered ? true : false
        )
      )
    )
  );
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

  const [testCheckState, setTestCheckState] = useState<"null" | "foo" | "bar">(
    "null"
  );

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
            <div className={STYLES.favouritesFilter}>
              <label>
                <input
                  type="checkbox"
                  id="favouritesToggle"
                  checked={showOnlyFavourites}
                  onChange={(e) => setShowOnlyFavourites(e.target.checked)}
                />
                Favourites Only
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
          <ItemCollection
            title="Warframes"
            itemDataSet={WARFRAMES}
            filter={filterText}
            showOnlyFavourites={showOnlyFavourites}
          />
          <ItemCollection
            title="Primary Weapons"
            itemDataSet={PRIMARYWEAPONS}
            filter={filterText}
            showOnlyFavourites={showOnlyFavourites}
          />
          <ItemCollection
            title="Secondary Weapons"
            itemDataSet={SECONDARYWEAPONS}
            filter={filterText}
            showOnlyFavourites={showOnlyFavourites}
          />
          <ItemCollection
            title="Melee Weapons"
            itemDataSet={MELEEWEAPONS}
            filter={filterText}
            showOnlyFavourites={showOnlyFavourites}
          />
          <div className={STYLES.stacked}>
            <ItemCollection
              title="Archwings"
              itemDataSet={ARCHWINGS}
              filter={filterText}
              showOnlyFavourites={showOnlyFavourites}
            />
            <ItemCollection
              title="Necramechs"
              itemDataSet={NECRAMECHS}
              filter={filterText}
              showOnlyFavourites={showOnlyFavourites}
            />
            <ItemCollection
              title="Archwing Guns"
              itemDataSet={ARCHWINGGUNS}
              filter={filterText}
              showOnlyFavourites={showOnlyFavourites}
            />
            <ItemCollection
              title="Archwing Melee"
              itemDataSet={ARCHWINGMELEE}
              filter={filterText}
              showOnlyFavourites={showOnlyFavourites}
            />
          </div>
          <div className={STYLES.stacked}>
            <ItemCollection
              title="Sentinels"
              itemDataSet={SENTINELS}
              filter={filterText}
              showOnlyFavourites={showOnlyFavourites}
            />
            <ItemCollection
              title="Sentinel Weapons"
              itemDataSet={SENTINELWEAPONS}
              filter={filterText}
              showOnlyFavourites={showOnlyFavourites}
            />
          </div>
          <div className={STYLES.stacked}>
            <ItemCollection
              title="Companions"
              itemDataSet={COMPANIONS}
              filter={filterText}
              showOnlyFavourites={showOnlyFavourites}
              groupBy={(item) => item.name.split(" ")[1] || item.name}
            />
            <ItemCollection
              title="Modular Companions"
              itemDataSet={MODULARCOMPANIONS}
              filter={filterText}
              showOnlyFavourites={showOnlyFavourites}
            />
          </div>
          <div className={STYLES.stacked}>
            <ItemCollection
              title="Zaws"
              itemDataSet={ZAWS}
              filter={filterText}
              showOnlyFavourites={showOnlyFavourites}
            />
            <ItemCollection
              title="Kitguns"
              itemDataSet={KITGUNS}
              filter={filterText}
              showOnlyFavourites={showOnlyFavourites}
            />
            <ItemCollection
              title="Amps"
              itemDataSet={AMPS}
              filter={filterText}
              showOnlyFavourites={showOnlyFavourites}
            />
            <ItemCollection
              title="K-Drives"
              itemDataSet={KDRIVES}
              filter={filterText}
              showOnlyFavourites={showOnlyFavourites}
            />
          </div>
          {import.meta.env.MODE === "development" ? (
            <div className={STYLES.stacked}>
              <Section title="Dev mode">
                {[
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      padding: "0 5px",
                      flex: "row nowrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1em",
                    }}
                  >
                    Test checkbox{" "}
                    <MultiStateCheckbox
                      states={["null", "foo", "bar"]}
                      onChange={(newValue) => setTestCheckState(newValue)}
                      value={testCheckState}
                    />
                  </div>,
                ]}
              </Section>
            </div>
          ) : null}
          {/* <div className={STYLES.stacked}>
            <Section title="Syndicates">{[<div>Ostron</div>]}</Section>
          </div> */}
        </div>
        <div className={STYLES.tasksContainer}></div>
        <Metadata />
      </div>
    </div>
  );
}

export default App;
