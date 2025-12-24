import styles from "./App.module.css";

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
import { SPECIALCOMPANIONS } from "./processed-data/specialCompanions";
import { NECRAMECHS } from "./processed-data/necramechs";
import { SENTINELWEAPONS } from "./processed-data/sentinelWeapons";
import { Metadata } from "./components/Metadata";

function App() {
  return (
    <div className={styles.container}>
      <ItemCollection title="Warframe" items={WARFRAMES} />
      <ItemCollection title="Primary Weapons" items={PRIMARYWEAPONS} />
      <ItemCollection title="Secondary Weapons" items={SECONDARYWEAPONS} />
      <ItemCollection title="Melee Weapons" items={MELEEWEAPONS} />
      <ItemCollection title="Archwings" items={ARCHWINGS} />
      <ItemCollection title="Archwing Guns" items={ARCHWINGGUNS} />
      <ItemCollection title="Archwing Melee" items={ARCHWINGMELEE} />
      <ItemCollection title="Sentinels" items={SENTINELS} />
      <ItemCollection title="Kubrows" items={KUBROWS} />
      <ItemCollection title="Special Companions" items={SPECIALCOMPANIONS} />
      <ItemCollection title="Sentinel Weapons" items={SENTINELWEAPONS} />
      <ItemCollection title="Necramechs" items={NECRAMECHS} />
      <Metadata />
    </div>
  );
}

export default App;
