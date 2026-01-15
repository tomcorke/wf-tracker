import {
  listUnusedItemCategories,
  writeCategoryFile,
} from "./data-utils/utils.ts";
import {
  getDataset,
  getDropTableData,
  getWorldStateData,
  processWikiVendorData,
} from "./data-utils/data-fetching.ts";
import fs from "fs";
import path from "path";
import url from "url";

(async () => {
  const {
    warframes,
    archwings,
    necramechs,
    sentinels,
    companions,
    specialCompanions,
    primaryWeapons,
    secondaryWeapons,
    meleeWeapons,
    archwingGuns,
    archwingMelee,
    specialWeapons,
    crewShipWeapons,
    sentinelWeapons,
    recipeParts,
    dataRecord,
    allFrames,
    allCompanions,
    allWeapons,
    nonSlotWeapons,
    zaws,
    kitguns,
    amps,
    modularCompanions,
    relics,
    kdrives,
  } = await getDataset();

  listUnusedItemCategories(dataRecord, allFrames, allCompanions, allWeapons);

  const datasets: [string, string, { name: string; uniqueName: string }[]][] = [
    ["warframes", "WarframeData", warframes],
    ["archwings", "WarframeData", archwings],
    ["necramechs", "WarframeData", necramechs],
    ["sentinels", "SentinelData", sentinels],
    ["companions", "SentinelData", companions],
    ["specialCompanions", "SentinelData", specialCompanions],
    ["primaryWeapons", "WeaponData", primaryWeapons],
    ["secondaryWeapons", "WeaponData", secondaryWeapons],
    ["meleeWeapons", "WeaponData", meleeWeapons],
    ["archwingGuns", "WeaponData", archwingGuns],
    ["archwingMelee", "WeaponData", archwingMelee],
    ["specialWeapons", "WeaponData", specialWeapons],
    ["crewShipWeapons", "WeaponData", crewShipWeapons],
    ["sentinelWeapons", "WeaponData", sentinelWeapons],
    ["recipeParts", "MiscItem", recipeParts],
    ["otherWeapons", "WeaponData", nonSlotWeapons],
    ["zaws", "WeaponData", zaws],
    ["kitguns", "WeaponData", kitguns],
    ["amps", "WeaponData", amps],
    ["modularCompanions", "WeaponData", modularCompanions],
    ["relics", "MiscItem", relics],
    ["kdrives", "WeaponData", kdrives],
  ];

  for (const [datasetName, datasetType, items] of datasets) {
    writeCategoryFile(datasetName, datasetType, items);
  }

  const getItemRecipeParts = (itemUniqueName: string) => {
    const recipes = dataRecord.Recipes.ExportRecipes as any[];
    const matchingRecipe = recipes.find((r) => r.resultType === itemUniqueName);
    if (!matchingRecipe) {
      return [];
    }
    return matchingRecipe.ingredients as {
      ItemType: string;
      ItemCount: number;
    }[];
  };

  const EXCLUDED_BLUEPRINT_ITEMS = new Set<string>([
    "Braton",
    "MK1-Braton",
    "MK1-Paris",
    "MK1-Strun",
    "Strun",
    "Aklato",
    "Lato",
    "Lex",
    "MK1-Furis",
    "MK1-Kunai",
    "MK1-Bo",
    "MK1-Furax",
  ]);

  const getItemRecipe = (itemUniqueName: string) => {
    const recipes = dataRecord.Recipes.ExportRecipes as any[];
    const matchingRecipe = recipes.find((r) => r.resultType === itemUniqueName);
    if (!matchingRecipe) {
      return undefined;
    }
    return matchingRecipe;
  };

  const uniqueNameToItemMap = new Map<string, string>();
  for (const [, , items] of datasets) {
    for (const item of items) {
      uniqueNameToItemMap.set(item.uniqueName, item.name);
    }
  }

  const getItemPartsOrBlueprints = (item: {
    uniqueName: string;
    name: string;
  }) => {
    const fixedItemName = item.name.replace(/^<ARCHWING> /, "");
    const recipe = getItemRecipe(item.uniqueName);
    const parts = getItemRecipeParts(item.uniqueName);
    let results: any[] = [];
    if (recipe || parts.length > 0) {
      if (!EXCLUDED_BLUEPRINT_ITEMS.has(item.name)) {
        results.push({
          uniqueName: recipe.uniqueName,
          name: `${fixedItemName} Blueprint`,
        });
      }
      for (const part of parts) {
        const partName = uniqueNameToItemMap.get(part.ItemType);
        const partBlueprint = getItemRecipe(part.ItemType);
        if (partName && !EXCLUDED_BLUEPRINT_ITEMS.has(partName)) {
          for (let i = 0; i < part.ItemCount; i++) {
            if (partBlueprint) {
              results.push({
                uniqueName: partBlueprint.uniqueName,
                name: `${partName} Blueprint`,
              });
            } else {
              if (partName) {
                results.push({ uniqueName: part.ItemType, name: partName });
              }
            }
          }
        }
      }
    }
    return results;
  };

  const partsMap = new Map<string, any[]>();

  // For each item in datasets, find its recipe parts
  for (const [, , items] of datasets) {
    for (const item of items) {
      const parts = getItemPartsOrBlueprints(item);
      if (parts.length > 0) {
        partsMap.set(item.uniqueName, parts);
      }
    }
  }

  fs.writeFileSync(
    path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      "../processed-data/item-recipe-parts.json"
    ),
    JSON.stringify(Object.fromEntries(partsMap.entries()), null, 2)
  );

  // Go through the drop tables, and where any items occur which exist in the datasets, add their sources

  // First create easy to check set of item names
  const itemNames = new Set<string>();
  const itemNameToUniqueName = new Map<string, string>();
  for (const [, , items] of datasets) {
    for (const item of items) {
      itemNames.add(item.name);
      itemNameToUniqueName.set(item.name, item.uniqueName);
      const blueprints = getItemPartsOrBlueprints(item);
      for (const bp of blueprints) {
        itemNames.add(bp.name);
        itemNameToUniqueName.set(bp.name, bp.uniqueName);
      }
    }
  }

  const dropTableData = await getDropTableData(itemNames);

  // Map drop table data keys to unique names
  const dropTableDataByUniqueName = new Map<string, any[]>();
  for (const [itemName, dropData] of dropTableData.entries()) {
    // Find unique name for this item name
    const uniqueName = itemNameToUniqueName.get(itemName);
    if (uniqueName) {
      dropTableDataByUniqueName.set(uniqueName, dropData);
    } else {
      console.warn(`Could not find unique name for item name: ${itemName}`);
    }
  }

  fs.writeFileSync(
    path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      "../processed-data/item-drop-sources.json"
    ),
    JSON.stringify(
      Object.fromEntries(dropTableDataByUniqueName.entries()),
      null,
      2
    )
  );

  // load wiki data text and reformat to JS object
  const mappedWikiDataLines: string[] = processWikiVendorData();

  fs.writeFileSync(
    path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      "../processed-data/wiki-vendor-data.ts"
    ),
    `export type WikiVendorData = {
  Vendors: {
    [VendorName: string]: {
      Currency?: string | string[];
      Link: string;
      Name: string;
      Offerings: {
        Name?: string;
        Type: string;
        Price: number | { [Currency: string]: number };
        Limit?: number;
        Timer?: number;
        Prereq?: number | string;
        Credits?: number;
        Standing?: number;
      }[];
      Ranks?: string[];
      Type: string;
    };
  };
};

${mappedWikiDataLines.join("\n")}`
  );

  const worldStateData = await getWorldStateData();
  fs.writeFileSync(
    path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      "../processed-data/world-state-data.json"
    ),
    JSON.stringify(worldStateData, null, 2)
  );

  type Relic = { name: string; uniqueName: string };

  const relicNames = new Set<string>();
  const relicUniqueNames = new Set<string>();
  const relicsByName = new Map<string, Relic>();
  const relicsByUniqueName = new Map<string, Relic>();
  for (const relic of relics) {
    if (!relic.name.includes("Relic")) {
      continue;
    }
    relicNames.add(relic.name);
    relicUniqueNames.add(relic.uniqueName);
    relicsByName.set(relic.name, relic);
    relicsByUniqueName.set(relic.uniqueName, relic);
  }

  const relicStates = new Map<string, "available" | "resurgence" | "vaulted">();
  for (const relicName of relicNames) {
    relicStates.set(relicName, "vaulted");
  }
  for (const [itemName] of dropTableData.entries()) {
    if (relicNames.has(itemName)) {
      relicStates.set(itemName, "available");
    }
  }
  for (const tradeItem of worldStateData.PrimeVaultTraders.flatMap(
    (t) => t.Manifest
  )) {
    const uniqueName =
      tradeItem.ItemType.split("/Lotus/StoreItems/").join("/Lotus/");
    const relicName = relicsByUniqueName.get(uniqueName)?.name;
    // console.log(uniqueName, relicName);
    if (relicName) {
      relicStates.set(relicName, "resurgence");
    }
  }

  fs.writeFileSync(
    path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      "../processed-data/relic-states.json"
    ),
    JSON.stringify(
      Object.fromEntries(
        Array.from(relicStates.entries()).sort((a, b) => {
          const valueCompare = b[1].localeCompare(a[1]);
          if (valueCompare !== 0) {
            return valueCompare;
          }
          return a[0].localeCompare(b[0]);
        })
      ),
      null,
      2
    )
  );
})();
