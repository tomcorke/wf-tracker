import { WeaponData, DataSet } from '../data-types';

export const aRCHWINGAgkuza: WeaponData = {
  "name": "<ARCHWING> Agkuza",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/ArchSwordHook/ArchHookSwordWeapon",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const aRCHWINGCentaur: WeaponData = {
  "name": "<ARCHWING> Centaur",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/Archswordandshield/ArchSwordShield",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const aRCHWINGKaszas: WeaponData = {
  "name": "<ARCHWING> Kaszas",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/ArchScythe/ArchScythe",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const aRCHWINGKnux: WeaponData = {
  "name": "<ARCHWING> Knux",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/GrnArchHand/GrnArchHandWeapon",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const aRCHWINGOnorix: WeaponData = {
  "name": "<ARCHWING> Onorix",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/Archaxe/ArchAxeWeapon",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const aRCHWINGPrismaVeritux: WeaponData = {
  "name": "<ARCHWING> Prisma Veritux",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/VoidTraderArchsword/VTArchSwordWeapon",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const aRCHWINGRathbone: WeaponData = {
  "name": "<ARCHWING> Rathbone",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/ArchHammer/ArchHammer",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const aRCHWINGVeritux: WeaponData = {
  "name": "<ARCHWING> Veritux",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/Archsword/ArchSwordWeapon",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const archwingMeleeByName = {
  "<ARCHWING> Agkuza": aRCHWINGAgkuza,
  "<ARCHWING> Centaur": aRCHWINGCentaur,
  "<ARCHWING> Kaszas": aRCHWINGKaszas,
  "<ARCHWING> Knux": aRCHWINGKnux,
  "<ARCHWING> Onorix": aRCHWINGOnorix,
  "<ARCHWING> Prisma Veritux": aRCHWINGPrismaVeritux,
  "<ARCHWING> Rathbone": aRCHWINGRathbone,
  "<ARCHWING> Veritux": aRCHWINGVeritux,
} as const;

export type ArchwingMeleeName = keyof typeof archwingMeleeByName;

export const ARCHWINGMELEE: DataSet<ArchwingMeleeName, WeaponData> = {
  itemNames: Object.keys(archwingMeleeByName) as ArchwingMeleeName[],
  itemsByName: archwingMeleeByName,
  primes: undefined,
};