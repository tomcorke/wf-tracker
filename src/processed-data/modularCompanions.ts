import { WeaponData, DataSet } from '../data-types';

export const lotus_Types_Friendly_Pets_ZanukaPets_ZanukaPetParts_ZanukaPetPartHeadB: WeaponData = {
  "name": "Bhaira Hound",
  "uniqueName": "/Lotus/Types/Friendly/Pets/ZanukaPets/ZanukaPetParts/ZanukaPetPartHeadB",
  "productCategory": "Pistols"
};

export const lotus_Types_Friendly_Pets_ZanukaPets_ZanukaPetParts_ZanukaPetPartHeadA: WeaponData = {
  "name": "Dorma Hound",
  "uniqueName": "/Lotus/Types/Friendly/Pets/ZanukaPets/ZanukaPetParts/ZanukaPetPartHeadA",
  "productCategory": "Pistols"
};

export const lotus_Types_Friendly_Pets_ZanukaPets_ZanukaPetParts_ZanukaPetPartHeadC: WeaponData = {
  "name": "Hec Hound",
  "uniqueName": "/Lotus/Types/Friendly/Pets/ZanukaPets/ZanukaPetParts/ZanukaPetPartHeadC",
  "productCategory": "Pistols"
};

export const lotus_Types_Friendly_Pets_MoaPets_MoaPetParts_MoaPetHeadLambeo: WeaponData = {
  "name": "Lambeo Moa",
  "uniqueName": "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadLambeo",
  "productCategory": "Pistols"
};

export const lotus_Types_Friendly_Pets_MoaPets_MoaPetParts_MoaPetHeadMelee: WeaponData = {
  "name": "Nychus Moa",
  "uniqueName": "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadMelee",
  "productCategory": "Pistols"
};

export const lotus_Types_Friendly_Pets_MoaPets_MoaPetParts_MoaPetHeadOloro: WeaponData = {
  "name": "Oloro Moa",
  "uniqueName": "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadOloro",
  "productCategory": "Pistols"
};

export const lotus_Types_Friendly_Pets_MoaPets_MoaPetParts_MoaPetHeadPara: WeaponData = {
  "name": "Para Moa",
  "uniqueName": "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadPara",
  "productCategory": "Pistols"
};

export const modularCompanionsByName = {
  "/Lotus/Types/Friendly/Pets/ZanukaPets/ZanukaPetParts/ZanukaPetPartHeadB": lotus_Types_Friendly_Pets_ZanukaPets_ZanukaPetParts_ZanukaPetPartHeadB,
  "/Lotus/Types/Friendly/Pets/ZanukaPets/ZanukaPetParts/ZanukaPetPartHeadA": lotus_Types_Friendly_Pets_ZanukaPets_ZanukaPetParts_ZanukaPetPartHeadA,
  "/Lotus/Types/Friendly/Pets/ZanukaPets/ZanukaPetParts/ZanukaPetPartHeadC": lotus_Types_Friendly_Pets_ZanukaPets_ZanukaPetParts_ZanukaPetPartHeadC,
  "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadLambeo": lotus_Types_Friendly_Pets_MoaPets_MoaPetParts_MoaPetHeadLambeo,
  "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadMelee": lotus_Types_Friendly_Pets_MoaPets_MoaPetParts_MoaPetHeadMelee,
  "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadOloro": lotus_Types_Friendly_Pets_MoaPets_MoaPetParts_MoaPetHeadOloro,
  "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadPara": lotus_Types_Friendly_Pets_MoaPets_MoaPetParts_MoaPetHeadPara,
} as const;

export type ModularCompanionName = keyof typeof modularCompanionsByName;

export const modularCompanionsList: WeaponData[] = [
  lotus_Types_Friendly_Pets_ZanukaPets_ZanukaPetParts_ZanukaPetPartHeadB,
  lotus_Types_Friendly_Pets_ZanukaPets_ZanukaPetParts_ZanukaPetPartHeadA,
  lotus_Types_Friendly_Pets_ZanukaPets_ZanukaPetParts_ZanukaPetPartHeadC,
  lotus_Types_Friendly_Pets_MoaPets_MoaPetParts_MoaPetHeadLambeo,
  lotus_Types_Friendly_Pets_MoaPets_MoaPetParts_MoaPetHeadMelee,
  lotus_Types_Friendly_Pets_MoaPets_MoaPetParts_MoaPetHeadOloro,
  lotus_Types_Friendly_Pets_MoaPets_MoaPetParts_MoaPetHeadPara,
];

export const MODULARCOMPANIONS: DataSet<ModularCompanionName, WeaponData> = {
  itemNames: Object.keys(modularCompanionsByName) as ModularCompanionName[],
  itemsByName: modularCompanionsByName,
  items: modularCompanionsList,
  primes: undefined,
};