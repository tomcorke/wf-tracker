import lzma from "lzma";
import {
  SentinelDataSchema,
  WarframeDataSchema,
  WeaponDataSchema,
} from "../data-types.ts";
import z from "zod";
import fs from "fs";
import path from "path";
import url from "url";

// https://wiki.warframe.com/w/Public_Export
const BASE_URL = "https://origin.warframe.com/PublicExport";
const INDEX_URL = `${BASE_URL}/index_en.txt.lzma`;
const MANIFEST_BASE_URL = `http://content.warframe.com/PublicExport/Manifest/`;

(async () => {
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

  const pairPrimes = <T extends { name: string }>(data: T[]) => {
    let results: T[][] = [];
    for (const item of data) {
      if (item.name.endsWith(" Prime")) {
        continue;
      }
      const primeItem = data.find((d) => d.name === `${item.name} Prime`);
      if (primeItem) {
        results.push([item, primeItem]);
      } else {
        results.push([item]);
      }
    }

    return results.sort((a, b) => a[0].name.localeCompare(b[0].name));
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/([-_ ][a-z])/gi, (group) => group.toUpperCase())
      .replace(/[-_ &'<>]/g, "")
      .replace(/^[A-Z]/, (group) => group.toLowerCase());
  };
  const toPascalCase = (str: string) => {
    const camel = toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  };
  const singularize = (str: string) => {
    if (str.endsWith("ies")) {
      return str.slice(0, -3) + "y";
    } else if (str.endsWith("s")) {
      return str.slice(0, -1);
    }
    return str;
  };

  const dedupe = <T extends { name: string }>(items: T[]) => {
    const seenItems = new Map<string, string>();
    return items.filter((item) => {
      const serialised = JSON.stringify(item);
      const name = item.name;
      if (seenItems.has(name)) {
        if (seenItems.get(name) === serialised) {
          return false;
        } else {
          throw new Error(`Conflicting items with name ${name}`);
        }
      }
      seenItems.set(name, serialised);
      return true;
    });
  };

  // write TS files for each category
  const writeCategoryFile = <T extends { name: string }>(
    category: string,
    typeName: string,
    _items: T[]
  ) => {
    const items = dedupe(_items.sort((a, b) => a.name.localeCompare(b.name)));
    const camelCategory = toCamelCase(category);
    const pascalCategory = toPascalCase(category);

    const itemNames = items.map((i) => i.name);
    const uniqueNames = new Set(itemNames);
    if (uniqueNames.size !== itemNames.length) {
      console.log(
        itemNames.filter(
          (name) => itemNames.filter((n) => n === name).length > 1
        )
      );
      throw new Error(`Duplicate names found in category ${category}`);
    }

    const itemNameToEntryMap = items.reduce(
      (acc, item) => ({
        ...acc,
        [toCamelCase(item.name)]: item,
      }),
      {} as Record<string, T>
    );

    const pairedPrimes = pairPrimes(items);
    let pairExport = "";
    if (pairedPrimes.some((pair) => pair.length > 1)) {
      pairExport = `export const ${singularize(
        camelCategory
      )}Primes = new Map<${typeName}, ${typeName}>();
${pairedPrimes
  .filter((pair) => pair.length > 1)
  .map((pair) => {
    const pairKeys = pair.map((item) => toCamelCase(item.name));
    return `${singularize(camelCategory)}Primes.set(${pairKeys[0]}, ${
      pairKeys[1]
    });`;
  })
  .join("\n")}`;
    }

    const filePath = path.join(
      __dirname,
      "../processed-data",
      `${category}.ts`
    );
    const content = `import { ${typeName}, DataSet } from '../data-types';

${Object.entries(itemNameToEntryMap)
  .map(
    ([key, value]) =>
      `export const ${key}: ${typeName} = ${JSON.stringify(value, null, 2)};`
  )
  .join("\n\n")}

export const ${camelCategory}ByName = {
${Object.keys(itemNameToEntryMap)
  .map((key) => `  "${itemNameToEntryMap[key].name}": ${key},`)
  .join("\n")}
} as const;

export type ${singularize(
      pascalCategory
    )}Name = keyof typeof ${camelCategory}ByName;${
      pairExport ? `\n\n${pairExport}` : ""
    }

export const ${camelCategory.toUpperCase()}: DataSet<${singularize(
      pascalCategory
    )}Name, ${typeName}> = {
  itemNames: Object.keys(${camelCategory}ByName) as ${singularize(
      pascalCategory
    )}Name[],
  itemsByName: ${camelCategory}ByName,
  primes: ${pairExport ? `${singularize(camelCategory)}Primes` : "undefined"},
};`;

    fs.writeFileSync(filePath, content);
  };

  writeCategoryFile("warframes", "WarframeData", warframes);
  writeCategoryFile("archwings", "WarframeData", archwings);
  writeCategoryFile("necramechs", "WarframeData", necramechs);
  writeCategoryFile("sentinels", "SentinelData", sentinels);
  writeCategoryFile("kubrows", "SentinelData", kubrows);
  writeCategoryFile("specialCompanions", "SentinelData", specialCompanions);
  writeCategoryFile("primaryWeapons", "WeaponData", primaryWeapons);
  writeCategoryFile("secondaryWeapons", "WeaponData", secondaryWeapons);
  writeCategoryFile("meleeWeapons", "WeaponData", meleeWeapons);
  writeCategoryFile("archwingGuns", "WeaponData", archwingGuns);
  writeCategoryFile("archwingMelee", "WeaponData", archwingMelee);
  writeCategoryFile("specialWeapons", "WeaponData", specialWeapons);
  writeCategoryFile("crewShipWeapons", "WeaponData", crewShipWeapons);
  writeCategoryFile("sentinelWeapons", "WeaponData", sentinelWeapons);
})();
