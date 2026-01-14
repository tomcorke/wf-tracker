import lzma from "lzma";
import z from "zod";
import fs from "fs";
import path from "path";
import url from "url";

import * as cheerio from "cheerio";

import {
  MiscItemSchema,
  SentinelDataSchema,
  WarframeDataSchema,
  WeaponDataSchema,
  WorldStateSchema,
} from "../../data-types.ts";

// https://wiki.warframe.com/w/Public_Export
const BASE_URL = "https://origin.warframe.com/PublicExport";
const INDEX_URL = `${BASE_URL}/index_en.txt.lzma`;
const MANIFEST_BASE_URL = `http://content.warframe.com/PublicExport/Manifest/`;

export const getDataset = async () => {
  const response = await fetch(INDEX_URL);

  const dataBuffer = await response.arrayBuffer();

  const indexData = lzma
    .decompress(Buffer.from(dataBuffer))
    .toString()
    .split("\n")
    .map((line) => line.trim());

  const INDEX_DATA_KEYS = [
    "Customs",
    "Drones",
    "Flavour",
    "FusionBundles",
    "Gear",
    "Keys",
    "Recipes",
    "Regions",
    "RelicArcane",
    "Resources",
    "Sentinels",
    "SortieRewards",
    "Upgrades",
    "Warframes",
    "Weapons",
    "Manifest",
  ] as const;

  const dataPaths = INDEX_DATA_KEYS.reduce(
    (acc, key) => ({
      ...acc,
      [key]: indexData.find((line) =>
        new RegExp(`^Export${key}[._]`).test(line)
      ),
    }),
    {} as Record<(typeof INDEX_DATA_KEYS)[number], string | undefined>
  );

  console.log(dataPaths);

  if (Object.values(dataPaths).some((path) => !path)) {
    throw new Error("Failed to find all data paths in index file");
  }

  if (indexData.length !== INDEX_DATA_KEYS.length) {
    throw new Error("Unexpected number of data paths found in index file");
  }

  const allData = await Promise.all(
    Object.entries(dataPaths).map(async ([key, path]) => {
      const res = await fetch(`${MANIFEST_BASE_URL}${path}`);
      const data = await res.json();
      return [key, data] as const;
    })
  );

  const dataRecord = Object.fromEntries(allData);

  for (const [key, data] of Object.entries(dataRecord)) {
    console.log(key, Object.keys(data));
  }

  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const dataCacheDir = path.join(__dirname, "../../data-cache");
  if (!fs.existsSync(dataCacheDir)) {
    fs.mkdirSync(dataCacheDir);
  }

  fs.writeFileSync(
    path.resolve(dataCacheDir, "data.json"),
    JSON.stringify(dataRecord, null, 2)
  );

  const allFrames = z
    .array(WarframeDataSchema)
    .parse(dataRecord.Warframes.ExportWarframes);

  const warframes = allFrames.filter((wf) => wf.productCategory === "Suits");

  const archwings = allFrames.filter(
    (wf) => wf.productCategory === "SpaceSuits"
  );

  const necramechs = allFrames.filter(
    (wf) => wf.productCategory === "MechSuits"
  );

  const allCompanions = z
    .array(SentinelDataSchema)
    .parse(dataRecord.Sentinels.ExportSentinels);

  const sentinels = allCompanions.filter(
    (c) => c.productCategory === "Sentinels"
  );

  const companions = allCompanions.filter(
    (c) => c.productCategory === "KubrowPets"
  );

  const specialCompanions = allCompanions.filter(
    (c) => !["Sentinels", "KubrowPets"].includes(c.productCategory)
  );

  const allWeapons = z
    .array(WeaponDataSchema)
    .parse(dataRecord.Weapons.ExportWeapons);

  const primaryWeapons = allWeapons.filter(
    (w) => w.productCategory === "LongGuns" && w.slot === 1
  );

  const secondaryWeapons = allWeapons.filter(
    (w) => w.productCategory === "Pistols" && w.slot === 0
  );

  const meleeWeapons = allWeapons.filter(
    (w) => w.productCategory === "Melee" && w.slot === 5
  );

  const archwingGuns = allWeapons.filter(
    (w) => w.productCategory === "SpaceGuns" && w.slot === 1
  );

  const archwingMelee = allWeapons.filter(
    (w) => w.productCategory === "SpaceMelee" && w.slot === 5
  );

  const specialWeapons = allWeapons.filter(
    (w) => w.productCategory === "SpecialItems"
  );

  const crewShipWeapons = allWeapons.filter(
    (w) => w.productCategory === "CrewShipWeapons"
  );

  const sentinelWeapons = allWeapons.filter(
    (w) => w.productCategory === "SentinelWeapons"
  );

  const nonSlotWeapons = allWeapons.filter(
    (w) =>
      (w.productCategory === "LongGuns" || w.productCategory === "Pistols") &&
      w.slot === undefined
  );

  const zaws = nonSlotWeapons.filter(
    (w) =>
      w.uniqueName.includes("/Lotus/Weapons/Ostron/Melee/ModularMelee") &&
      w.uniqueName.includes("/Tip/Tip")
  );

  const kitguns = nonSlotWeapons.filter(
    (w) =>
      w.uniqueName.includes(
        "/Lotus/Weapons/SolarisUnited/Secondary/SUModularSecondarySet1/Barrel/"
      ) || w.uniqueName.includes("/InfKitGun/Barrels/")
  );

  const amps = nonSlotWeapons.filter(
    (w) =>
      /\/Lotus\/Weapons\/Sentients\/OperatorAmplifiers\/Set[0-9]\/Barrel\/SentAmpSet[0-9]BarrelPart[A-Z]/.test(
        w.uniqueName
      ) ||
      // /Lotus/Weapons/Corpus/OperatorAmplifiers/Set1/Barrel/CorpAmpSet1BarrelPartA
      /\/Lotus\/Weapons\/Corpus\/OperatorAmplifiers\/Set[0-9]\/Barrel\/CorpAmpSet[0-9]BarrelPart[A-Z]/.test(
        w.uniqueName
      ) ||
      [
        "/Lotus/Weapons/Sentients/OperatorAmplifiers/SentTrainingAmplifier/SentAmpTrainingBarrel",
        "/Lotus/Weapons/Operator/Pistols/DrifterPistol/DrifterPistolPlayerWeapon",
      ].includes(w.uniqueName)
  );

  const modularCompanions = nonSlotWeapons.filter(
    (w) =>
      // /Lotus/Types/Friendly/Pets/MoaPets
      w.uniqueName.startsWith(
        "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHead"
      ) ||
      w.uniqueName.startsWith(
        "/Lotus/Types/Friendly/Pets/ZanukaPets/ZanukaPetParts/ZanukaPetPartHead"
      )
  );

  const allResources = z
    .array(MiscItemSchema)
    .parse(dataRecord.Resources.ExportResources);

  const recipeParts = allResources.filter(
    (r) =>
      r.uniqueName.startsWith("/Lotus/Types/Recipes/") ||
      r.uniqueName.startsWith(
        "/Lotus/Types/Gameplay/InfestedMicroplanet/Resources/Mechs/"
      )
  );

  const relics = z
    .array(MiscItemSchema)
    .parse(dataRecord.RelicArcane.ExportRelicArcane);

  return {
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
  };
};

