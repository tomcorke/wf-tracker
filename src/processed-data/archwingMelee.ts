import { WeaponData, DataSet } from '../data-types';

export const lotus_Weapons_Tenno_Archwing_Melee_ArchSwordHook_ArchHookSwordWeapon: WeaponData = {
  "name": "Agkuza",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/ArchSwordHook/ArchHookSwordWeapon",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const lotus_Weapons_Tenno_Archwing_Melee_Archswordandshield_ArchSwordShield: WeaponData = {
  "name": "Centaur",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/Archswordandshield/ArchSwordShield",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const lotus_Weapons_Tenno_Archwing_Melee_ArchScythe_ArchScythe: WeaponData = {
  "name": "Kaszas",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/ArchScythe/ArchScythe",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const lotus_Weapons_Tenno_Archwing_Melee_GrnArchHand_GrnArchHandWeapon: WeaponData = {
  "name": "Knux",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/GrnArchHand/GrnArchHandWeapon",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const lotus_Weapons_Tenno_Archwing_Melee_Archaxe_ArchAxeWeapon: WeaponData = {
  "name": "Onorix",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/Archaxe/ArchAxeWeapon",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const lotus_Weapons_Tenno_Archwing_Melee_VoidTraderArchsword_VTArchSwordWeapon: WeaponData = {
  "name": "Prisma Veritux",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/VoidTraderArchsword/VTArchSwordWeapon",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const lotus_Weapons_Tenno_Archwing_Melee_ArchHammer_ArchHammer: WeaponData = {
  "name": "Rathbone",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/ArchHammer/ArchHammer",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const lotus_Weapons_Tenno_Archwing_Melee_Archsword_ArchSwordWeapon: WeaponData = {
  "name": "Veritux",
  "uniqueName": "/Lotus/Weapons/Tenno/Archwing/Melee/Archsword/ArchSwordWeapon",
  "productCategory": "SpaceMelee",
  "slot": 5
};

export const archwingMeleeByName = {
  "/Lotus/Weapons/Tenno/Archwing/Melee/ArchSwordHook/ArchHookSwordWeapon": lotus_Weapons_Tenno_Archwing_Melee_ArchSwordHook_ArchHookSwordWeapon,
  "/Lotus/Weapons/Tenno/Archwing/Melee/Archswordandshield/ArchSwordShield": lotus_Weapons_Tenno_Archwing_Melee_Archswordandshield_ArchSwordShield,
  "/Lotus/Weapons/Tenno/Archwing/Melee/ArchScythe/ArchScythe": lotus_Weapons_Tenno_Archwing_Melee_ArchScythe_ArchScythe,
  "/Lotus/Weapons/Tenno/Archwing/Melee/GrnArchHand/GrnArchHandWeapon": lotus_Weapons_Tenno_Archwing_Melee_GrnArchHand_GrnArchHandWeapon,
  "/Lotus/Weapons/Tenno/Archwing/Melee/Archaxe/ArchAxeWeapon": lotus_Weapons_Tenno_Archwing_Melee_Archaxe_ArchAxeWeapon,
  "/Lotus/Weapons/Tenno/Archwing/Melee/VoidTraderArchsword/VTArchSwordWeapon": lotus_Weapons_Tenno_Archwing_Melee_VoidTraderArchsword_VTArchSwordWeapon,
  "/Lotus/Weapons/Tenno/Archwing/Melee/ArchHammer/ArchHammer": lotus_Weapons_Tenno_Archwing_Melee_ArchHammer_ArchHammer,
  "/Lotus/Weapons/Tenno/Archwing/Melee/Archsword/ArchSwordWeapon": lotus_Weapons_Tenno_Archwing_Melee_Archsword_ArchSwordWeapon,
} as const;

export type ArchwingMeleeName = keyof typeof archwingMeleeByName;

export const archwingMeleeList: WeaponData[] = [
  lotus_Weapons_Tenno_Archwing_Melee_ArchSwordHook_ArchHookSwordWeapon,
  lotus_Weapons_Tenno_Archwing_Melee_Archswordandshield_ArchSwordShield,
  lotus_Weapons_Tenno_Archwing_Melee_ArchScythe_ArchScythe,
  lotus_Weapons_Tenno_Archwing_Melee_GrnArchHand_GrnArchHandWeapon,
  lotus_Weapons_Tenno_Archwing_Melee_Archaxe_ArchAxeWeapon,
  lotus_Weapons_Tenno_Archwing_Melee_VoidTraderArchsword_VTArchSwordWeapon,
  lotus_Weapons_Tenno_Archwing_Melee_ArchHammer_ArchHammer,
  lotus_Weapons_Tenno_Archwing_Melee_Archsword_ArchSwordWeapon,
];

export const ARCHWINGMELEE: DataSet<ArchwingMeleeName, WeaponData> = {
  itemNames: Object.keys(archwingMeleeByName) as ArchwingMeleeName[],
  itemsByName: archwingMeleeByName,
  items: archwingMeleeList,
  primes: undefined,
};