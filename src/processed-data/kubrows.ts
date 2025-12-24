import { SentinelData, DataSet } from '../data-types';

export const adarzaKavat: SentinelData = {
  "name": "Adarza Kavat",
  "uniqueName": "/Lotus/Types/Game/CatbrowPet/MirrorCatbrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const chesaKubrow: SentinelData = {
  "name": "Chesa Kubrow",
  "uniqueName": "/Lotus/Types/Game/KubrowPet/RetrieverKubrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const crescentVulpaphyla: SentinelData = {
  "name": "Crescent Vulpaphyla",
  "uniqueName": "/Lotus/Types/Friendly/Pets/CreaturePets/HornedInfestedCatbrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const helminthCharger: SentinelData = {
  "name": "Helminth Charger",
  "uniqueName": "/Lotus/Types/Game/KubrowPet/ChargerKubrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const hurasKubrow: SentinelData = {
  "name": "Huras Kubrow",
  "uniqueName": "/Lotus/Types/Game/KubrowPet/FurtiveKubrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const medjayPredasite: SentinelData = {
  "name": "Medjay Predasite",
  "uniqueName": "/Lotus/Types/Friendly/Pets/CreaturePets/MedjayPredatorKubrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const panzerVulpaphyla: SentinelData = {
  "name": "Panzer Vulpaphyla",
  "uniqueName": "/Lotus/Types/Friendly/Pets/CreaturePets/ArmoredInfestedCatbrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const pharaohPredasite: SentinelData = {
  "name": "Pharaoh Predasite",
  "uniqueName": "/Lotus/Types/Friendly/Pets/CreaturePets/PharaohPredatorKubrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const raksaKubrow: SentinelData = {
  "name": "Raksa Kubrow",
  "uniqueName": "/Lotus/Types/Game/KubrowPet/GuardKubrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const sahasaKubrow: SentinelData = {
  "name": "Sahasa Kubrow",
  "uniqueName": "/Lotus/Types/Game/KubrowPet/AdventurerKubrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const slyVulpaphyla: SentinelData = {
  "name": "Sly Vulpaphyla",
  "uniqueName": "/Lotus/Types/Friendly/Pets/CreaturePets/VulpineInfestedCatbrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const smeetaKavat: SentinelData = {
  "name": "Smeeta Kavat",
  "uniqueName": "/Lotus/Types/Game/CatbrowPet/CheshireCatbrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const sunikaKubrow: SentinelData = {
  "name": "Sunika Kubrow",
  "uniqueName": "/Lotus/Types/Game/KubrowPet/HunterKubrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const vascaKavat: SentinelData = {
  "name": "Vasca Kavat",
  "uniqueName": "/Lotus/Types/Game/CatbrowPet/VampireCatbrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const vizierPredasite: SentinelData = {
  "name": "Vizier Predasite",
  "uniqueName": "/Lotus/Types/Friendly/Pets/CreaturePets/VizierPredatorKubrowPetPowerSuit",
  "productCategory": "KubrowPets"
};

export const kubrowsByName = {
  "Adarza Kavat": adarzaKavat,
  "Chesa Kubrow": chesaKubrow,
  "Crescent Vulpaphyla": crescentVulpaphyla,
  "Helminth Charger": helminthCharger,
  "Huras Kubrow": hurasKubrow,
  "Medjay Predasite": medjayPredasite,
  "Panzer Vulpaphyla": panzerVulpaphyla,
  "Pharaoh Predasite": pharaohPredasite,
  "Raksa Kubrow": raksaKubrow,
  "Sahasa Kubrow": sahasaKubrow,
  "Sly Vulpaphyla": slyVulpaphyla,
  "Smeeta Kavat": smeetaKavat,
  "Sunika Kubrow": sunikaKubrow,
  "Vasca Kavat": vascaKavat,
  "Vizier Predasite": vizierPredasite,
} as const;

export type KubrowName = keyof typeof kubrowsByName;

export const KUBROWS: DataSet<KubrowName, SentinelData> = {
  itemNames: Object.keys(kubrowsByName) as KubrowName[],
  itemsByName: kubrowsByName,
  primes: undefined,
};