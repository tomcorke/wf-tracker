import {
  listUnusedItemCategories,
  writeCategoryFile,
} from "./data-utils/utils.ts";
import { getDataset, getDropTableData } from "./data-utils/data-fetching.ts";
import fs from "fs";
import path from "path";
import url from "url";

(async () => {
  const {
    warframes,
    archwings,
    necramechs,
    sentinels,
    kubrows,
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
  } = await getDataset();

  listUnusedItemCategories(dataRecord, allFrames, allCompanions, allWeapons);

  const datasets: [string, string, { name: string; uniqueName: string }[]][] = [
    ["warframes", "WarframeData", warframes],
    ["archwings", "WarframeData", archwings],
    ["necramechs", "WarframeData", necramechs],
    ["sentinels", "SentinelData", sentinels],
    ["kubrows", "SentinelData", kubrows],
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
    const recipe = getItemRecipe(item.uniqueName);
    const parts = getItemRecipeParts(item.uniqueName);
    let results: any[] = [];
    if (recipe || parts.length > 0) {
      results.push({
        uniqueName: recipe.uniqueName,
        name: `${item.name} Blueprint`,
      });
      for (const part of parts) {
        const partName = uniqueNameToItemMap.get(part.ItemType);
        const partBlueprint = getItemRecipe(part.ItemType);
        if (partName) {
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
})();
