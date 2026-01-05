import fs from "fs";
import path from "path";
import url from "url";

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
    .replace(/^\//, "")
    .replace(/[\/]/g, "_")
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

const dedupe = <T extends { uniqueName: string; name: string }>(items: T[]) => {
  const seenItems = new Map<string, string>();
  return items.filter((item) => {
    const _item = { ...item };
    _item.name = _item.name.replace("<ARCHWING> ", "").trim();
    const serialised = JSON.stringify(_item);
    const uniqueName = item.uniqueName;
    if (seenItems.has(uniqueName)) {
      if (seenItems.get(uniqueName) === serialised) {
        return false;
      } else {
        throw new Error(`Conflicting items with name ${uniqueName}`);
      }
    }
    seenItems.set(uniqueName, serialised);
    return true;
  });
};
// write TS files for each category
export const writeCategoryFile = <
  T extends { name: string; uniqueName: string }
>(
  category: string,
  typeName: string,
  _items: T[]
) => {
  const items = dedupe(_items.sort((a, b) => a.name.localeCompare(b.name)));
  const camelCategory = toCamelCase(category);
  const pascalCategory = toPascalCase(category);

  const itemNames = items.map((i) => i.uniqueName);
  const uniqueNames = new Set(itemNames);
  if (uniqueNames.size !== itemNames.length) {
    console.log(
      itemNames.filter((name) => itemNames.filter((n) => n === name).length > 1)
    );
    throw new Error(`Duplicate names found in category ${category}`);
  }

  const itemNameToEntryMap = items.reduce(
    (acc, item) => ({
      ...acc,
      [toCamelCase(item.uniqueName)]: {
        ...item,
        name: item.name.replace("<ARCHWING> ", "").trim(),
      },
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
    const pairKeys = pair.map((item) => toCamelCase(item.uniqueName));
    return `${singularize(camelCategory)}Primes.set(${pairKeys[0]}, ${
      pairKeys[1]
    });`;
  })
  .join("\n")}`;
  }

  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const filePath = path.join(
    __dirname,
    "../../processed-data",
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
  .map((key) => `  "${itemNameToEntryMap[key].uniqueName}": ${key},`)
  .join("\n")}
} as const;

export type ${singularize(
    pascalCategory
  )}Name = keyof typeof ${camelCategory}ByName;${
    pairExport ? `\n\n${pairExport}` : ""
  }

export const ${camelCategory}List: ${typeName}[] = [
${Object.keys(itemNameToEntryMap)
  .map((key) => `  ${key},`)
  .join("\n")}
];

export const ${camelCategory.toUpperCase()}: DataSet<${singularize(
    pascalCategory
  )}Name, ${typeName}> = {
  itemNames: Object.keys(${camelCategory}ByName) as ${singularize(
    pascalCategory
  )}Name[],
  itemsByName: ${camelCategory}ByName,
  items: ${camelCategory}List,
  primes: ${pairExport ? `${singularize(camelCategory)}Primes` : "undefined"},
};`;

  fs.writeFileSync(filePath, content);
};

export const listUnusedItemCategories = (
  dataRecord: Record<string, any>,
  ...itemsWithCategories: { productCategory: string }[][]
) => {
  const usedCategories = new Set<string>();
  for (const items of itemsWithCategories) {
    for (const item of items) {
      usedCategories.add(item.productCategory);
    }
  }

  const allCategories = new Set<string>();
  // Don't assume data structure, recursively scan to find all items with "productCategory"
  const findAllCategories = (data: any) => {
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.productCategory) {
          allCategories.add(item.productCategory);
        }
        findAllCategories(item);
      }
    } else if (typeof data === "object" && data !== null) {
      for (const key of Object.keys(data)) {
        findAllCategories(data[key]);
      }
    }
  };

  findAllCategories(dataRecord);

  const unusedCategories = Array.from(allCategories).filter(
    (cat) => !usedCategories.has(cat)
  );

  if (unusedCategories.length > 0) {
    console.log("Unused item categories:");
    for (const cat of unusedCategories) {
      console.log(`- ${cat}`);
    }
  } else {
    console.log("No unused item categories found.");
  }
};
