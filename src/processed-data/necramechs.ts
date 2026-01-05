import { WarframeData, DataSet } from '../data-types';

export const lotus_Powersuits_EntratiMech_ThanoTech: WarframeData = {
  "name": "Bonewidow",
  "uniqueName": "/Lotus/Powersuits/EntratiMech/ThanoTech",
  "parentName": "/Lotus/Powersuits/EntratiMech/BaseMechSuit",
  "productCategory": "MechSuits"
};

export const lotus_Powersuits_EntratiMech_NechroTech: WarframeData = {
  "name": "Voidrig",
  "uniqueName": "/Lotus/Powersuits/EntratiMech/NechroTech",
  "parentName": "/Lotus/Powersuits/EntratiMech/BaseMechSuit",
  "productCategory": "MechSuits"
};

export const necramechsByName = {
  "/Lotus/Powersuits/EntratiMech/ThanoTech": lotus_Powersuits_EntratiMech_ThanoTech,
  "/Lotus/Powersuits/EntratiMech/NechroTech": lotus_Powersuits_EntratiMech_NechroTech,
} as const;

export type NecramechName = keyof typeof necramechsByName;

export const necramechsList: WarframeData[] = [
  lotus_Powersuits_EntratiMech_ThanoTech,
  lotus_Powersuits_EntratiMech_NechroTech,
];

export const NECRAMECHS: DataSet<NecramechName, WarframeData> = {
  itemNames: Object.keys(necramechsByName) as NecramechName[],
  itemsByName: necramechsByName,
  items: necramechsList,
  primes: undefined,
};