import { WeaponData, DataSet } from '../data-types';

export const lotus_Weapons_SolarisUnited_Secondary_SUModularSecondarySet1_Barrel_SUModularSecondaryBarrelAPart: WeaponData = {
  "name": "Catchmoon",
  "uniqueName": "/Lotus/Weapons/SolarisUnited/Secondary/SUModularSecondarySet1/Barrel/SUModularSecondaryBarrelAPart",
  "productCategory": "Pistols"
};

export const lotus_Weapons_SolarisUnited_Secondary_SUModularSecondarySet1_Barrel_SUModularSecondaryBarrelDPart: WeaponData = {
  "name": "Gaze",
  "uniqueName": "/Lotus/Weapons/SolarisUnited/Secondary/SUModularSecondarySet1/Barrel/SUModularSecondaryBarrelDPart",
  "productCategory": "Pistols"
};

export const lotus_Weapons_SolarisUnited_Secondary_SUModularSecondarySet1_Barrel_SUModularSecondaryBarrelCPart: WeaponData = {
  "name": "Rattleguts",
  "uniqueName": "/Lotus/Weapons/SolarisUnited/Secondary/SUModularSecondarySet1/Barrel/SUModularSecondaryBarrelCPart",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Infested_Pistols_InfKitGun_Barrels_InfBarrelEgg_InfModularBarrelEggPart: WeaponData = {
  "name": "Sporelacer",
  "uniqueName": "/Lotus/Weapons/Infested/Pistols/InfKitGun/Barrels/InfBarrelEgg/InfModularBarrelEggPart",
  "productCategory": "Pistols"
};

export const lotus_Weapons_SolarisUnited_Secondary_SUModularSecondarySet1_Barrel_SUModularSecondaryBarrelBPart: WeaponData = {
  "name": "Tombfinger",
  "uniqueName": "/Lotus/Weapons/SolarisUnited/Secondary/SUModularSecondarySet1/Barrel/SUModularSecondaryBarrelBPart",
  "productCategory": "Pistols"
};

export const lotus_Weapons_Infested_Pistols_InfKitGun_Barrels_InfBarrelBeam_InfModularBarrelBeamPart: WeaponData = {
  "name": "Vermisplicer",
  "uniqueName": "/Lotus/Weapons/Infested/Pistols/InfKitGun/Barrels/InfBarrelBeam/InfModularBarrelBeamPart",
  "productCategory": "Pistols"
};

export const kitgunsByName = {
  "/Lotus/Weapons/SolarisUnited/Secondary/SUModularSecondarySet1/Barrel/SUModularSecondaryBarrelAPart": lotus_Weapons_SolarisUnited_Secondary_SUModularSecondarySet1_Barrel_SUModularSecondaryBarrelAPart,
  "/Lotus/Weapons/SolarisUnited/Secondary/SUModularSecondarySet1/Barrel/SUModularSecondaryBarrelDPart": lotus_Weapons_SolarisUnited_Secondary_SUModularSecondarySet1_Barrel_SUModularSecondaryBarrelDPart,
  "/Lotus/Weapons/SolarisUnited/Secondary/SUModularSecondarySet1/Barrel/SUModularSecondaryBarrelCPart": lotus_Weapons_SolarisUnited_Secondary_SUModularSecondarySet1_Barrel_SUModularSecondaryBarrelCPart,
  "/Lotus/Weapons/Infested/Pistols/InfKitGun/Barrels/InfBarrelEgg/InfModularBarrelEggPart": lotus_Weapons_Infested_Pistols_InfKitGun_Barrels_InfBarrelEgg_InfModularBarrelEggPart,
  "/Lotus/Weapons/SolarisUnited/Secondary/SUModularSecondarySet1/Barrel/SUModularSecondaryBarrelBPart": lotus_Weapons_SolarisUnited_Secondary_SUModularSecondarySet1_Barrel_SUModularSecondaryBarrelBPart,
  "/Lotus/Weapons/Infested/Pistols/InfKitGun/Barrels/InfBarrelBeam/InfModularBarrelBeamPart": lotus_Weapons_Infested_Pistols_InfKitGun_Barrels_InfBarrelBeam_InfModularBarrelBeamPart,
} as const;

export type KitgunName = keyof typeof kitgunsByName;

export const kitgunsList: WeaponData[] = [
  lotus_Weapons_SolarisUnited_Secondary_SUModularSecondarySet1_Barrel_SUModularSecondaryBarrelAPart,
  lotus_Weapons_SolarisUnited_Secondary_SUModularSecondarySet1_Barrel_SUModularSecondaryBarrelDPart,
  lotus_Weapons_SolarisUnited_Secondary_SUModularSecondarySet1_Barrel_SUModularSecondaryBarrelCPart,
  lotus_Weapons_Infested_Pistols_InfKitGun_Barrels_InfBarrelEgg_InfModularBarrelEggPart,
  lotus_Weapons_SolarisUnited_Secondary_SUModularSecondarySet1_Barrel_SUModularSecondaryBarrelBPart,
  lotus_Weapons_Infested_Pistols_InfKitGun_Barrels_InfBarrelBeam_InfModularBarrelBeamPart,
];

export const KITGUNS: DataSet<KitgunName, WeaponData> = {
  itemNames: Object.keys(kitgunsByName) as KitgunName[],
  itemsByName: kitgunsByName,
  items: kitgunsList,
  primes: undefined,
};