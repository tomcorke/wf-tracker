import z from "zod";

export const WarframeDataSchema = z.object({
  name: z.string(),
  uniqueName: z.string(),
  parentName: z.string(),
  productCategory: z.string(),
});

export type WarframeData = z.infer<typeof WarframeDataSchema>;

export const WeaponDataSchema = z.object({
  name: z.string(),
  uniqueName: z.string(),
  productCategory: z.string(),
  slot: z.number().optional(),
  sentinel: z.boolean().optional(),
});

export type WeaponData = z.infer<typeof WeaponDataSchema>;

export const SentinelDataSchema = z.object({
  name: z.string(),
  uniqueName: z.string(),
  parentName: z.string().optional(),
  productCategory: z.string(),
});

export type SentinelData = z.infer<typeof SentinelDataSchema>;

export type DataRecord = {
  Warframes: WarframeData[];
  Weapons: WeaponData[];
  Sentinels: SentinelData[];
};

export type DataSet<K extends string, T> = {
  itemNames: K[];
  itemsByName: Record<K, T>;
  items: T[];
  primes?: Map<T, T>;
};

export const MiscItemSchema = z.object({
  name: z.string(),
  uniqueName: z.string(),
});

export type MiscItem = z.infer<typeof MiscItemSchema>;
