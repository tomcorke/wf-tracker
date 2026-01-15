import { WeaponData, DataSet } from '../data-types';

export const lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardSolarisA_HoverboardSolarisADeck: WeaponData = {
  "name": "Bad Baby",
  "uniqueName": "/Lotus/Types/Vehicles/Hoverboard/HoverboardParts/PartComponents/HoverboardSolarisA/HoverboardSolarisADeck",
  "productCategory": "Pistols"
};

export const lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardInfestedB_HoverboardInfestedBDeck: WeaponData = {
  "name": "Feverspine",
  "uniqueName": "/Lotus/Types/Vehicles/Hoverboard/HoverboardParts/PartComponents/HoverboardInfestedB/HoverboardInfestedBDeck",
  "productCategory": "Pistols"
};

export const lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardCorpusA_HoverboardCorpusADeck: WeaponData = {
  "name": "Flatbelly",
  "uniqueName": "/Lotus/Types/Vehicles/Hoverboard/HoverboardParts/PartComponents/HoverboardCorpusA/HoverboardCorpusADeck",
  "productCategory": "Pistols"
};

export const lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardCorpusB_HoverboardCorpusBDeck: WeaponData = {
  "name": "Needlenose",
  "uniqueName": "/Lotus/Types/Vehicles/Hoverboard/HoverboardParts/PartComponents/HoverboardCorpusB/HoverboardCorpusBDeck",
  "productCategory": "Pistols"
};

export const lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardCorpusC_HoverboardCorpusCDeck: WeaponData = {
  "name": "Runway",
  "uniqueName": "/Lotus/Types/Vehicles/Hoverboard/HoverboardParts/PartComponents/HoverboardCorpusC/HoverboardCorpusCDeck",
  "productCategory": "Pistols"
};

export const kdrivesByName = {
  "/Lotus/Types/Vehicles/Hoverboard/HoverboardParts/PartComponents/HoverboardSolarisA/HoverboardSolarisADeck": lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardSolarisA_HoverboardSolarisADeck,
  "/Lotus/Types/Vehicles/Hoverboard/HoverboardParts/PartComponents/HoverboardInfestedB/HoverboardInfestedBDeck": lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardInfestedB_HoverboardInfestedBDeck,
  "/Lotus/Types/Vehicles/Hoverboard/HoverboardParts/PartComponents/HoverboardCorpusA/HoverboardCorpusADeck": lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardCorpusA_HoverboardCorpusADeck,
  "/Lotus/Types/Vehicles/Hoverboard/HoverboardParts/PartComponents/HoverboardCorpusB/HoverboardCorpusBDeck": lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardCorpusB_HoverboardCorpusBDeck,
  "/Lotus/Types/Vehicles/Hoverboard/HoverboardParts/PartComponents/HoverboardCorpusC/HoverboardCorpusCDeck": lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardCorpusC_HoverboardCorpusCDeck,
} as const;

export type KdriveName = keyof typeof kdrivesByName;

export const kdrivesList: WeaponData[] = [
  lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardSolarisA_HoverboardSolarisADeck,
  lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardInfestedB_HoverboardInfestedBDeck,
  lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardCorpusA_HoverboardCorpusADeck,
  lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardCorpusB_HoverboardCorpusBDeck,
  lotus_Types_Vehicles_Hoverboard_HoverboardParts_PartComponents_HoverboardCorpusC_HoverboardCorpusCDeck,
];

export const KDRIVES: DataSet<KdriveName, WeaponData> = {
  itemNames: Object.keys(kdrivesByName) as KdriveName[],
  itemsByName: kdrivesByName,
  items: kdrivesList,
  primes: undefined,
};