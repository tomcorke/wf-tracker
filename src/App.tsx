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
import { KUBROWS } from "./processed-data/kubrows";
import { NECRAMECHS } from "./processed-data/necramechs";
import { SENTINELWEAPONS } from "./processed-data/sentinelWeapons";
import { Metadata } from "./components/Metadata";
import { useState } from "react";

function App() {
  const [filterText, setFilterText] = useState("");

  return (
    <>
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
              title="Kubrows"
              itemDataSet={KUBROWS}
              filter={filterText}
            />
            <ItemCollection
              title="Necramechs"
              itemDataSet={NECRAMECHS}
              filter={filterText}
            />
          </div>
        </div>
        <div className={STYLES.tasksContainer}></div>
        <Metadata />
      </div>
    </>
  );
}

export default App;