export const getDropTableData = async (relevantItemNames: Set<string>) => {
  const dropTablesUrl = "https://www.warframe.com/droptables";

  const dropTablesHtmlResponse = await fetch(dropTablesUrl);
  const dropTablesHtml = await dropTablesHtmlResponse.text();

  const $dropTables = cheerio.load(dropTablesHtml);

  const isDefined = <T>(value: T | undefined): value is T =>
    value !== undefined;

  const headers = $dropTables("h3")
    .toArray()
    .map((el) => el.attributes.find((a) => a.name === "id")?.value)
    .filter(isDefined);

  console.log(headers);

  const tables = headers.reduce((acc, header) => {
    const table = $dropTables(`#${header}`).next("table");
    return { ...acc, [header]: table };
  }, {} as Record<string, ReturnType<typeof $dropTables>>);

  type DropData = { source: string[]; type: string };
  const dropTableData = new Map<string, DropData[]>();

  for (const header of headers) {
    const table = tables[header];

    console.log(`Processing drop table data for header: ${header}`);

    let topCategory: string | null = null;
    let rotation: string | null = null;
    let subCategory: string | null = null;

    const rows = table.find("tr").toArray();

    for (const row of rows) {
      const $row = $dropTables(row);

      const isBlankRow = $row.hasClass("blank-row");
      if (isBlankRow) {
        // throw Error(`Break on blank row: ${topCategory} / ${subCategory}`);
        // console.log("-");
        topCategory = null;
        rotation = null;
        subCategory = null;
        continue;
      }

      const isHeaderRow = $row.find("th").length > 0;
      if (isHeaderRow) {
        const firstText = $row.find("th").first().text();
        if (topCategory !== null) {
          // console.log("New sub-category:", firstText);
          if (/^Rotation [A-Z]$/.test(firstText)) {
            rotation = firstText;
          } else {
            subCategory = firstText;
          }
          continue;
        }

        // console.log("New top category:", firstText);
        topCategory = firstText;
        //throw Error("break");
        continue;
      }

      // If not blank, and not a header, assume it's a data row
      // check if we care about this item
      // if we do, add this source to its drop table data
      let itemName = "";
      const cells = $row.find("td");
      let cell = cells.first();
      while (itemName === "") {
        if (!cell) {
          break;
        }
        itemName = cell.first().text().trim();
        cell = cell.next("td");
      }

      if (relevantItemNames.has(itemName)) {
        const sourceParts: string[] = [];
        if (topCategory) {
          if (/^.+ Relic \(\w+\)$/.test(topCategory)) {
            const match = topCategory.match(/^(.+ Relic) \((\w+)\)$/);
            if (match) {
              const relicType = match[1];
              // const relicTier = match[2];
              sourceParts.push(relicType);
              // sourceParts.push(relicTier);
            }
          } else {
            sourceParts.push(topCategory);
          }
        }
        if (rotation) {
          sourceParts.push(rotation);
        }
        if (subCategory) {
          sourceParts.push(subCategory);
        }

        let part = "-";
        while (part !== "") {
          part = cell.first().text().trim();
          if (part) {
            sourceParts.push(part);
          } else {
            break;
          }
          cell = cell.next("td");
        }

        const dropData: DropData = { source: sourceParts, type: header };
        const existingData = dropTableData.get(itemName) || [];
        if (
          !existingData.find(
            (d) => JSON.stringify(d) === JSON.stringify(dropData)
          )
        ) {
          dropTableData.set(itemName, [...existingData, dropData]);
        }
      }
    }
  }

  return dropTableData;
};

export const processWikiVendorData = () => {
  const wikiData = fs.readFileSync(
    path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      "../../data/wiki-vendor-data.txt"
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
  return mappedWikiDataLines;
};

export const getWorldStateData = async () => {
  const response = await fetch("https://api.warframe.com/cdn/worldState.php");
  const data = await response.json();
  return WorldStateSchema.parse(data);
};
