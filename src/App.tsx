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

  return (
    <div className={STYLES.App}>
      <div className={STYLES.outer}>
        <div className={STYLES.header}>
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
          />
          <ItemCollection
            title="Primary Weapons"
            itemDataSet={PRIMARYWEAPONS}
            filter={filterText}
          />
          <ItemCollection
            title="Secondary Weapons"
            itemDataSet={SECONDARYWEAPONS}
            filter={filterText}
          />
          <ItemCollection
            title="Melee Weapons"
            itemDataSet={MELEEWEAPONS}
            filter={filterText}
          />
          <div className={STYLES.stacked}>
            <ItemCollection
              title="Archwings"
              itemDataSet={ARCHWINGS}
              filter={filterText}
            />
            <ItemCollection
              title="Necramechs"
              itemDataSet={NECRAMECHS}
              filter={filterText}
            />
            <ItemCollection
              title="Archwing Guns"
              itemDataSet={ARCHWINGGUNS}
              filter={filterText}
            />
            <ItemCollection
              title="Archwing Melee"
              itemDataSet={ARCHWINGMELEE}
              filter={filterText}
            />
          </div>
          <div className={STYLES.stacked}>
            <ItemCollection
              title="Sentinels"
              itemDataSet={SENTINELS}
              filter={filterText}
            />
            <ItemCollection
              title="Sentinel Weapons"
              itemDataSet={SENTINELWEAPONS}
              filter={filterText}
            />
          </div>
          <div className={STYLES.stacked}>
            <ItemCollection
              title="Companions"
              itemDataSet={COMPANIONS}
              filter={filterText}
              groupBy={(item) => item.name.split(" ")[1] || item.name}
            />
            <ItemCollection
              title="Modular Companions"
              itemDataSet={MODULARCOMPANIONS}
              filter={filterText}
            />
          </div>
          <div className={STYLES.stacked}>
            <ItemCollection
              title="Zaws"
              itemDataSet={ZAWS}
              filter={filterText}
            />
            <ItemCollection
              title="Kitguns"
              itemDataSet={KITGUNS}
              filter={filterText}
            />
            <ItemCollection
              title="Amps"
              itemDataSet={AMPS}
              filter={filterText}
            />
          </div>
        </div>
        <div className={STYLES.tasksContainer}></div>
        <Metadata />
      </div>
    </div>
  );
}

export default App;
