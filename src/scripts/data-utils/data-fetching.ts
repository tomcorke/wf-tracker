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

  const kubrows = allCompanions.filter(
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

  return {
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
