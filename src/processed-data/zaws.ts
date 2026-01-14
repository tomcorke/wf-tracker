import { WeaponData, DataSet } from '../data-types';

export const lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipOne: WeaponData = {
  "name": "Balla",
  "uniqueName": "/Lotus/Weapons/Ostron/Melee/ModularMelee01/Tip/TipOne",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipFour: WeaponData = {
  "name": "Cyath",
  "uniqueName": "/Lotus/Weapons/Ostron/Melee/ModularMelee01/Tip/TipFour",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipFive: WeaponData = {
  "name": "Dehtat",
  "uniqueName": "/Lotus/Weapons/Ostron/Melee/ModularMelee01/Tip/TipFive",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Ostron_Melee_ModularMelee02_Tip_TipEleven: WeaponData = {
  "name": "Dokrahm",
  "uniqueName": "/Lotus/Weapons/Ostron/Melee/ModularMelee02/Tip/TipEleven",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipSix: WeaponData = {
  "name": "Kronsh",
  "uniqueName": "/Lotus/Weapons/Ostron/Melee/ModularMelee01/Tip/TipSix",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipThree: WeaponData = {
  "name": "Mewan",
  "uniqueName": "/Lotus/Weapons/Ostron/Melee/ModularMelee01/Tip/TipThree",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipTwo: WeaponData = {
  "name": "Ooltha",
  "uniqueName": "/Lotus/Weapons/Ostron/Melee/ModularMelee01/Tip/TipTwo",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Ostron_Melee_ModularMelee02_Tip_TipTen: WeaponData = {
  "name": "Rabvee",
  "uniqueName": "/Lotus/Weapons/Ostron/Melee/ModularMelee02/Tip/TipTen",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Ostron_Melee_ModularMelee02_Tip_TipNine: WeaponData = {
  "name": "Sepfahn",
  "uniqueName": "/Lotus/Weapons/Ostron/Melee/ModularMelee02/Tip/TipNine",
  "productCategory": "Pistols"
};

export const zawsByName = {
  "/Lotus/Weapons/Ostron/Melee/ModularMelee01/Tip/TipOne": lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipOne,
  "/Lotus/Weapons/Ostron/Melee/ModularMelee01/Tip/TipFour": lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipFour,
  "/Lotus/Weapons/Ostron/Melee/ModularMelee01/Tip/TipFive": lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipFive,
  "/Lotus/Weapons/Ostron/Melee/ModularMelee02/Tip/TipEleven": lotus_Weapons_Ostron_Melee_ModularMelee02_Tip_TipEleven,
  "/Lotus/Weapons/Ostron/Melee/ModularMelee01/Tip/TipSix": lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipSix,
  "/Lotus/Weapons/Ostron/Melee/ModularMelee01/Tip/TipThree": lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipThree,
  "/Lotus/Weapons/Ostron/Melee/ModularMelee01/Tip/TipTwo": lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipTwo,
  "/Lotus/Weapons/Ostron/Melee/ModularMelee02/Tip/TipTen": lotus_Weapons_Ostron_Melee_ModularMelee02_Tip_TipTen,
  "/Lotus/Weapons/Ostron/Melee/ModularMelee02/Tip/TipNine": lotus_Weapons_Ostron_Melee_ModularMelee02_Tip_TipNine,
} as const;

export type ZawName = keyof typeof zawsByName;

export const zawsList: WeaponData[] = [
  lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipOne,
  lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipFour,
  lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipFive,
  lotus_Weapons_Ostron_Melee_ModularMelee02_Tip_TipEleven,
  lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipSix,
  lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipThree,
  lotus_Weapons_Ostron_Melee_ModularMelee01_Tip_TipTwo,
  lotus_Weapons_Ostron_Melee_ModularMelee02_Tip_TipTen,
  lotus_Weapons_Ostron_Melee_ModularMelee02_Tip_TipNine,
];

export const ZAWS: DataSet<ZawName, WeaponData> = {
  itemNames: Object.keys(zawsByName) as ZawName[],
  itemsByName: zawsByName,
  items: zawsList,
  primes: undefined,
};