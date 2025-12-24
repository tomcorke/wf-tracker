import { WarframeData, DataSet } from '../data-types';

export const bonewidow: WarframeData = {
  "name": "Bonewidow",
  "uniqueName": "/Lotus/Powersuits/EntratiMech/ThanoTech",
  "parentName": "/Lotus/Powersuits/EntratiMech/BaseMechSuit",
  "productCategory": "MechSuits"
};

export const voidrig: WarframeData = {
  "name": "Voidrig",
  "uniqueName": "/Lotus/Powersuits/EntratiMech/NechroTech",
  "parentName": "/Lotus/Powersuits/EntratiMech/BaseMechSuit",
  "productCategory": "MechSuits"
};

export const necramechsByName = {
  "Bonewidow": bonewidow,
  "Voidrig": voidrig,
} as const;

export type NecramechName = keyof typeof necramechsByName;

export const NECRAMECHS: DataSet<NecramechName, WarframeData> = {
  itemNames: Object.keys(necramechsByName) as NecramechName[],
  itemsByName: necramechsByName,
  primes: undefined,
};