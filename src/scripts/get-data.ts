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
  const wikiData = fs.readFileSync(
    path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      "../data/wiki-vendor-data.txt"
    ),
    "utf-8"
  );

  const wikiDataLines = wikiData.split("\n");
  const mappedWikiDataLines: string[] = [];

  let inOfferingsArray = false;
  let inComplexOffering = false;
  let complexOfferingLines: string[] = [];
  let complexOfferingDepth = 0;

  const isNumericString = (value: unknown) => {
    return /^-?\d+(\.\d+)?$/.test(String(value));
  };

  const isQuotedString = (value: unknown) => {
    return /^["'].*["']$/.test(String(value));
  };

  const handleSingleLineOffering = (line: string) => {
    // convert to JSON-like array
    let _line = line;
    _line = _line.replace(/^(\s*)\{(.+)\}(.*)$/, "$1[$2]$3");

    // extract named properties
    const namedElements = Array.from(_line.matchAll(/(\w+): ([^,}\]]+)/g));
    // and remove from JSON-like array
    for (const n of namedElements) {
      _line = _line.replace(n[0], "");
    }
    // parse array, removing trailing commas
    _line = _line.replace(/,\s*$/, "");
    while (/, [\]\}]/.test(_line)) {
      _line = _line.replace(/, ([\]\}])/, "$1");
    }
    const elements = JSON.parse(_line);

    const indentation = _line.match(/^(\s*)/)![1];
    const columns = ["Name", "Type", "Price", "Limit"];
    const offeringData: any = {};
    for (let i = 0; i < columns.length; i++) {
      if (elements[i]) {
        offeringData[columns[i]] = elements[i];
      }
    }
    for (const match of namedElements) {
      offeringData[match[1]] = match[2].trim();
    }
    return `${indentation}{ ${Object.entries(offeringData)
      .map(
        ([k, v]) =>
          `${JSON.stringify(k)}: ${
            isNumericString(v) || isQuotedString(v) ? v : JSON.stringify(v)
          }`
      )
      .join(", ")} },`;
  };

  for (const line of wikiDataLines) {
    let _line = line;
    if (_line.trim().startsWith("--")) {
      _line = _line.replace(/--(.+)/, "/* $1 */");
      mappedWikiDataLines.push(_line);
      continue;
    }
    if (_line.trim() === "return {") {
      _line = "export const wikiVendorData: WikiVendorData = {";
      mappedWikiDataLines.push(_line);
      continue;
    }
    if (/[a-zA-Z0-9\- ]+ = ./.test(_line)) {
      _line = _line.replace(/([a-zA-Z0-9\- ]+) = (.)/g, "$1: $2");
    }
    if (/\[["'][a-zA-Z0-9\-' ]+["']\] = ./.test(_line)) {
      _line = _line.replace(
        /\[["']([a-zA-Z0-9\-' ]+)["']\] = (.)/g,
        '"$1": $2'
      );
    }

    if (/Ranks: \{ \[0\] = .+\},?/.test(_line)) {
      const rankNames = _line.match(/Ranks: \{ \[0\] = ([^}]+) \},?/);
      const rankArray = rankNames![1]
        .split(", ")
        .map((r) => r.trim().replace(/"(.+)"/, "$1"));
      const indentation = _line.match(/^(\s*)/)![1];
      _line =
        indentation +
        "Ranks: [" +
        rankArray.map((r) => `"${r}"`).join(", ") +
        "],";
    }

    if (/\w+: \{ .+\},?/.test(_line)) {
      _line = _line.replace(/(\w+): \{ (.+) \},?/, "$1: [ $2 ],");
    }

    if (_line.trim() === "Offerings: {") {
      _line = _line.replace("Offerings: {", "Offerings: [");
      inOfferingsArray = true;
    }

    if (inOfferingsArray) {
      if (/\{.+\},?/.test(_line)) {
        _line = handleSingleLineOffering(_line);
      }

      if (/^},?$/.test(_line.trim()) && !inComplexOffering) {
        _line = _line.replace("},", "],");
        inOfferingsArray = false;
      }

      if (_line.trim() === "{" && !inComplexOffering) {
        inComplexOffering = true;
      }

      if (inComplexOffering) {
        if (_line.trim() === "{") {
          complexOfferingDepth += 1;
        }

        if (/^},?$/.test(_line.trim())) {
          complexOfferingDepth -= 1;
        }

        complexOfferingLines.push(_line);

        if (complexOfferingDepth === 0) {
          const asSingleLine = complexOfferingLines
            .join(" ")
            .replace(/(\S)\s\s+/g, "$1 ");
          // mappedWikiDataLines.push(asSingleLine);
          mappedWikiDataLines.push(handleSingleLineOffering(asSingleLine));
          inComplexOffering = false;
          complexOfferingLines = [];
        }

        continue;
      }
    }
    mappedWikiDataLines.push(_line);
  }

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
})();
